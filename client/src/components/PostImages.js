export default function PostImages({ imageIds }) {
  if (!imageIds || imageIds.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {imageIds.map((id, i) => (
        <img
          key={i}
          src={id}
          alt={`Post ${i}`}
          className="object-cover rounded max-h-64 w-full"
        />
      ))}
    </div>
  );
}