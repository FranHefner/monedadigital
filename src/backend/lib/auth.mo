// Auth domain logic — stateless functions operating on injected state
import Map "mo:core/Map";
import AuthTypes "../types/auth";
import CommonTypes "../types/common";

module {
  public type UserMap = Map.Map<Principal, AuthTypes.User>;

  // Register a new user with the given role; returns error if already exists
  public func registerUser(
    users : UserMap,
    userId : Principal,
    role : AuthTypes.UserRole,
    now : Int,
  ) : CommonTypes.Result<AuthTypes.User, CommonTypes.Error> {
    Runtime.trap("not implemented");
  };

  // Look up a user by principal; returns null if not found
  public func getUser(users : UserMap, userId : Principal) : ?AuthTypes.User {
    Runtime.trap("not implemented");
  };

  // Get the role of a caller; returns null if not registered
  public func getUserRole(users : UserMap, userId : Principal) : ?AuthTypes.UserRole {
    Runtime.trap("not implemented");
  };
};
