// Auth mixin — exposes public API for authentication and role management
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AuthLib "../lib/auth";
import AuthTypes "../types/auth";
import CommonTypes "../types/common";

mixin (users : AuthLib.UserMap, superAdmin : { var value : ?Principal }) {

  // Register the calling principal — SUPER_ADMIN if first user, MANAGER otherwise
  public shared ({ caller }) func registerUser() : async CommonTypes.Result<AuthTypes.User, CommonTypes.Error> {
    let role : AuthTypes.UserRole = if (users.isEmpty()) {
      // First user becomes SUPER_ADMIN; store their principal for future admin checks
      superAdmin.value := ?caller;
      #SUPER_ADMIN;
    } else {
      #MANAGER;
    };
    AuthLib.registerUser(users, caller, role, Time.now());
  };

  // Query the role of the calling principal; null if not registered
  public query ({ caller }) func getCurrentUserRole() : async ?AuthTypes.UserRole {
    AuthLib.getUserRole(users, caller);
  };
};
