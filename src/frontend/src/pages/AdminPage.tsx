import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, LogOut, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * AdminPage — placeholder for the Super Admin Panel module.
 * Protected: SUPER_ADMIN role only.
 */
export default function AdminPage() {
  const { t } = useTranslation(["modules", "auth"]);
  const { logout } = useAuth();

  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
        data-ocid="admin-page"
      >
        <div className="rounded-full bg-primary/10 p-5">
          <ShieldCheck size={40} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("modules:admin.title")}
          </h1>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            {t("modules:admin.description")}
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
          data-ocid="admin-logout-btn"
        >
          <LogOut size={15} />
          {t("auth:logout.button")}
        </Button>
      </div>
    </Layout>
  );
}
