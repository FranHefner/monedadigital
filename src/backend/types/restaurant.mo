// Restaurant domain types
module {
  // Full restaurant record stored on-chain
  public type Restaurant = {
    restaurantId : Text;
    name : Text;
    description : Text;
    city : Text;
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
    logoUrl : Text;
    isActive : Bool;
  };
};
