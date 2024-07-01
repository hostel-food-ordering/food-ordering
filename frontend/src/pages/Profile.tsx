import { useQuery } from "react-query";
import { userProfile } from "../fetch/user";
import SignOutButton from "../components/SignOutBtn";

function UserProfile() {
  const { data: user = {}, isSuccess } = useQuery({
    queryKey: ["profile"],
    queryFn: userProfile,
    onError: (error) => alert(error),
  });

  if (isSuccess)
    return (
      <div className="bg-white my-4 px-6 py-4 rounded-lg flex flex-col">
        <div className="text-lg font-semibold">{user.fullName}</div>
        <div>{user.email}</div>
        <SignOutButton />
      </div>
    );
}

export default UserProfile;
