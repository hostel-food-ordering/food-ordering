export default function ShopName({
  shop,
}: {
  shop: { name: string; isOpen: boolean };
}) {
  return (
    <div className="flex items-center">
      {shop?.name}
      {
        <span
          className="text-xs rounded-full px-2 py-1 ml-2 font-semibold"
          style={{ backgroundColor: shop?.isOpen ? "green" : "red" }}
        >
          {shop?.isOpen ? "OPEN" : "CLOSED"}
        </span>
      }
    </div>
  );
}
