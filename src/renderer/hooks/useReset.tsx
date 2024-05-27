import {
  canvasSizeAtom,
  currentImgSrcFilepathAtom,
  currentSaveFilepathAtom,
  historyAtom,
  layerListAtom,
  layerListAtomsAtom,
} from "@/shared/stores/atom";
import { humanNodes } from "@/shared/stores/define";
import { useAtom } from "jotai";
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
