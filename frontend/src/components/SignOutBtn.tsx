import { signOut } from "../fetch/auth";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQueryClient } from "react-query";

export default function SignOutButton() {
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
    <button
      className="bg-gray-700 rounded m-auto my-5 text-white p-2 font-bold w-40"
      onClick={() => {
        if (!mutation.isLoading) mutation.mutate();
      }}
      disabled={mutation.isLoading}
    >
      <div>Sign Out</div>
    </button>
  );
}
