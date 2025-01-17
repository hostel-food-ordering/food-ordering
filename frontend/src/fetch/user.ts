import { RegisterFormData } from "../pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const userProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody.user;
};

// export const userCart = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/user/cart`, {
//     method: "GET",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const responseBody = await response.json();

//   if (!response.ok) {
//     throw new Error(responseBody.message);
//   }

//   const cart = responseBody.cart.reduce((acc: any, obj: any) => {
//     acc[obj.item._id] = obj.quantity;
//     return acc;
//   }, {});

//   localStorage.setItem("cart", JSON.stringify(cart));

//   return responseBody.cart;
// };

export const localUserCart = async () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");

  const response = await fetch(`${API_BASE_URL}/api/user/local-cart`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cart }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody.cart;
};

// export const updateUserCart = async (cart: any) => {
//   const response = await fetch(`${API_BASE_URL}/api/user/cart/update`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(cart),
//   });

//   const responseBody = await response.json();

//   if (!response.ok) {
//     throw new Error(responseBody.message);
//   }
// };

export const registerUser = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/user/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};
