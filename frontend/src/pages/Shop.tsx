import { useQuery } from "react-query";
import { getOneShop } from "../fetch/shop";
import { useNavigate, useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import { Key } from "react";

function Shop() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const shop_id = searchParams.get("shop_id");

  const { data: shop = {} } = useQuery({
    queryKey: ["shop"],
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
          {shop.items?.map((item: any, index: Key) => {
            return <ItemCard item={item} key={index} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Shop;
