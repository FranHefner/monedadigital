import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { BarChart2, ChevronRight, QrCode, Store, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ModuleCard {
  icon: ReactNode;
  titleKey: string;
  descriptionKey: string;
  href?: string;
  comingSoon?: boolean;
}

const modules: ModuleCard[] = [
  {
    icon: <Store size={28} />,
    titleKey: "modules:myRestaurant.title",
    descriptionKey: "modules:myRestaurant.description",
    href: "/manager/restaurant",
  },
  {
    icon: <QrCode size={28} />,
    titleKey: "modules:menuQr.title",
    descriptionKey: "modules:menuQr.description",
    href: "/manager/menu-qr",
  },
  {
    icon: <Users size={28} />,
    titleKey: "modules:staff.title",
    descriptionKey: "modules:staff.description",
    comingSoon: true,
  },
  {
    icon: <BarChart2 size={28} />,
    titleKey: "modules:dashboard.title",
    descriptionKey: "modules:dashboard.description",
    comingSoon: true,
  },
];

/**
 * ManagerPage — Manager Portal home screen.
 * Displays 4 module cards in a 2x2 grid (desktop) or 1-column layout (mobile).
 */
export default function ManagerPage() {
  const { t } = useTranslation(["modules", "auth"]);
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-4" data-ocid="manager-portal">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("modules:portal.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("modules:manager.description")}
          </p>
        </div>

        {/* Module cards grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          data-ocid="module-grid"
        >
          {modules.map((mod) => {
            const isActive = !mod.comingSoon;
            return (
              <div
                key={mod.titleKey}
                role={isActive ? "button" : undefined}
                tabIndex={isActive ? 0 : undefined}
                onClick={() =>
                  isActive && mod.href && navigate({ to: mod.href })
                }
                onKeyDown={(e) => {
                  if (
                    isActive &&
                    mod.href &&
                    (e.key === "Enter" || e.key === " ")
                  ) {
                    e.preventDefault();
                    navigate({ to: mod.href });
                  }
                }}
                data-ocid={`module-card-${mod.titleKey.split(".")[1]}`}
                className={[
                  "relative card-elevated p-6 flex items-start gap-4",
                  isActive
                    ? "cursor-pointer hover:border-primary hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    : "cursor-default opacity-80",
                ].join(" ")}
              >
                {/* Coming soon badge */}
                {mod.comingSoon && (
                  <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 text-xs px-2 py-0.5"
                    data-ocid="coming-soon-badge"
                  >
                    {t("modules:comingSoon")}
                  </Badge>
                )}

                {/* Icon */}
                <div
                  className={[
                    "rounded-xl p-3 flex-shrink-0 transition-smooth",
                    isActive
                      ? "bg-primary/10 text-primary group-hover:bg-primary/20"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {mod.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pr-6">
                  <h2 className="font-display font-semibold text-foreground text-base leading-snug">
                    {t(mod.titleKey)}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    {t(mod.descriptionKey)}
                  </p>
                </div>

                {/* Arrow — only for active modules */}
                {isActive && (
                  <ChevronRight
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-smooth"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
