// Composition root — wires stable state and includes domain mixins
import Map "mo:core/Map";
import AuthTypes "types/auth";
import RestaurantTypes "types/restaurant";
import AuthLib "lib/auth";
import MappingLib "lib/mapping";
import RestaurantLib "lib/restaurant";
import AuthMixin "mixins/auth-api";
import RestaurantMixin "mixins/restaurant-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Auth state: principal -> User
  let users : AuthLib.UserMap = Map.empty<Principal, AuthTypes.User>();

  // Wrapper object so mixins can mutate the super admin variable via shared reference
  let superAdminRef = { var value : ?Principal = null };

  // Restaurant state: restaurantId -> Restaurant
  let restaurants : RestaurantLib.RestaurantMap = Map.empty<Text, RestaurantTypes.Restaurant>();

  // Slug uniqueness index: slug -> restaurantId
  let slugs : RestaurantLib.SlugMap = Map.empty<Text, Text>();

  // Mapping state: manager principal -> restaurantId
  let managerMappings : MappingLib.ManagerRestaurantMap = Map.empty<Principal, Text>();

  // Include domain mixins, injecting required state slices
  include AuthMixin(users, superAdminRef);
  include RestaurantMixin(restaurants, slugs, managerMappings, users);
};
