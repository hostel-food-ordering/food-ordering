import { useQuery } from "react-query";
import { userProfile } from "../fetch/user";
import SignOutButton from "../components/SignOutBtn";
import ShopCard from "../components/ShopCard";
import { Link } from "react-router-dom";

function UserProfile() {
  const { data: user = undefined, isSuccess } = useQuery({
    queryKey: ["profile"],
    queryFn: userProfile,
    onError: (error) => alert(error),
  });

  if (isSuccess)
    return (
      <>
        <div className="container bg-slate-700 text-white my-4 flex flex-col">
          <div className="text-lg font-semibold">{user?.fullName}</div>
          <div>{user?.email}</div>
          <SignOutButton />
        </div>
        {user?.ownedShop && user.ownedShop.length !== 0 && (
          <div className="flex flex-col gap-2">
            <div className="container w-fit text-xl font-bold py-2 bg-white text-slate-800">
              Owned Shops
            </div>
            {user.ownedShop.map((shop: any) => (
              <Link
                to={`/shop-owner?shop_id=${shop._id}`}
                className="container bg-slate-700 text-white "
              >
                <ShopCard shop={shop} />
              </Link>
            ))}
          </div>
        )}
      </>
    );
}

export default UserProfile;
