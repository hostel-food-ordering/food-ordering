const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getOneShop = async (shop_id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/shop/${shop_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody.shop;
};

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
