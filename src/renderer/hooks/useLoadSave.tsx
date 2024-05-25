import {
  canvasSizeAtom,
  currentImgSrcFilepathAtom,
  currentSaveFilepathAtom,
  layerListAtom,
  layerListAtomsAtom,
} from "@/shared/stores/atom";
import { Layer } from "@/shared/types";
import { BufferToPNGDataURL, LoadSaveFile } from "@/shared/util";
import { useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useState } from "react";

export const useLoadImage = () => {
  const [layerListAtoms, dispatchListAtoms] = useAtom(layerListAtomsAtom);

  const [currentImgSrcFilepath, setCurrentImgSrcFilepath] = useAtom(
    currentImgSrcFilepathAtom
  );

  const toast = useToast();

  const [state, setState] = useState<
    "initial" | "loading" | "loaded" | "error"
  >("initial");

  const getImageFile = (filePath: string) => {
    setState("loading");
    window.electronAPI
      .getFile({ filePath: filePath })
      .then((data) => {
        const newLayer: Layer = {
          name: "bgImage",
          type: "image",
          src: BufferToPNGDataURL(data),
          ref: null,
          filePath: filePath,
        };
        dispatchListAtoms({
          type: "insert",
          value: newLayer,
          before: layerListAtoms[0],
        });
        setCurrentImgSrcFilepath(filePath);
        setState("loaded");
      })
      .catch((err) => {
        toast({
          description: err.message,
          status: "error",
          size: "sm",
          isClosable: true,
          position: "top-right",
        });
        console.error(err);
        setState("error");
      });
  };

  return { getImageFile, state };
};

export const useLoadSaveFile = () => {
  const [state, setState] = useState<
    "initial" | "loading" | "loaded" | "error"
  >("initial");

  const [layerList, setLayerList] = useAtom(layerListAtom);
  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const [currentImgSrcFilepath, setCurrentImgSrcFilepath] = useAtom(
    currentImgSrcFilepathAtom
  );
  const [currentSaveFilepath, setCurrentSaveFilepath] = useAtom(
    currentSaveFilepathAtom
  );

  const toast = useToast();

  const getSaveFile = (filePath: string) => {
    setState("loading");
    window.electronAPI
      .getFile({ filePath: filePath })
      .then((data) => {
        const { layerList, size, state } = LoadSaveFile(data);
        setLayerList(layerList);
        if (size) {
          setCanvasSize(size);
        }
        if (state) {
          setCurrentImgSrcFilepath(state.currentImgSrcFilepath);
        }
        setCurrentSaveFilepath(filePath);
        setState("loaded");
      })
      .catch((err) => {
        toast({
          description: err.message,
          status: "error",
          size: "sm",
          isClosable: true,
          position: "top-right",
        });
        console.error(err);
        setState("error");
      });
  };

  return { getSaveFile, state };
};
