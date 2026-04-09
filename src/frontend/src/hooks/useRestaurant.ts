import { createActor } from "@/backend";
import type {
  Restaurant,
  RestaurantInput,
  UpdateRestaurantInput,
} from "@/backend";
import { loadConfig, useActor } from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Query Key ───────────────────────────────────────────────────────────────

const MY_RESTAURANT_KEY = ["myRestaurant"] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type SaveRestaurantArgs =
  | { mode: "create"; input: RestaurantInput }
  | { mode: "update"; restaurantId: string; input: UpdateRestaurantInput };

type SaveRestaurantError =
  | "alreadyExists"
  | "invalidInput"
  | "unauthorized"
  | "unknown";

export interface SaveRestaurantResult {
  success: boolean;
  error?: SaveRestaurantError;
  errorMessage?: string;
}

export interface UploadImageResult {
  url: string | null;
  error?: string;
}

// ─── useMyRestaurant ─────────────────────────────────────────────────────────

/**
 * Fetches the currently authenticated manager's restaurant.
 * Returns null if the manager hasn't created a restaurant yet.
 */
export function useMyRestaurant() {
  const { actor, isFetching: isActorLoading } = useActor(createActor);

  return useQuery<Restaurant | null>({
    queryKey: MY_RESTAURANT_KEY,
    queryFn: async (): Promise<Restaurant | null> => {
      if (!actor) return null;
      return actor.getMyRestaurant();
    },
    enabled: !!actor && !isActorLoading,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── useSaveRestaurant ───────────────────────────────────────────────────────

function mapBackendError(kind: string, message?: string): SaveRestaurantResult {
  if (kind === "alreadyExists")
    return { success: false, error: "alreadyExists" };
  if (kind === "invalidInput")
    return { success: false, error: "invalidInput", errorMessage: message };
  if (kind === "unauthorized") return { success: false, error: "unauthorized" };
  return { success: false, error: "unknown" };
}

/**
 * Mutation for creating or updating a restaurant.
 * Handles backend Result<Restaurant, Error_> and maps errors to typed strings.
 */
export function useSaveRestaurant() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<SaveRestaurantResult, Error, SaveRestaurantArgs>({
    mutationFn: async (args): Promise<SaveRestaurantResult> => {
      if (!actor) return { success: false, error: "unknown" };

      if (args.mode === "create") {
        const result = await actor.createRestaurant(args.input);
        if (result.__kind__ === "ok") return { success: true };
        const err = result.err;
        return mapBackendError(
          err.__kind__,
          "invalidInput" in err ? err.invalidInput : undefined,
        );
      }

      const result = await actor.updateRestaurant(
        args.restaurantId,
        args.input,
      );
      if (result.__kind__ === "ok") return { success: true };
      const err = result.err;
      return mapBackendError(
        err.__kind__,
        "invalidInput" in err ? err.invalidInput : undefined,
      );
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: MY_RESTAURANT_KEY });
      }
    },
  });
}

// ─── useUploadImage ──────────────────────────────────────────────────────────

/**
 * Returns an upload function that uploads a File to object-storage and
 * returns a durable URL that persists across page refreshes.
 * Uses StorageClient from @caffeineai/object-storage directly.
 */
export function useUploadImage() {
  const { actor } = useActor(createActor);

  const upload = async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadImageResult> => {
    if (!actor) return { url: null, error: "Actor not available" };

    try {
      const config = await loadConfig();

      const agent = new HttpAgent({ host: config.backend_host });

      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      const { hash } = await storageClient.putFile(bytes, onProgress);
      const durableUrl = await storageClient.getDirectURL(hash);

      return { url: durableUrl };
    } catch (err) {
      return {
        url: null,
        error: err instanceof Error ? err.message : "Upload failed",
      };
    }
  };

  return { upload, isActorReady: !!actor };
}
