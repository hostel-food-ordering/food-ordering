import { useQuery } from "react-query";
import { userCart } from "../fetch/user";
import CartItemCard from "../components/CartItemCard";
import { Key } from "react";

function UserCart() {
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: userCart,
    onError: (error) => alert(error),
  });

  return (
    <div className="flex flex-wrap">
      {cart?.map((cartItem: any, index: Key) => {
        return <CartItemCard key={index} cartItem={cartItem} />;
      })}
    </div>
  );
}

export default UserCart;
