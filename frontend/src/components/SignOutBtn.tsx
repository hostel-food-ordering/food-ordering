import { signOut } from "../fetch/auth";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQueryClient } from "react-query";
import BounceLoading from "./BounceLoading";

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
      className="btn my-5"
      onClick={() => {
        if (!mutation.isLoading) mutation.mutate();
      }}
      disabled={mutation.isLoading}
    >
      {mutation.isLoading ? <BounceLoading /> : "Sign Out"}
    </button>
  );
}
