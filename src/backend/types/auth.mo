// Authentication and authorization domain types
module {
  // User roles supported by the platform
  public type UserRole = {
    #SUPER_ADMIN;
    #MANAGER;
    #WAITER;
    #KITCHEN;
  };

  // A registered user linked to an Internet Identity principal
  public type User = {
    userId : Principal;
    role : UserRole;
    createdAt : Int;
  };
};
