const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const addItem = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/item/add`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};
