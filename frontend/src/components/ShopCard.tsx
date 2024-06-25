import { useNavigate } from "react-router-dom";

interface ShopCardProps {
  shop: any;
}

function ShopCard({ shop }: ShopCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="border-2 rounded-lg border-red-700 w-96 cursor-pointer"
      onClick={() => navigate(`/${shop._id}`)}
    >
      <div className="text-lg font-bold">{shop.name}</div>
      <div>{shop.location}</div>
      <div>{shop.email}</div>
      <div>{shop.phone}</div>
    </div>
  );
}

export default ShopCard;
