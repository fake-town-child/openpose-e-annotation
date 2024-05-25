import { FC, useCallback, useEffect, useRef } from "react";
import {
  LayerAtom,
  appStateAtom,
  canvasSizeAtom,
  currentImgSrcFilepathAtom,
} from "../../shared/stores/atom";
import { Layer } from "react-konva";
import { useAtom, useAtomValue } from "jotai";
import ImageObj from "./ImageObj";
import { Layer as ELayer } from "konva/lib/Layer";
import { BufferToPNGDataURL } from "@/shared/util";

type Props = {
  layerAtom: LayerAtom;
};

const ImageLayer: FC<Props> = ({ layerAtom }) => {
  const [layerData, setLayerData] = useAtom(layerAtom);
  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const appState = useAtomValue(appStateAtom);

  const localLayerRef = useRef<ELayer | null>(null);
  const setLayerRef = (ref: ELayer) => {
    if (!localLayerRef.current) {
      localLayerRef.current = ref;
      setLayerData({ ...layerData, ref });
    }
  };

  useEffect(() => {
    if (layerData.type === "image") {
      if (!layerData.src && layerData.filePath) {
        window.electronAPI
          .getFile({ filePath: layerData.filePath })
          .then((data) => {
            setLayerData({
              ...layerData,
              src: BufferToPNGDataURL(data),
            });
          });
      }
    }
  }, [layerData]);

  if (layerData.type !== "image") {
    return null;
  }

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
