import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { signInUser } from "../fetch/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import BounceLoading from "../components/BounceLoading";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const mutation = useMutation(signInUser, {
    onSuccess() {
      navigate("/");
      queryClient.invalidateQueries("validateToken");
      showToast("Signed In Successfully", "SUCCESS");
    },
    onError(error: Error) {
      showToast(error.message, "ERROR");
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (!mutation.isLoading) mutation.mutate(data);
  });

  return (
    <form
      className="flex flex-col gap-4 mx-2 max-w-screen-md"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl font-bold">Sign In</h2>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 text-base font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("email", { required: "First Name is required" })}
          ></input>
          {errors.email && (
            <p className="text-red-700 font-normal">{errors.email.message}</p>
          )}
        </label>
        <label className="text-gray-700 text-base font-bold flex-1">
          Password
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            type="password"
            {...register("password", {
              required: "Password is Required",
              minLength: {
                value: 6,
                message: "Password must be atleast 6 characters",
              },
              maxLength: {
                value: 18,
                message: "Password must not be greater than 18 characters",
              },
            })}
          ></input>
          {errors.password && (
            <p className="text-red-700 font-normal">
              {errors.password.message}
            </p>
          )}
        </label>
        <div className="m-auto">
          Don't have an account?{" "}
          <Link className="text-blue-700" to="/register">
            Create One
          </Link>
        </div>
        <button
          type="submit"
          className="bg-gray-700 rounded m-auto text-white p-2 font-bold w-40"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? <BounceLoading /> : "Sign In"}
        </button>
      </div>
    </form>
  );
};

export default SignIn;
