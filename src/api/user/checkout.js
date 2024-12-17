import { post } from "@/lib/httpClient";

export const checkoutOrders = (payload) => {
    try {
        const response = post(
            `/api/v1/orders/`, payload
        );
        return response;
    } catch (error) {
        throw error;
    }
};