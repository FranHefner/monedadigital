// Manager-to-restaurant mapping domain logic
import Map "mo:core/Map";
import CommonTypes "../types/common";

module {
  public type ManagerRestaurantMap = Map.Map<Principal, Text>;

  // Link a manager principal to a restaurant ID; overwrites existing mapping
  public func linkManagerToRestaurant(
    mappings : ManagerRestaurantMap,
    managerId : Principal,
    restaurantId : Text,
  ) : CommonTypes.Result<(), CommonTypes.Error> {
    Runtime.trap("not implemented");
  };

  // Retrieve the restaurant ID linked to a manager principal
  public func getLinkedRestaurantId(
    mappings : ManagerRestaurantMap,
    managerId : Principal,
  ) : ?Text {
    Runtime.trap("not implemented");
  };
};
