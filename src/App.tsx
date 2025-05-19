import { cn } from "@/lib/utils";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { useHeader } from "./data/contexts/HeaderContext.tsx";
import { HeaderProvider } from "./data/contexts/HeaderContext.tsx";
import { OrdersProvider } from "./data/contexts/OrdersContext.tsx";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Tickets from "./pages/Tickets.tsx";
import Users from "./pages/Admin/Users.tsx";
import Error403 from "./pages/Error403.tsx";
import CreateTicket from "./pages/CreateTicket.tsx";
import { AuthProvider } from "./data/contexts/AuthContext.tsx";
import EditTicket from "./pages/EditTicket.tsx";
import MyTickets from "./pages/Tech/MyTickets.tsx";
import Account from "./pages/Account.tsx";

const Layout = () => {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/403";
  const { title } = useHeader();

  return (
    <div className="flex min-h-screen w-full bg-muted">
      {/* Sidebar - versão desktop */}
      {!isLoginPage && (
        <div className="fixed inset-y-0 z-20 hidden h-full w-[var(--sidebar-width)] shrink-0 bg-background md:block">
          <AppSidebar />
        </div>
      )}

      {/* Conteúdo principal */}
      <div
        className={cn(
          "flex-1 transition-all duration-200 ease-linear w-full",
          !isLoginPage && "md:pl-[var(--sidebar-width)]",
          !isLoginPage &&
            "group-data-[collapsible=icon]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)]"
        )}
      >
        <SidebarInset className="bg-muted">
          {!isLoginPage && (
            <Header>
              <SidebarTrigger className="md:hidden" />
              <div className="flex flex-col text-center items-center w-full">
                <h1 className="font-medium">{title}</h1>
              </div>
            </Header>
          )}
          <Outlet /> {/* Isso renderizará as rotas filhas */}
        </SidebarInset>
      </div>
      <Toaster />
    </div>
  );
};

export function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />, // Layout compartilhado
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/tickets",
          element: <Tickets />,
        },
        {
          path: "/admin/users",
          element: <Users />,
        },
        {
          path: "/403",
          element: <Error403 />,
        },
        {
          path: "/create-ticket",
          element: <CreateTicket />,
        },
        {
          path: "/edit-ticket",
          element: <EditTicket />,
        },
        {
          path: "/tech/my-tickets",
          element: <MyTickets />,
        },
        {
          path: "/account",
          element: <Account />,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <HeaderProvider>
          <OrdersProvider>
            <SidebarProvider>
              <RouterProvider router={router} />
            </SidebarProvider>
          </OrdersProvider>
        </HeaderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
