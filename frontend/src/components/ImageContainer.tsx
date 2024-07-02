import { objectID } from "../utils/types";

export default function ImageContainter({
  url,
  id,
}: {
  url: string;
  id: objectID;
}) {
  return (
    <div className={`relative w-full pt-[75%] overflow-hidden rounded`}>
      <img
        src={url}
        alt={id}
        loading="lazy"
        className="absolute top-0 left-0 w-full h-full object-cover"
      ></img>
    </div>
  );
}
