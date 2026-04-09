import { createActor } from "@/backend";
import type { RestaurantPublic } from "@/backend";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { AlertCircle, MapPin, Store } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * MenuPage — public restaurant menu page accessible via QR scan.
 * Route: /menu/:restaurantId (no auth required).
 * Fetches and displays restaurant data from the backend canister.
 */
export default function MenuPage() {
  const { t } = useTranslation(["modules", "errors"]);
  const { restaurantId } = useParams({ strict: false }) as {
    restaurantId: string;
  };
  const { actor, isFetching: isActorLoading } = useActor(createActor);

  const {
    data: restaurant,
    isLoading,
    isError,
  } = useQuery<RestaurantPublic | null>({
    queryKey: ["restaurant-public", restaurantId],
    queryFn: async () => {
      if (!actor || !restaurantId) return null;
      return actor.getRestaurantPublic(restaurantId);
    },
    enabled: !!actor && !isActorLoading && !!restaurantId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const showLoading = isLoading || isActorLoading;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="menu-page"
    >
      {/* Public header — no auth actions */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-xs">
        <div className="container flex h-14 items-center justify-between px-4">
          <img
            src="/assets/logo.png"
            alt="monedaDigital"
            className="h-8 w-auto object-contain"
          />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container px-4 py-8 max-w-lg mx-auto">
        {showLoading && <RestaurantSkeleton />}

        {!showLoading && isError && (
          <ErrorState message={t("errors:generic")} />
        )}

        {!showLoading && !isError && restaurant === null && (
          <ErrorState
            message={t("errors:restaurantNotFound")}
            description={t("errors:restaurantInactive")}
          />
        )}

        {!showLoading && !isError && restaurant && !restaurant.isActive && (
          <ErrorState message={t("errors:restaurantInactive")} />
        )}

        {!showLoading && !isError && restaurant && restaurant.isActive && (
          <RestaurantCard restaurant={restaurant} />
        )}
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border bg-muted/40">
        © {new Date().getFullYear()} monedaDigital.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function RestaurantSkeleton() {
  return (
    <div className="flex flex-col gap-5 pt-4" data-ocid="menu-loading">
      {/* Logo skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
      {/* Name */}
      <Skeleton className="h-7 w-48 mx-auto" />
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5 mx-auto" />
        <Skeleton className="h-4 w-3/5 mx-auto" />
      </div>
    </div>
  );
}

interface RestaurantCardProps {
  restaurant: RestaurantPublic;
}

function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { t } = useTranslation(["modules"]);
  return (
    <div
      className="flex flex-col items-center gap-6 pt-4 text-center"
      data-ocid="menu-restaurant-card"
    >
      {/* Restaurant logo or fallback icon */}
      {restaurant.logoUrl ? (
        <div className="h-28 w-28 rounded-full border-2 border-border overflow-hidden shadow-sm bg-card flex items-center justify-center">
          <img
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML =
                  '<div class="h-full w-full flex items-center justify-center bg-primary/10"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg></div>';
              }
            }}
          />
        </div>
      ) : (
        <div className="h-28 w-28 rounded-full bg-primary/10 border-2 border-border shadow-sm flex items-center justify-center">
          <Store size={40} className="text-primary" />
        </div>
      )}

      {/* Restaurant info */}
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
          {restaurant.name}
        </h1>
        {restaurant.description && (
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            {restaurant.description}
          </p>
        )}
      </div>

      {/* Coming-soon badge for menu content */}
      <div className="w-full max-w-sm bg-muted/40 rounded-xl border border-border p-5 flex flex-col items-center gap-3">
        <MapPin size={20} className="text-accent" />
        <p className="text-sm text-muted-foreground font-medium">
          {t("modules:comingSoon")}
        </p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  description?: string;
}

function ErrorState({ message, description }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center"
      data-ocid="menu-error"
    >
      <div className="rounded-full bg-destructive/10 p-5">
        <AlertCircle size={36} className="text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="font-display text-lg font-bold text-foreground">
          {message}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
