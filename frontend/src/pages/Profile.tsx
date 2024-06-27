import { useMutation, useQuery, useQueryClient } from "react-query";
import { userProfile } from "../fetch/user";
import { signOut } from "../fetch/auth";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

function UserProfile() {
  const { data: user = {} } = useQuery({
    queryKey: ["profile"],
    queryFn: userProfile,
    onError: (error) => alert(error),
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showToast } = useAppContext();

  const mutation = useMutation(signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast("Signed Out", "SUCCESS");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast(error.message, "ERROR");
    },
  });

  return (
    <div>
      <div>{user.fullName}</div>
      <div>{user.email}</div>
      <div>{user.cart?.length} items in cart</div>
      <button
        className="bg-gray-700 rounded m-auto my-5 text-white p-2 font-bold w-40"
        onClick={() => {
          mutation.mutate();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default UserProfile;
