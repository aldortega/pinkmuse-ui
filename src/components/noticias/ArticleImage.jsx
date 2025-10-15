import { cn } from "@/lib/utils";

export default function ArticleImage({
  src,
  alt,
  caption,
  className,
  frameClassName,
  imageClassName,
}) {
  return (
    <figure className={cn("my-6 sm:my-8", className)}>
      <div className={cn("w-full overflow-hidden rounded-2xl bg-gray-100", frameClassName)}>
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={cn("h-56 w-full object-cover sm:h-auto", imageClassName)}
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
