export default function ArticleImage({ src, alt, caption }) {
  return (
    <figure className="my-6 sm:my-8">
      <div className="w-full overflow-hidden rounded-xl bg-gray-100">
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="h-56 w-full object-cover sm:h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm italic text-gray-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
