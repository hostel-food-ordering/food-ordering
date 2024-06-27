import { useQuery } from "react-query";
import { localUserCart } from "../fetch/user";
import ItemCard from "../components/ItemCard";

function UserCart() {
  let { data: localCart = [] } = useQuery({
    queryKey: ["localUserCart"],
    queryFn: localUserCart,
    onError: (error) => alert(error),
  });

  const groupedCart = localCart.reduce((acc: any, cartItem: any) => {
    const shopId = cartItem.item.shop._id;
    if (!acc[shopId]) {
      acc[shopId] = [];
    }
    acc[shopId].push(cartItem);
    return acc;
  }, {});

  return (
    <div className="flex flex-col">
      {Object.keys(groupedCart).map((shop_id) => (
        <div key={`cart-${shop_id}`}>
          <h2>{groupedCart[shop_id][0].item.shop.name}</h2>
          <div className="flex flex-wrap">
            {groupedCart[shop_id].map((cartItem: any) => (
              <ItemCard
                key={cartItem.item._id}
                item={cartItem.item}
                itemQuantity={cartItem.quantity}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserCart;
