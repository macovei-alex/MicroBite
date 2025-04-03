type CardImageProps = {
  image: string;
  className?: string;
};

export default function ContainedImage({ image, className }: CardImageProps) {
  return (
    <img
      src={image}
      alt="Preview"
      className={`max-w-120 max-h-80 object-contain rounded-lg ${className}`}
    />
  );
}
