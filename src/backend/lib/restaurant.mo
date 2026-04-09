// Restaurant domain logic — stateless functions operating on injected state
import Map "mo:core/Map";
import RestaurantTypes "../types/restaurant";
import CommonTypes "../types/common";

module {
  public type RestaurantMap = Map.Map<Text, RestaurantTypes.Restaurant>;

  // Create a new restaurant record; returns error if restaurantId already exists
  public func addRestaurant(
    restaurants : RestaurantMap,
    restaurant : RestaurantTypes.Restaurant,
    now : Int,
  ) : CommonTypes.Result<RestaurantTypes.Restaurant, CommonTypes.Error> {
    Runtime.trap("not implemented");
  };

  // Retrieve a restaurant by ID for public QR display
  public func getRestaurantPublic(
    restaurants : RestaurantMap,
    restaurantId : Text,
  ) : ?RestaurantTypes.RestaurantPublic {
    Runtime.trap("not implemented");
  };

  // Retrieve the full restaurant record by ID (for authenticated managers)
  public func getRestaurant(
    restaurants : RestaurantMap,
    restaurantId : Text,
  ) : ?RestaurantTypes.Restaurant {
    Runtime.trap("not implemented");
  };
};
