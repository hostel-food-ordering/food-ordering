import { useQuery } from "react-query";
import { localUserCart } from "../fetch/user";
import ItemCard from "../components/ItemCard";

function UserCart() {
  let { data: localCart = [] } = useQuery({
    queryKey: ["localUserCart"],
    queryFn: localUserCart,
    onError: (error) => alert(error),
  });

  return (
    <div className="flex flex-wrap">
      {localCart?.map((cartItem: any) => {
        return (
          <ItemCard
            key={cartItem.item._id}
            item={cartItem.item}
            itemQuantity={cartItem.quantity}
          />
        );
      })}
    </div>
  );
}

export default UserCart;
