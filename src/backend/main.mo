// Composition root — wires stable state and includes domain mixins
import Map "mo:core/Map";
import AuthTypes "types/auth";
import RestaurantTypes "types/restaurant";
import AuthLib "lib/auth";
import MappingLib "lib/mapping";
import RestaurantLib "lib/restaurant";
import AuthMixin "mixins/auth-api";
import RestaurantMixin "mixins/restaurant-api";

actor {
  // Auth state: principal -> User
  let users : AuthLib.UserMap = Map.empty<Principal, AuthTypes.User>();

  // Restaurant state: restaurantId -> Restaurant
  let restaurants : RestaurantLib.RestaurantMap = Map.empty<Text, RestaurantTypes.Restaurant>();

  // Mapping state: manager principal -> restaurantId
  let managerMappings : MappingLib.ManagerRestaurantMap = Map.empty<Principal, Text>();

  // Include domain mixins, injecting required state slices
  include AuthMixin(users);
  include RestaurantMixin(restaurants, managerMappings, users);
};
