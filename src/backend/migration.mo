// Migration: adds slug field to Restaurant and builds slug index
import Map "mo:core/Map";
import RestaurantTypes "types/restaurant";

module {
  // Old Restaurant type from previous canister version (no slug field)
  type OldRestaurant = {
    restaurantId : Text;
    name : Text;
    description : Text;
    city : Text;
    logoUrl : Text;
    backgroundColor : Text;
    backgroundImageUrl : Text;
    pdfMenuUrl : Text;
    isActive : Bool;
    createdAt : Int;
  };

  type OldActor = {
    restaurants : Map.Map<Text, OldRestaurant>;
  };

  type NewActor = {
    restaurants : Map.Map<Text, RestaurantTypes.Restaurant>;
    slugs : Map.Map<Text, Text>;
    superAdminRef : { var value : ?Principal };
  };

  public func run(old : OldActor) : NewActor {
    // Migrate each restaurant: add slug derived from restaurantId as fallback
    let newRestaurants = old.restaurants.map<Text, OldRestaurant, RestaurantTypes.Restaurant>(
      func(id, r) {
        { r with slug = "" };
      }
    );

    // Build slug index from migrated restaurants (only non-empty slugs would be indexed,
    // but since we default to "", we leave the index empty to avoid duplicate key issues)
    let newSlugs = Map.empty<Text, Text>();

    { restaurants = newRestaurants; slugs = newSlugs; superAdminRef = { var value = null } };
  };
};
