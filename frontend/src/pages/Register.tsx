import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { registerUser } from "../fetch/user";
import { useAppContext } from "../contexts/AppContext";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { showToast } = useAppContext();

  const mutation = useMutation(registerUser, {
    onSuccess() {
      showToast("Registration Successfull", "SUCCESS");
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
      <h2 className="text-2xl font-bold">Create an Account</h2>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 text-base font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "First Name is required" })}
          ></input>
          {errors.firstName && (
            <p className="text-red-700 font-normal">
              {errors.firstName.message}
            </p>
          )}
        </label>
        <label className="text-gray-700 text-base font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "Last Name is required" })}
          ></input>
          {errors.lastName && (
            <p className="text-red-700 font-normal">
              {errors.lastName.message}
            </p>
          )}
        </label>
        <label className="text-gray-700 text-base font-bold flex-1">
          Email
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            type="email"
            {...register("email", { required: "Email Name is required" })}
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
        <label className="text-gray-700 text-base font-bold flex-1">
          Confirm Password
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            type="password"
            {...register("confirmPassword", {
              validate: (val) => {
                if (!val) {
                  return "This field is required";
                } else if (watch("password") !== val) {
                  return "Passwords do not match";
                } else {
                  return true;
                }
              },
            })}
          ></input>
          {errors.confirmPassword && (
            <p className="text-red-700 font-normal">
              {errors.confirmPassword.message}
            </p>
          )}
        </label>
        <button
          type="submit"
          className="bg-gray-700 rounded m-auto text-white p-2 font-bold w-40"
          disabled={mutation.isLoading}
        >
          Create Account
        </button>
      </div>
    </form>
  );
};

export default Register;
