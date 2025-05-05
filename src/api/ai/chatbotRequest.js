export const callChatbot = async (selected_id) => {
    try {
      const body = selected_id ? { selected_id } : {};
      const response = await fetch(
        `http://localhost:5000/api/v1/ai/chatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during callChatbot: ", error);
      throw error;
    }
  };