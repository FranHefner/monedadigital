import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getRoleRoute, useUserRole } from "@/hooks/useUserRole";
import AdminPage from "@/pages/AdminPage";
import CustomerMenuPage from "@/pages/CustomerMenuPage";
import KitchenPage from "@/pages/KitchenPage";
import LoginPage from "@/pages/LoginPage";
import ManagerPage from "@/pages/ManagerPage";
import MenuPage from "@/pages/MenuPage";
import WaiterPage from "@/pages/WaiterPage";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// ─── Root Route ──────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// ─── Index — redirect based on auth status and role ──────────────────────────
function IndexRedirect() {
  const { isAuthenticated, isInitializing } = useAuth();
  const { role, isLoading: isRoleLoading } = useUserRole();

  if (isInitializing || (isAuthenticated && isRoleLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role) {
    return <Navigate to={getRoleRoute(role)} />;
  }

  // Authenticated but no role yet — default to manager
  return <Navigate to="/manager" />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexRedirect,
});

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginRoute() {
  const { isAuthenticated } = useAuth();
  const { role } = useUserRole();

  if (isAuthenticated) {
    return <Navigate to={role ? getRoleRoute(role) : "/manager"} />;
  }
  return <LoginPage />;
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginRoute,
});

// ─── Protected routes ─────────────────────────────────────────────────────────
const managerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/manager",
  component: () => (
    <ProtectedRoute>
      <ManagerPage />
    </ProtectedRoute>
  ),
});

const waiterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/waiter",
  component: () => (
    <ProtectedRoute>
      <WaiterPage />
    </ProtectedRoute>
  ),
});

const kitchenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kitchen",
  component: () => (
    <ProtectedRoute>
      <KitchenPage />
    </ProtectedRoute>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  ),
});

// ─── Customer menu (authenticated) ───────────────────────────────────────────
const customerMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customer-menu",
  component: () => (
    <ProtectedRoute>
      <CustomerMenuPage />
    </ProtectedRoute>
  ),
});

// ─── Public menu route ────────────────────────────────────────────────────────
const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu/$restaurantId",
  component: MenuPage,
});

// ─── Router ───────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  managerRoute,
  waiterRoute,
  kitchenRoute,
  adminRoute,
  customerMenuRoute,
  menuRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
