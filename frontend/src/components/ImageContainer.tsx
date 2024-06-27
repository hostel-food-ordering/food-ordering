export default function ImageContainter({ url, id }: any) {
  return (
    <div className={`relative w-full pt-[75%] overflow-hidden`}>
      <img
        src={url}
        alt={id}
        loading="lazy"
        className="absolute top-0 left-0 w-full h-full object-cover"
      ></img>
    </div>
  );
}
