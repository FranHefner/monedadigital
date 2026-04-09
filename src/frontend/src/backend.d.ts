import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Result_2 = {
    __kind__: "ok";
    ok: Restaurant;
} | {
    __kind__: "err";
    err: Error_;
};
export type Result = {
    __kind__: "ok";
    ok: User;
} | {
    __kind__: "err";
    err: Error_;
};
export interface RestaurantPublic {
    name: string;
    description: string;
    isActive: boolean;
    restaurantId: string;
    logoUrl: string;
}
export interface User {
    userId: Principal;
    createdAt: bigint;
    role: UserRole;
}
export type Error_ = {
    __kind__: "alreadyExists";
    alreadyExists: null;
} | {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "notFound";
    notFound: null;
} | {
    __kind__: "unauthorized";
    unauthorized: null;
};
export interface Restaurant {
    backgroundColor: string;
    backgroundImageUrl: string;
    city: string;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    restaurantId: string;
    logoUrl: string;
    pdfMenuUrl: string;
}
export type Result_1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export enum UserRole {
    WAITER = "WAITER",
    MANAGER = "MANAGER",
    SUPER_ADMIN = "SUPER_ADMIN",
    KITCHEN = "KITCHEN"
}
export interface backendInterface {
    addRestaurant(restaurant: Restaurant): Promise<Result_2>;
    getCurrentUserRole(): Promise<UserRole | null>;
    getLinkedRestaurant(): Promise<Restaurant | null>;
    getRestaurantPublic(restaurantId: string): Promise<RestaurantPublic | null>;
    linkManagerToRestaurant(managerId: Principal, restaurantId: string): Promise<Result_1>;
    registerUser(role: UserRole): Promise<Result>;
}
