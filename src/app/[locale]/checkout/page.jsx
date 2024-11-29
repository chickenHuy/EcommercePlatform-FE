import CommonHeader from "@/components/headers/commonHeader"
import Address from "./address"
import CheckoutContent from "./content"

export default function CheckoutPage(props) {
    const { storeId, storeName, orderItems } = props
    return (
        <div className="w-full flex flex-col">
            <CommonHeader />
            <div className="w-full bg-blue-primary bg-opacity-50">
                <Address />
            </div>
            <div className="w-full bg-blue-primary bg-opacity-50">
                <CheckoutContent />
            </div>
        </div>
    )

}