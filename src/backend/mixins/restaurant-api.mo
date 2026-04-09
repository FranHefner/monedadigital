// Restaurant mixin — exposes public API for restaurant management and public QR access
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import RestaurantLib "../lib/restaurant";
import MappingLib "../lib/mapping";
import AuthLib "../lib/auth";
import RestaurantTypes "../types/restaurant";
import AuthTypes "../types/auth";
import CommonTypes "../types/common";

mixin (
  restaurants : RestaurantLib.RestaurantMap,
  slugs : RestaurantLib.SlugMap,
  managerMappings : MappingLib.ManagerRestaurantMap,
  users : AuthLib.UserMap,
) {

  // Public query — no auth required — used by QR landing page (backward compat)
  public query func getRestaurantPublic(
    restaurantId : Text
  ) : async ?RestaurantTypes.RestaurantPublic {
    RestaurantLib.getRestaurantPublic(restaurants, restaurantId);
  };

  // Public query — no auth required — look up restaurant by slug
  public query func getRestaurantBySlug(
    slug : Text
  ) : async ?RestaurantTypes.RestaurantPublic {
    RestaurantLib.getRestaurantBySlug(restaurants, slugs, slug);
  };

  // Authenticated: returns the restaurant linked to the calling MANAGER
  public query ({ caller }) func getMyRestaurant() : async ?RestaurantTypes.Restaurant {
    switch (MappingLib.getLinkedRestaurantId(managerMappings, caller)) {
      case null { null };
      case (?restaurantId) { RestaurantLib.getRestaurant(restaurants, restaurantId) };
    };
  };

  // MANAGER: create a new restaurant and auto-link to caller
  public shared ({ caller }) func createRestaurant(
    input : RestaurantTypes.RestaurantInput
  ) : async CommonTypes.Result<RestaurantTypes.Restaurant, CommonTypes.Error> {
    // Enforce MANAGER role
    switch (AuthLib.getUserRole(users, caller)) {
      case (?(#MANAGER)) {};
      case (?(#SUPER_ADMIN)) {};
      case _ { return #err(#unauthorized) };
    };

    let restaurantId = caller.toText() # "-" # Time.now().toText();
    let restaurant : RestaurantTypes.Restaurant = {
      restaurantId;
      name = input.name;
      description = input.description;
      city = input.city;
      slug = input.slug;
      logoUrl = switch (input.logoUrl) { case null ""; case (?v) v };
      backgroundColor = switch (input.backgroundColor) { case null ""; case (?v) v };
      backgroundImageUrl = switch (input.backgroundImageUrl) { case null ""; case (?v) v };
      pdfMenuUrl = switch (input.pdfMenuUrl) { case null ""; case (?v) v };
      isActive = input.isActive;
      createdAt = Time.now();
    };

    switch (RestaurantLib.addRestaurant(restaurants, slugs, restaurant)) {
      case (#err(e)) { #err(e) };
      case (#ok(r)) {
        // Auto-link the caller (manager) to the new restaurant
        ignore MappingLib.linkManagerToRestaurant(managerMappings, caller, restaurantId);
        #ok(r);
      };
    };
  };

  // MANAGER: update an existing restaurant owned by caller
  public shared ({ caller }) func updateRestaurant(
    restaurantId : Text,
    input : RestaurantTypes.UpdateRestaurantInput,
  ) : async CommonTypes.Result<RestaurantTypes.Restaurant, CommonTypes.Error> {
    // Enforce MANAGER role
    switch (AuthLib.getUserRole(users, caller)) {
      case (?(#MANAGER)) {};
      case (?(#SUPER_ADMIN)) {};
      case _ { return #err(#unauthorized) };
    };
    // Enforce ownership: caller must be linked to this restaurantId
    switch (MappingLib.getLinkedRestaurantId(managerMappings, caller)) {
      case null { return #err(#unauthorized) };
      case (?linked) {
        if (linked != restaurantId) { return #err(#unauthorized) };
      };
    };
    RestaurantLib.updateRestaurant(restaurants, slugs, input);
  };

  // SUPER_ADMIN: manually link a manager principal to a restaurant ID
  public shared ({ caller }) func linkManagerToRestaurant(
    managerId : Text,
    restaurantId : Text,
  ) : async CommonTypes.Result<(), CommonTypes.Error> {
    // Enforce SUPER_ADMIN role
    switch (AuthLib.getUserRole(users, caller)) {
      case (?(#SUPER_ADMIN)) {};
      case _ { return #err(#unauthorized) };
    };
    let managerPrincipal = Principal.fromText(managerId);
    MappingLib.linkManagerToRestaurant(managerMappings, managerPrincipal, restaurantId);
  };
};
