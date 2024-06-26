import { useQuery, useQueryClient } from "react-query";
import { localUserCart } from "../fetch/user";
import { useAppContext } from "../contexts/AppContext";
import ItemCard from "../components/ItemCard";

function UserCart() {
  const { isLoggedIn } = useAppContext();

  const queryClient = useQueryClient();
  let remoteCart = null;
  if (isLoggedIn) {
    remoteCart = queryClient.getQueryData("userCart");
  }

  let { data: localCart = [] } = useQuery({
    queryKey: ["localUserCart"],
    queryFn: localUserCart,
    enabled: !isLoggedIn,
    onError: (error) => alert(error),
  });

  const cart = isLoggedIn ? remoteCart : localCart;

  return (
    <div className="flex flex-wrap">
      {cart?.map((cartItem: any) => {
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
