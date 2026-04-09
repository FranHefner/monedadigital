import type { backendInterface, UserRole } from "../backend";

export const mockBackend: backendInterface = {
  addRestaurant: async () => ({
    __kind__: "ok",
    ok: {
      restaurantId: "rest-001",
      name: "La Cocina de María",
      description: "Comida tradicional mexicana con sabor casero.",
      city: "Ciudad de México",
      logoUrl: "",
      backgroundColor: "#454C92",
      backgroundImageUrl: "",
      pdfMenuUrl: "",
      isActive: true,
      createdAt: BigInt(Date.now()),
    },
  }),

  getCurrentUserRole: async (): Promise<UserRole | null> => null,

  getLinkedRestaurant: async () => null,

  getRestaurantPublic: async (restaurantId: string) => ({
    restaurantId,
    name: "La Cocina de María",
    description:
      "Comida tradicional mexicana con sabor casero. Escanea el QR en tu mesa para ver nuestro menú digital.",
    logoUrl: "",
    isActive: true,
  }),

  linkManagerToRestaurant: async () => ({ __kind__: "ok", ok: null }),

  registerUser: async () => ({
    __kind__: "err",
    err: { __kind__: "notFound", notFound: null },
  }),
};
