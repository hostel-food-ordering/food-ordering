const API_BASE_URL = "http://localhost:7000";

export const getAllShops = async () => {
  const response = await fetch(`${API_BASE_URL}/api/shop`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody.shops;
};
