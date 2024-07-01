import { useQuery } from "react-query";
import { getAllShops } from "../fetch/shop";
import { Key } from "react";
import ShopCard from "../components/ShopCard";
import { Link } from "react-router-dom";

function Home() {
  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: getAllShops,
  });

  return (
    <>
      <div className="flex flex-col my-5 gap-5">
        {shops?.map((shop: any, index: Key) => (
          <Link
            to={`/shop?shop_id=${shop._id}`}
            className="bg-slate-700 rounded-lg px-6 py-4 text-white"
          >
            <ShopCard shop={shop} key={index} />
          </Link>
        ))}
      </div>
    </>
  );
}

export default Home;
