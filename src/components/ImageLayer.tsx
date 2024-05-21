import { FC, useCallback, useRef } from "react";
import { LayerAtom, canvasSizeAtom } from "../stores/atom";
import { Layer } from "react-konva";
import { useAtom } from "jotai";
import ImageObj from "./ImageObj";
import { Layer as ELayer } from "konva/lib/Layer";

type Props = {
  layerAtom: LayerAtom;
};

const ImageLayer: FC<Props> = ({ layerAtom }) => {
  const [layerData, setLayerData] = useAtom(layerAtom);
  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);

  if (layerData.type !== "image") {
    return null;
  }

  const localLayerRef = useRef<ELayer | null>(null);
  const setLayerRef = useCallback(
    (ref: ELayer) => {
      localLayerRef.current = ref;
      setLayerData({ ...layerData, ref });
    },
    [setLayerData, localLayerRef]
  );

  return (
    <Layer ref={setLayerRef}>
      {layerData.src ? (
        <ImageObj
          src={layerData.src}
          width={canvasSize.width}
          height={canvasSize.height}
          onLoadCallback={(img) => {
            setCanvasSize({
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          }}
        />
      ) : null}
    </Layer>
  );
};

export default ImageLayer;
