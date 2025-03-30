import { useMemo } from "react";

type CardImageProps = {
  image: string;
  className?: string;
};

export default function ContainedImage({ image, className }: CardImageProps) {
  const classNames = useMemo(() => {
    return `max-w-128 max-h-80 object-contain rounded-lg ${className}`;
  }, [className]);
  return <img src={image} alt="Preview" className={classNames} />;
}
