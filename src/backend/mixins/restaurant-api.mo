// Restaurant mixin — exposes public API for restaurant management and public QR access
import Map "mo:core/Map";
import RestaurantLib "../lib/restaurant";
import MappingLib "../lib/mapping";
import AuthLib "../lib/auth";
import RestaurantTypes "../types/restaurant";
import AuthTypes "../types/auth";
import CommonTypes "../types/common";

mixin (
  restaurants : RestaurantLib.RestaurantMap,
  managerMappings : MappingLib.ManagerRestaurantMap,
  users : AuthLib.UserMap,
) {

  // Public query — no auth required — used by QR landing page
  public query func getRestaurantPublic(
    restaurantId : Text
  ) : async ?RestaurantTypes.RestaurantPublic {
    Runtime.trap("not implemented");
  };

  // Authenticated: returns the restaurant linked to the calling MANAGER
  public query ({ caller }) func getLinkedRestaurant() : async ?RestaurantTypes.Restaurant {
    Runtime.trap("not implemented");
  };

  // Setup endpoint: creates a new restaurant record
  public shared ({ caller }) func addRestaurant(
    restaurant : RestaurantTypes.Restaurant
  ) : async CommonTypes.Result<RestaurantTypes.Restaurant, CommonTypes.Error> {
    Runtime.trap("not implemented");
  };

  // Setup endpoint: links a manager principal to a restaurant ID
  public shared ({ caller }) func linkManagerToRestaurant(
    managerId : Principal,
    restaurantId : Text,
  ) : async CommonTypes.Result<(), CommonTypes.Error> {
    Runtime.trap("not implemented");
  };
};
