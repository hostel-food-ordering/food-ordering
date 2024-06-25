import { useNavigate } from "react-router-dom";

interface ShopCardProps {
  shop: any;
}

function ShopCard({ shop }: ShopCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="border-2 rounded-lg p-5 border-black w-96 cursor-pointer"
      onClick={() => navigate(`/shop?shop_id=${shop._id}`)}
    >
      <div className="text-lg font-bold">{shop.name}</div>
      <div>{shop.location}</div>
      <div>{shop.email}</div>
      <div>{shop.phone}</div>
    </div>
  );
}

export default ShopCard;
