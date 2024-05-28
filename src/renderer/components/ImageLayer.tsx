import { FC, memo, useCallback, useEffect, useRef } from "react";
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
import { useResetAnnotation } from "../hooks/useReset";

type Props = {
  layerAtom: LayerAtom;
};

const ImageLayer: FC<Props> = ({ layerAtom }) => {
  const [layerData, setLayerData] = useAtom(layerAtom);
  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const appState = useAtomValue(appStateAtom);
  const { setAnnotationStyle } = useResetAnnotation();

  const localLayerRef = useRef<ELayer | null>(layerData.ref);
  const setLayerRef = useCallback(
    (ref: ELayer) => {
      if (!localLayerRef.current) {
        localLayerRef.current = ref;
        setLayerData({ ...layerData, ref });
      }
    },
    [layerData]
  );

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
            setAnnotationStyle({
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          }}
        />
      ) : null}
    </Layer>
  );
};

export default memo(ImageLayer);
