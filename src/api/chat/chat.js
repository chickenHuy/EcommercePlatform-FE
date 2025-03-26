import { get, post } from "@/lib/httpClient";

const API_BASE = "/api/v1/chats";

/**
 * Lấy danh sách tin nhắn theo roomId với phân trang
 * @param {string} roomId - ID của phòng chat
 * @param {string} userType - Loại user: "store" hoặc "user"
 * @param {number} page - Số trang (default: 1)
 * @param {number} size - Số lượng tin nhắn mỗi trang (default: 10)
 */
export const listMessages = async (roomId, userType, page = 1, size = 10) => {
    try {
        const params = new URLSearchParams({ page, size }).toString();
        const response = await get(`${API_BASE}/${roomId}/messages-${userType}?${params}`);
        return response;
    } catch (error) {
        console.error("Error when getting messages:", error);
        throw error;
    }
};

/**
 * Tạo phòng chat
 * @param {string} storeId - ID của cửa hàng (nếu là customer tạo)
 * @param {string} customerId - ID của khách hàng (nếu là store tạo)
 */
export const createRoom = async ({ storeId = "", customerId = "" }) => {
    try {
        const response = await post(API_BASE, { storeId, userId: customerId });
        return response;
    } catch (error) {
        console.error("Error during create room:", error);
        throw error;
    }
};

/**
 * Lấy danh sách phòng chat với phân trang
 * @param {string} userType - Loại user: "store" hoặc "user"
 * @param {number} page - Số trang (default: 1)
 * @param {number} size - Số lượng phòng mỗi trang (default: 10)
 */
export const listRooms = async (userType, page = 1, size = 10) => {
    try {
        const params = new URLSearchParams({ page, size }).toString();
        const response = await get(`${API_BASE}/rooms-${userType}?${params}`);
        return response;
    } catch (error) {
        console.error("Error during get list rooms:", error);
        throw error;
    }
};




// import { listMessages, createRoom, listRooms } from "./common";

// // Lấy danh sách tin nhắn (store) - Trang 2, mỗi trang 15 tin nhắn
// const messagesStore = await listMessages("room123", "store", 2, 15);

// // Lấy danh sách tin nhắn (customer) - Mặc định trang 1, mỗi trang 10 tin
// const messagesUser = await listMessages("room456", "user");

// // Tạo phòng chat (store)
// await createRoom({ storeId: "store123" });

// // Tạo phòng chat (customer)
// await createRoom({ customerId: "user456" });

// // Lấy danh sách phòng (store) - Trang 1, mỗi trang 20 phòng
// const roomsStore = await listRooms("store", 1, 20);

// // Lấy danh sách phòng (customer) - Mặc định trang 1, mỗi trang 10 phòng
// const roomsUser = await listRooms("user");
