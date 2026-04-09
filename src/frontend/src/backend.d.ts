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
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type Result = {
    __kind__: "ok";
    ok: Restaurant;
} | {
    __kind__: "err";
    err: Error_;
};
export interface RestaurantPublic {
    name: string;
    slug: string;
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
export interface RestaurantInput {
    backgroundColor?: string;
    backgroundImageUrl?: string;
    city: string;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    logoUrl?: string;
    pdfMenuUrl?: string;
}
export interface Restaurant {
    backgroundColor: string;
    backgroundImageUrl: string;
    city: string;
    name: string;
    createdAt: bigint;
    slug: string;
    description: string;
    isActive: boolean;
    restaurantId: string;
    logoUrl: string;
    pdfMenuUrl: string;
}
export type Result_1 = {
    __kind__: "ok";
    ok: User;
} | {
    __kind__: "err";
    err: Error_;
};
export interface UpdateRestaurantInput {
    backgroundColor?: string;
    backgroundImageUrl?: string;
    city?: string;
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    restaurantId: string;
    logoUrl?: string;
    pdfMenuUrl?: string;
}
export enum UserRole {
    WAITER = "WAITER",
    MANAGER = "MANAGER",
    SUPER_ADMIN = "SUPER_ADMIN",
    KITCHEN = "KITCHEN"
}
export interface backendInterface {
    createRestaurant(input: RestaurantInput): Promise<Result>;
    getCurrentUserRole(): Promise<UserRole | null>;
    getMyRestaurant(): Promise<Restaurant | null>;
    getRestaurantBySlug(slug: string): Promise<RestaurantPublic | null>;
    getRestaurantPublic(restaurantId: string): Promise<RestaurantPublic | null>;
    linkManagerToRestaurant(managerId: string, restaurantId: string): Promise<Result_2>;
    registerUser(): Promise<Result_1>;
    updateRestaurant(restaurantId: string, input: UpdateRestaurantInput): Promise<Result>;
}
