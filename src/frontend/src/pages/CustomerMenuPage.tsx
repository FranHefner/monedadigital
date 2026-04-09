import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, LogOut, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * CustomerMenuPage — placeholder for the authenticated Customer Menu module.
 * Route: /customer-menu (protected, post-login).
 * Distinct from the public /menu/:restaurantId route.
 */
export default function CustomerMenuPage() {
  const { t } = useTranslation(["modules", "auth"]);
  const { logout } = useAuth();

  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
        data-ocid="customer-menu-page"
      >
        <div className="rounded-full bg-accent/20 p-5">
          <ShoppingBag size={40} className="text-accent" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("modules:customer.title")}
          </h1>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            {t("modules:customer.description")}
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5 text-xs">
          <Clock size={12} />
          {t("modules:comingSoon")}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="gap-2 text-muted-foreground hover:text-foreground mt-2"
          data-ocid="customer-menu-logout-btn"
        >
          <LogOut size={15} />
          {t("auth:logout.button")}
        </Button>
      </div>
    </Layout>
  );
}
