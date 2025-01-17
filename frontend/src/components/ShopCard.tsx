import { ShopType } from "../utils/types";
import ShopName from "./ShopName";

interface ShopCardProps {
  shop: ShopType;
}

function ShopCard({ shop }: ShopCardProps) {
  if (shop)
    return (
      <div>
        <div className="text-2xl">
          <ShopName shop={shop} />
        </div>
        <h2 className="text-base">{shop?.location}</h2>
        <h2 className="text-base">{shop?.email}</h2>
        <h2 className="text-base">{shop?.phone}</h2>
        {shop?.openingTime && (
          <h2 className="text-base">Shop Timings: {shop?.openingTime}</h2>
        )}
      </div>
    );
}

export default ShopCard;
