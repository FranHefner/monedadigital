// Auth mixin — exposes public API for authentication and role management
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AuthLib "../lib/auth";
import AuthTypes "../types/auth";
import CommonTypes "../types/common";

mixin (users : AuthLib.UserMap) {

  // Register the calling principal with a role (for initial setup)
  public shared ({ caller }) func registerUser(
    role : AuthTypes.UserRole
  ) : async CommonTypes.Result<AuthTypes.User, CommonTypes.Error> {
    Runtime.trap("not implemented");
  };

  // Query the role of the calling principal; null if not registered
  public query ({ caller }) func getCurrentUserRole() : async ?AuthTypes.UserRole {
    Runtime.trap("not implemented");
  };
};
