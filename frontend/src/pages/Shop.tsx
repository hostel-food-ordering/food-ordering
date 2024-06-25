import { useQuery } from "react-query";
import { getOneShop } from "../fetch/shop";
import { useParams } from "react-router-dom";

function Shop() {
  const { shop_id } = useParams();

  const { data: shop = {} } = useQuery({
    queryKey: ["shop"],
    queryFn: () => getOneShop(shop_id as string),
  });

  return (
    <>
      <div className="flex flex-row flex-wrap flex-grow">
        {JSON.stringify(shop)}
      </div>
    </>
  );
}

export default Shop;
