import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export type UserRole = "SUPER_ADMIN" | "MANAGER" | "WAITER" | "KITCHEN";

/**
 * useUserRole — queries the backend for the current user's role.
 * Returns null if not authenticated or role not found.
 */
export function useUserRole() {
  const { isAuthenticated, principal } = useAuth();
  const { actor, isFetching: isActorLoading } = useActor(createActor);

  const query = useQuery<UserRole | null>({
    queryKey: ["userRole", principal],
    queryFn: async (): Promise<UserRole | null> => {
      if (!actor) return null;
      return actor.getCurrentUserRole() as Promise<UserRole | null>;
    },
    enabled: isAuthenticated && !!actor && !isActorLoading,
    staleTime: 5 * 60 * 1000,
  });

  return {
    role: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Returns the home route for a given role.
 */
export function getRoleRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    SUPER_ADMIN: "/admin",
    MANAGER: "/manager",
    WAITER: "/waiter",
    KITCHEN: "/kitchen",
  };
  return routes[role];
}
