import { useQuery } from "react-query";
import { getOneShop } from "../fetch/shop";
import { useNavigate, useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
function Shop() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const shop_id = searchParams.get("shop_id");

  const { data: shop = {} } = useQuery({
    queryKey: [`shop-${shop_id}`],
    queryFn: () => getOneShop(shop_id as string),
    onError: () => navigate("/"),
  });

  return (
    <>
      <div className="flex flex-col">
        <div>
          <h1 className="text-2xl">{shop.name}</h1>
          <h2 className="text-base">{shop.location}</h2>
          <h2 className="text-base">{shop.email}</h2>
          <h2 className="text-base">{shop.phone}</h2>
          <h2 className="text-base">Shop Open: {shop.isOpen ? "Yes" : "No"}</h2>
          <h2 className="text-base">Shop Timings: {shop.openingTime}</h2>
        </div>
        <div className="flex flex-wrap">
          {shop.items?.map((item: any) => {
            return <ItemCard item={item} key={item._id} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Shop;
