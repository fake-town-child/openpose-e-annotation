import { ComponentProps, FC, useEffect, useState } from "react";
import { Image } from "react-konva";

type Props = {
  src: string;
  onLoadCallback?: (() => void) | ((img: HTMLImageElement) => void);
} & Partial<ComponentProps<typeof Image>>;

const ImageObj: FC<Props> = ({
  src,
  onLoadCallback,
  image = null,
  ...props
}) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.decode().then((i) => {
      setImageElement(img);
      onLoadCallback && onLoadCallback(img);
    });
  }, [src]);

  return <>{imageElement && <Image image={imageElement} {...props} />}</>;
};
export default ImageObj;
