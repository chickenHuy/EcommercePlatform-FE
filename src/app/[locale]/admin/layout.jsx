import AdminHeader from "@/components/headers/adminHeader";

export const metadata = {
    title: "Admin Dashboard",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AdminHeader />
                {children}
            </body>
        </html>
    );
}
