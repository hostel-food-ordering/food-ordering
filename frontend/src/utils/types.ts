export type objectID = string;

export type ShopType = {
  _id: objectID;
  name: string;
  location: string;
  image_url: string;
  email: string;
  phone: number;
  isOpen: boolean;
  openingTime: string;
  ownerId: objectID[];
  items: objectID[] | ItemType[];
  orderHistory: objectID[];
};

export type ItemType = {
  _id: objectID;
  name: string;
  price: number;
  image_url: string;
  category: string;
  isVegetarian: boolean;
  shop: objectID | ShopType;
};

export type CartItemType = {
  item: objectID | ItemType;
  quantity: number;
};

export type OrderCartItemType = {
  item: ItemType;
  quantity: number;
};

export type OrderType = {
  _id: objectID;
  shop: objectID | ShopType;
  user: objectID | UserType;
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  creationTime: Date;
  orderValue: number;
  cartItems: OrderCartItemType[];
};

export type UserType = {
  _id: objectID;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  cart: CartItemType[];
  orderHistory: OrderType[];
  ownedShop: ShopType[];
};
