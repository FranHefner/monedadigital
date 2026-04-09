// Common cross-cutting types shared across all domains
module {
  public type Timestamp = Int;

  // Shared Result type for update operations
  public type Result<T, E> = { #ok : T; #err : E };
  public type Error = { #notFound; #alreadyExists; #unauthorized; #invalidInput : Text };
};
