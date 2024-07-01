import { useQuery } from "react-query";
import { getOneShop } from "../fetch/shop";
import { useNavigate, useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import ShopCard from "../components/ShopCard";
function Shop() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const shop_id = searchParams.get("shop_id");

  const { data: shop = undefined, isSuccess } = useQuery({
    queryKey: [`shop-${shop_id}`],
    queryFn: () => getOneShop(shop_id as string),
    onError: () => navigate("/"),
  });

  if (isSuccess)
    return (
      <>
        <div className="flex flex-col">
          <div className="py-4 text-white">
            <ShopCard shop={shop} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {shop?.items?.map((item: any) => {
              return <ItemCard item={item} key={item._id} />;
            })}
          </div>
        </div>
      </>
    );
}

export default Shop;
