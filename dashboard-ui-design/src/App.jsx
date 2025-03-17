import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import HomePage from "@/routes/home/page";
import RegisterPage from "./routes/register/RegisterPage";
import LoginPage from "./routes/login/LoginPage";
import Price from "./routes/dashboard/Price";
import RequestPage from "./routes/dashboard/RequestPage";

function App() {
    const router = createBrowserRouter([
        {
            path: "/dashboard",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />,  // Trang Home là trang mặc định
                },
                
                {
                    path: "history-request",
                    element: <RequestPage />,
                },
                {
                    path: "payment",
                    element: <Price/>,
                },
                
            ],
        },
        {
            path: "/",
            element: <HomePage />,
        },
        {
            path: "/register",
            element: <RegisterPage />,
        },{
            path: "/login",
            element: <LoginPage />,
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
