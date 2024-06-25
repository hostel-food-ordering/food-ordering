interface ItemCardProps {
  item: any;
}

function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="border border-gray-700 m-2 min-w-32 flex-1">
      <div>{item.name}</div>
      <div>{item.price}</div>
      <div>{item.category}</div>
      <div>{item.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}</div>
    </div>
  );
}

export default ItemCard;
