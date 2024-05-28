import {
  canvasSizeAtom,
  currentImgSrcFilepathAtom,
  currentSaveFilepathAtom,
  historyAtom,
  layerListAtom,
  layerListAtomsAtom,
  updateLayerListAtom,
} from "@/shared/stores/atom";
import { defaultLayers, humanNodes } from "@/shared/stores/define";
import { Layer } from "@/shared/types";
import { useAtom, useAtomValue } from "jotai";
import { RESET } from "jotai/utils";

export const useResetCampus = () => {
  const [layerList, setLayerList] = useAtom(layerListAtom);
  const [campusSize, setCampusSize] = useAtom(canvasSizeAtom);
  const [currentImgSrcFilepath, setCurrentImgSrcFilepath] = useAtom(
    currentImgSrcFilepathAtom
  );
  const [currentSaveFilepath, setCurrentSaveFilepath] = useAtom(
    currentSaveFilepathAtom
  );
  const [history, setHistory] = useAtom(historyAtom);

  const resetCampus = () => {
    setLayerList([]);
    setLayerList(RESET);
    setHistory(RESET);
    setCampusSize(RESET);
    setCurrentImgSrcFilepath(RESET);
    setCurrentSaveFilepath(RESET);
  };
  return { resetCampus };
};
export const useResetAnnotation = () => {
  const [layerList, setLayerList] = useAtom(layerListAtom);
  const [layerListAtoms, dispatchListAtoms] = useAtom(layerListAtomsAtom);
  const [updateEnabled, updateLayerList] = useAtom(updateLayerListAtom);
  const canvasSize = useAtomValue(canvasSizeAtom);
  const resetAnnotation = ({
    width,
    height,
    referenceLayers,
  }: {
    width?: number;
    height?: number;
    referenceLayers?: Layer[];
  } = {}) => {
    const canvasWidth = width || canvasSize.width;
    const canvasHeight = height || canvasSize.height;
    const annotationDefaultLayer = referenceLayers || defaultLayers;

    const resetLayer: Layer[] = annotationDefaultLayer
      .filter((layer) => layer.type === "annotation")
      .map((layer) => {
        return {
          ...layer,
          nodes: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ...layer.nodes,
            defaultTargetStyle: {
              radius:
                canvasWidth > canvasHeight
                  ? (20 / 1024) * canvasHeight
                  : (20 / 1024) * canvasWidth,
            },
            defaultConnectionStyle: {
              strokeWidth:
                canvasWidth > canvasHeight
                  ? (10 / 1024) * canvasHeight
                  : (10 / 1024) * canvasWidth,
            },
          },
        };
      });
    layerList.map((layer, i) => {
      if (layer.type === "annotation") {
        const layerAtom = layerListAtoms[i];
        const updatedLayer = resetLayer.find((l) => l.name === layer.name);
        updatedLayer && updateLayerList(layerAtom, updatedLayer);
      }
    });
  };

  return { resetAnnotation };
};
