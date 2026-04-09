import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, LayoutDashboard, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * ManagerPage — placeholder for the Manager Panel module.
 * Protected: MANAGER role only.
 */
export default function ManagerPage() {
  const { t } = useTranslation(["modules", "auth"]);
  const { logout } = useAuth();

  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
        data-ocid="manager-page"
      >
        <div className="rounded-full bg-primary/10 p-5">
          <LayoutDashboard size={40} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("modules:manager.title")}
          </h1>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            {t("modules:manager.description")}
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
          data-ocid="manager-logout-btn"
        >
          <LogOut size={15} />
          {t("auth:logout.button")}
        </Button>
      </div>
    </Layout>
  );
}
