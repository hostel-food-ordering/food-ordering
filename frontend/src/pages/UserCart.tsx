import { useQuery } from "react-query";
import { localUserCart } from "../fetch/user";
import ItemCard from "../components/ItemCard";
import ShopName from "../components/ShopName";
import { ItemType, objectID } from "../utils/types";

type LocalCartType = {
  item: ItemType & { shop: { _id: objectID; name: string; isOpen: boolean } };
  quantity: number;
};

type GroupedCartType = Record<string, LocalCartType[]>;

function UserCart() {
  let { data: localCart = undefined } = useQuery<LocalCartType[]>({
    queryKey: ["localUserCart"],
    queryFn: localUserCart,
    onError: (error) => alert(error),
  });

  const groupedCart = localCart?.reduce(
    (acc: GroupedCartType, cartItem: LocalCartType) => {
      const shopId = cartItem.item.shop._id;
      if (!acc[shopId]) {
        acc[shopId] = [];
      }
      acc[shopId].push(cartItem);
      return acc;
    },
    {}
  );

  if (groupedCart)
    return (
      <div className="flex flex-col gap-4 my-4">
        {Object.keys(groupedCart).map((shop_id) => (
          <>
            <div className="flex flex-col gap-2" key={`cart-${shop_id}`}>
              <div className="px-2 text-white text-2xl">
                <ShopName shop={groupedCart[shop_id][0].item.shop} />
              </div>
              <div className=" grid grid-cols-2 gap-2">
                {groupedCart[shop_id].map((cartItem: any) => (
                  <ItemCard
                    key={cartItem.item._id}
                    item={cartItem.item}
                    itemQuantity={cartItem.quantity}
                  />
                ))}
              </div>
            </div>
          </>
        ))}
      </div>
    );
}

export default UserCart;
