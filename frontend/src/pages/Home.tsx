import { useQuery } from "react-query";
import { getAllShops } from "../fetch/shop";
import { Key } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const { data: shops = [] } = useQuery({
    queryKey: ["all-shops"],
    queryFn: getAllShops,
  });

  return (
    <>
      <div className="flex flex-row flex-wrap flex-grow">
        {shops?.map((shop: any, index: Key) => {
          console.log(shop);
          return (
            <div
              key={index}
              className="border-2 rounded-lg border-red-700 w-96 cursor-pointer"
              onClick={() => navigate(`/${shop._id}`)}
            >
              <div className="text-lg font-bold">{shop.name}</div>
              <div>{shop.location}</div>
              <div>{shop.email}</div>
              <div>{shop.phone}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Home;
