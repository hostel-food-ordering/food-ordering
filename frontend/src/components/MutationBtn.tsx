import { UseMutationResult } from "react-query";
import BounceLoading from "./BounceLoading";

export default function MutationBtn({
  mutation,
  data,
  label,
}: {
  mutation: UseMutationResult<any, Error, string, unknown>;
  data?: any;
  label: string;
}) {
  return (
    <button
      className="btn"
      onClick={() => {
        if (!mutation.isLoading) mutation.mutate(data);
      }}
      disabled={mutation.isLoading}
    >
      {mutation.isLoading ? <BounceLoading /> : label}
    </button>
  );
}
