import AdminHeader from "@/components/headers/adminHeader";
import { ThemeProvider } from "@/components/themes/theme-provider";

export const metadata = {
    title: "Admin Dashboard",
};

export default function AdminLayout({ children }) {
    return (
        <body>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <AdminHeader />
                {children}
            </ThemeProvider>
        </body>
    );
}
