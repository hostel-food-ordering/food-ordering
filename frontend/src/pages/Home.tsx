import { useQuery } from "react-query";
import { getAllShops } from "../fetch/shop";
import { Key } from "react";
import ShopCard from "../components/ShopCard";

function Home() {
  const { data: shops = [] } = useQuery({
    queryKey: ["all-shops"],
    queryFn: getAllShops,
  });

  return (
    <>
      <div className="flex flex-row justify-center gap-5 flex-wrap flex-grow">
        {shops?.map((shop: any, index: Key) => (
          <ShopCard shop={shop} key={index} />
        ))}
      </div>
    </>
  );
}

export default Home;
