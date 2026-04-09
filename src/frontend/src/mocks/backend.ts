import type { backendInterface, UserRole, Result, Result_1, Result_2 } from "../backend";

export const mockBackend: backendInterface = {
  createRestaurant: async (): Promise<Result> => ({
    __kind__: "ok",
    ok: {
      restaurantId: "rest-001",
      name: "La Cocina de María",
      description: "Comida tradicional mexicana con sabor casero.",
      city: "Ciudad de México",
      slug: "la-cocina-de-maria",
      logoUrl: "",
      backgroundColor: "#454C92",
      backgroundImageUrl: "",
      pdfMenuUrl: "",
      isActive: true,
      createdAt: BigInt(Date.now()),
    },
  }),

  getCurrentUserRole: async (): Promise<UserRole | null> => null,

  getMyRestaurant: async () => null,

  getRestaurantBySlug: async (_slug: string) => null,

  getRestaurantPublic: async (restaurantId: string) => ({
    restaurantId,
    name: "La Cocina de María",
    description:
      "Comida tradicional mexicana con sabor casero. Escanea el QR en tu mesa para ver nuestro menú digital.",
    logoUrl: "",
    isActive: true,
    slug: "la-cocina-de-maria",
  }),

  linkManagerToRestaurant: async (): Promise<Result_2> => ({ __kind__: "ok", ok: null }),

  registerUser: async (): Promise<Result_1> => ({
    __kind__: "err",
    err: { __kind__: "notFound", notFound: null },
  }),

  updateRestaurant: async (): Promise<Result> => ({
    __kind__: "ok",
    ok: {
      restaurantId: "rest-001",
      name: "La Cocina de María",
      description: "Comida tradicional mexicana con sabor casero.",
      city: "Ciudad de México",
      slug: "la-cocina-de-maria",
      logoUrl: "",
      backgroundColor: "#454C92",
      backgroundImageUrl: "",
      pdfMenuUrl: "",
      isActive: true,
      createdAt: BigInt(Date.now()),
    },
  }),
};
