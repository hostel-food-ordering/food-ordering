import { useAppContext } from "../contexts/AppContext";
import { toggleShopStatus } from "../fetch/shop";
import { ShopType } from "../utils/types";
import MutationBtn from "./MutationBtn";
import ShopCard from "./ShopCard";
import { useMutation, useQueryClient } from "react-query";

export default function ShopOwnerCard({ shop }: { shop: ShopType }) {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const toggleStatusMutation = useMutation(toggleShopStatus, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(`owner-shop-${shop._id}`);
    },
    onError: (error: Error) => {
      showToast(error.message, "ERROR");
    },
  });

  if (shop)
    return (
      <div>
        <div className="container bg-slate-700 text-white grid gap-2">
          <ShopCard shop={shop} />
          <div className="flex gap-2 flex-wrap">
            <MutationBtn
              mutation={toggleStatusMutation}
              data={shop._id}
              label={shop.isOpen ? "Close Shop" : "Open Shop"}
            />
            <MutationBtn
              mutation={toggleStatusMutation}
              data={shop._id}
              label={shop.isOpen ? "Close Shop" : "Open Shop"}
            />
          </div>
        </div>
      </div>
    );
}
