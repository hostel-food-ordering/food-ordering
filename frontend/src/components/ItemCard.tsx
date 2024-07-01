import { useState } from "react";
import ImageContainter from "./ImageContainer";

interface ItemCardProps {
  item: any;
  itemQuantity?: any;
}

function ItemCard({ item, itemQuantity }: ItemCardProps) {
  const [quantity, setQuantity] = useState(
    itemQuantity
      ? itemQuantity
      : JSON.parse(localStorage.getItem("cart") || "{}")[item._id] || 0
  );

  return (
    <div className="bg-slate-700 text-white rounded-md p-2">
      <ImageContainter
        url={
          "https://images.pexels.com/photos/2679501/pexels-photo-2679501.jpeg?cs=srgb&dl=pexels-shantanu-pal-938952-2679501.jpg&fm=jpg&w=640&h=800&_gl=1*h3fggv*_ga*NDI3MTgzMjIxLjE3MTk0ODE5Mzc.*_ga_8JE65Q40S6*MTcxOTQ4MTkzNy4xLjEuMTcxOTQ4MTk5OS4wLjAuMA.."
        }
        id={item._id}
      />
      <div className="mb-2">
        <div>{item.name}</div>
        <div>{item.price}</div>
        <div>{item.category}</div>
        <div>{item.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}</div>
      </div>
      {quantity == 0 ? (
        <button
          className="flex-1 w-full h-8 rounded-md bg-slate-800"
          onClick={() => {
            const cart = JSON.parse(localStorage.getItem("cart") || "{}");
            cart[item._id] = 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            setQuantity(1);
          }}
        >
          Add Item
        </button>
      ) : (
        <div className="flex items-center">
          <button
            className="flex-1 w-full h-8 rounded-md bg-slate-800"
            onClick={() => {
              const newQuantity = quantity <= 0 ? 0 : quantity - 1;
              const cart = JSON.parse(localStorage.getItem("cart") || "{}");
              if (newQuantity === 0) {
                delete cart[item._id];
              } else {
                cart[item._id] = newQuantity;
              }
              localStorage.setItem("cart", JSON.stringify(cart));
              setQuantity(newQuantity);
            }}
          >
            -
          </button>
          <span className="flex-1 text-center">{quantity}</span>
          <button
            className="flex-1 w-full h-8 rounded-md bg-slate-800"
            onClick={() => {
              const newQuantity = quantity >= 10 ? 10 : quantity + 1;
              const cart = JSON.parse(localStorage.getItem("cart") || "{}");
              cart[item._id] = newQuantity;
              localStorage.setItem("cart", JSON.stringify(cart));
              setQuantity(newQuantity);
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemCard;
