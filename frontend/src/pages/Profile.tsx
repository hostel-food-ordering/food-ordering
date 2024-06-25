import { useQuery } from "react-query";
import { userProfile } from "../fetch/user";

function UserProfile() {
  const { data: user = {} } = useQuery({
    queryKey: ["profile"],
    queryFn: userProfile,
    onError: (error) => alert(error),
  });

  return (
    <div>
      <div>{user.fullName}</div>
      <div>{user.email}</div>
      <div>{user.cart?.length} items in cart</div>
    </div>
  );
}

export default UserProfile;
