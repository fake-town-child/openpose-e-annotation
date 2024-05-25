import {
  canvasSizeAtom,
  currentImgSrcFilepathAtom,
  currentSaveFilepathAtom,
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

  const resetCampus = () => {
    setLayerList([]);
    setLayerList(RESET);
    setCampusSize(RESET);
    setCurrentImgSrcFilepath(RESET);
    setCurrentSaveFilepath(RESET);
  };
  return { resetCampus };
};
