// Restaurant domain types
module {
  // Full restaurant record stored on-chain
  public type Restaurant = {
    restaurantId : Text;
    name : Text;
    description : Text;
    city : Text;
    slug : Text;
    logoUrl : Text;
    backgroundColor : Text;
    backgroundImageUrl : Text;
    pdfMenuUrl : Text;
    isActive : Bool;
    createdAt : Int;
  };

  // Public-facing restaurant info returned to unauthenticated QR visitors
  public type RestaurantPublic = {
    restaurantId : Text;
    name : Text;
    description : Text;
    slug : Text;
    logoUrl : Text;
    isActive : Bool;
  };

  // Input type for creating a new restaurant
  public type RestaurantInput = {
    name : Text;
    description : Text;
    city : Text;
    slug : Text;
    logoUrl : ?Text;
    backgroundColor : ?Text;
    backgroundImageUrl : ?Text;
    pdfMenuUrl : ?Text;
    isActive : Bool;
  };

  // Input type for updating an existing restaurant (restaurantId required, all other fields optional)
  public type UpdateRestaurantInput = {
    restaurantId : Text;
    name : ?Text;
    description : ?Text;
    city : ?Text;
    slug : ?Text;
    logoUrl : ?Text;
    backgroundColor : ?Text;
    backgroundImageUrl : ?Text;
    pdfMenuUrl : ?Text;
    isActive : ?Bool;
  };
};
