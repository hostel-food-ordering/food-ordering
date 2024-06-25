import { RegisterFormData } from "../pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/user/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  console.log(response);

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};
