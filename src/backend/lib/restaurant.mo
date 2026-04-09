// Restaurant domain logic — stateless functions operating on injected state
import Map "mo:core/Map";
import RestaurantTypes "../types/restaurant";
import CommonTypes "../types/common";

module {
  public type RestaurantMap = Map.Map<Text, RestaurantTypes.Restaurant>;
  // slug -> restaurantId index for uniqueness enforcement
  public type SlugMap = Map.Map<Text, Text>;

  // Validate slug format: lowercase letters, numbers, and hyphens only; non-empty
  func isValidSlug(slug : Text) : Bool {
    if (slug.size() == 0) { return false };
    slug.toIter().all(func(c : Char) : Bool {
      (c >= 'a' and c <= 'z') or (c >= '0' and c <= '9') or c == '-'
    });
  };

  // Project a full restaurant to its public view
  func toPublic(r : RestaurantTypes.Restaurant) : RestaurantTypes.RestaurantPublic {
    {
      restaurantId = r.restaurantId;
      name = r.name;
      description = r.description;
      slug = r.slug;
      logoUrl = r.logoUrl;
      isActive = r.isActive;
    };
  };

  // Create a new restaurant record; returns error if restaurantId or slug already exists
  public func addRestaurant(
    restaurants : RestaurantMap,
    slugs : SlugMap,
    restaurant : RestaurantTypes.Restaurant,
  ) : CommonTypes.Result<RestaurantTypes.Restaurant, CommonTypes.Error> {
    // Validate slug format
    if (not isValidSlug(restaurant.slug)) {
      return #err(#invalidInput("Slug must contain only lowercase letters, numbers, and hyphens"));
    };
    // Enforce slug uniqueness
    switch (slugs.get(restaurant.slug)) {
      case (?_existing) { return #err(#alreadyExists) };
      case null {};
    };
    // Enforce restaurantId uniqueness
    switch (restaurants.get(restaurant.restaurantId)) {
      case (?_existing) { return #err(#alreadyExists) };
      case null {};
    };
    restaurants.add(restaurant.restaurantId, restaurant);
    slugs.add(restaurant.slug, restaurant.restaurantId);
    #ok(restaurant);
  };

  // Update an existing restaurant; returns error if not found or if new slug is taken by another restaurant
  public func updateRestaurant(
    restaurants : RestaurantMap,
    slugs : SlugMap,
    input : RestaurantTypes.UpdateRestaurantInput,
  ) : CommonTypes.Result<RestaurantTypes.Restaurant, CommonTypes.Error> {
    switch (restaurants.get(input.restaurantId)) {
      case null { #err(#notFound) };
      case (?existing) {
        // Handle optional slug change
        let newSlug : Text = switch (input.slug) {
          case null { existing.slug };
          case (?s) { s };
        };

        // Validate and enforce uniqueness if slug changed
        if (newSlug != existing.slug) {
          if (not isValidSlug(newSlug)) {
            return #err(#invalidInput("Slug must contain only lowercase letters, numbers, and hyphens"));
          };
          switch (slugs.get(newSlug)) {
            case (?_taken) { return #err(#alreadyExists) };
            case null {};
          };
          // Remove old slug entry and add new one
          slugs.remove(existing.slug);
          slugs.add(newSlug, input.restaurantId);
        };

        let updated : RestaurantTypes.Restaurant = {
          restaurantId = existing.restaurantId;
          name = switch (input.name) { case null existing.name; case (?v) v };
          description = switch (input.description) { case null existing.description; case (?v) v };
          city = switch (input.city) { case null existing.city; case (?v) v };
          slug = newSlug;
          logoUrl = switch (input.logoUrl) { case null existing.logoUrl; case (?v) v };
          backgroundColor = switch (input.backgroundColor) { case null existing.backgroundColor; case (?v) v };
          backgroundImageUrl = switch (input.backgroundImageUrl) { case null existing.backgroundImageUrl; case (?v) v };
          pdfMenuUrl = switch (input.pdfMenuUrl) { case null existing.pdfMenuUrl; case (?v) v };
          isActive = switch (input.isActive) { case null existing.isActive; case (?v) v };
          createdAt = existing.createdAt;
        };
        restaurants.add(updated.restaurantId, updated);
        #ok(updated);
      };
    };
  };

  // Retrieve a restaurant by ID for public QR display
  public func getRestaurantPublic(
    restaurants : RestaurantMap,
    restaurantId : Text,
  ) : ?RestaurantTypes.RestaurantPublic {
    switch (restaurants.get(restaurantId)) {
      case null { null };
      case (?r) { ?toPublic(r) };
    };
  };

  // Retrieve the full restaurant record by ID (for authenticated managers)
  public func getRestaurant(
    restaurants : RestaurantMap,
    restaurantId : Text,
  ) : ?RestaurantTypes.Restaurant {
    restaurants.get(restaurantId);
  };

  // Look up a restaurant by slug and return public view; null if not found
  public func getRestaurantBySlug(
    restaurants : RestaurantMap,
    slugs : SlugMap,
    slug : Text,
  ) : ?RestaurantTypes.RestaurantPublic {
    switch (slugs.get(slug)) {
      case null { null };
      case (?restaurantId) {
        switch (restaurants.get(restaurantId)) {
          case null { null };
          case (?r) { ?toPublic(r) };
        };
      };
    };
  };
};
