interface CartItemCardProps {
  cartItem: any;
}

function CartItemCard({ cartItem }: CartItemCardProps) {
  return (
    <div className="border border-gray-700 m-2 min-w-32 flex-1">
      <div className="font-bold">{cartItem.item.shop.name}</div>
      <div>{cartItem.item.name}</div>
      <div>{cartItem.item.price}</div>
      <div>{cartItem.item.category}</div>
      <div>{cartItem.item.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}</div>
      <div className="italic">Quantity: {cartItem.quantity}</div>
    </div>
  );
}

export default CartItemCard;
