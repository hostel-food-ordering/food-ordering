import { useQuery } from "react-query";
import { userCart } from "../fetch/user";
import CartItemCard from "../components/CartItemCard";

function UserCart() {
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: userCart,
    onSuccess: (a) => {
      console.log(a);
    },
    onError: (error) => alert(error),
  });

  return (
    <div className="flex flex-wrap">
      {cart?.map((cartItem: any) => {
        return <CartItemCard cartItem={cartItem} />;
      })}
    </div>
  );
}

export default UserCart;
