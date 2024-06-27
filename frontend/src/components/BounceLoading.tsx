export default function BounceLoading() {
  return (
    <div className="flex justify-center items-center gap-[0.125rem]">
      <span className="">Loading</span>
      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
    </div>
  );
}
