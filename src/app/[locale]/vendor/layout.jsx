import VendorNavigate from "@/components/navigates/vendorNavigate";

export const metadata = {
    title: "Vendor Dashboard",
    description: "The page where vendors can manage their store.",
};

export default function VendorLayout({ children }) {
    return (
      <body className="w-full h-fit min-h-screen bg-white-secondary">
        <VendorNavigate vendorContent={children}></VendorNavigate>
      </body>
    );
}
