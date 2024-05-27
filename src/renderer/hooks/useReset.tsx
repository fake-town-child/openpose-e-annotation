import {
  canvasSizeAtom,
  currentImgSrcFilepathAtom,
  currentSaveFilepathAtom,
  historyAtom,
  layerListAtom,
  layerListAtomsAtom,
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
  const canvasSize = useAtomValue(canvasSizeAtom);

  const resetLayer: Layer[] = defaultLayers.map((layer) => {
    return {
      ...layer,
      defaultTargetStyle: {
        radius:
          canvasSize.width > canvasSize.height
            ? (20 / 1024) * canvasSize.height
            : (20 / 1024) * canvasSize.width,
      },
    };
  });

  const resetAnnotation = () => {
    setLayerList([
      ...layerList.filter((layer) => layer.type === "image"),
      ...resetLayer,
    ]);
  };

  return { resetAnnotation };
};
