import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getOneShop } from "../fetch/shop";
import ShopOwnerCard from "../components/ShopOwnerCard";

export default function ShopOwner() {
  const [searchParams] = useSearchParams();

  const shop_id = searchParams.get("shop_id");

  const { data: shop = undefined, isSuccess } = useQuery({
    queryKey: [`owner-shop-${shop_id}`],
    queryFn: () => getOneShop(shop_id as string),
  });

  if (isSuccess)
    return (
      <div>
        <ShopOwnerCard shop={shop} />
      </div>
    );
}
