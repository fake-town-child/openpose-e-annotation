import {
  DirectoryModeStateAtom,
  appStateAtom,
  canvasSizeAtom,
  currentImgSrcFilepathAtom,
  currentSaveFilepathAtom,
  layerListAtom,
  layerListAtomsAtom,
} from "@/shared/stores/atom";
import { DirectoryModeFile, Layer } from "@/shared/types";
import {
  BufferToPNGDataURL,
  GenerateSaveFile,
  LoadSaveFile,
  PNGdataURLtoBuffer,
} from "@/shared/util";
import { useToast } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { useResetCampus } from "./useReset";

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

  const { resetCampus } = useResetCampus();

  const toast = useToast();

  const getSaveFile = (filePath: string) => {
    setState("loading");
    window.electronAPI
      .getFile({ filePath: filePath })
      .then((data) => {
        const { layerList, size, state } = LoadSaveFile(data);
        resetCampus();
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
export const useSaveImage = () => {
  const [layerList, setLayerList] = useAtom(layerListAtom);
  const toast = useToast();

  const saveImage = (filePath: string, activeLayer: string[]) => {
    // activelayer以外を非表示にする
    layerList.map((layer) => {
      if (layer.ref) {
        layer.ref.visible(activeLayer.includes(layer.name));
      }
    });

    if (layerList[0].ref?.parent) {
      const dataURL = layerList[0].ref?.parent.toDataURL({
        pixelRatio: 1 / layerList[0].ref.parent?.scaleX(),
      });
      if (dataURL) {
        window.electronAPI
          .saveFile({
            filePath: filePath,
            data: PNGdataURLtoBuffer(dataURL),
          })
          .then((result) => {
            toast({
              description: "save success",
              status: "success",
              size: "sm",
              isClosable: true,
              position: "top-right",
            });
          })
          .catch((err) => {
            console.error(err);
            toast({
              description: err.message,
              status: "error",
              size: "sm",
              isClosable: true,
              position: "top-right",
            });
          });
      }
    }

    //全レイヤーを表示に戻す
    layerList.map((layer) => {
      if (layer.ref) {
        layer.ref.visible(true);
      }
    });
  };

  return { saveImage };
};

export const useSaveSavefile = () => {
  const appState = useAtomValue(appStateAtom);
  const toast = useToast();
  const [currentSaveFilepath, setCurrentSaveFilepath] = useAtom(
    currentSaveFilepathAtom
  );

  const saveSaveFile = (filePath: string) => {
    window.electronAPI
      .saveFile({
        filePath: filePath,
        data: GenerateSaveFile(appState),
      })
      .then((result) => {
        toast({
          description: "save success",
          status: "success",
          size: "sm",
          isClosable: true,
          position: "top-right",
        });
        setCurrentSaveFilepath(filePath);
      })
      .catch((err) => {
        console.error(err);
        toast({
          description: err.message,
          status: "error",
          size: "sm",
          isClosable: true,
          position: "top-right",
        });
      });
  };

  return { saveSaveFile };
};

export const useDirectoryMode = () => {
  const appState = useAtomValue(appStateAtom);
  const [state, setState] = useState<"initial" | "loading" | "loaded">(
    "initial"
  );

  const [files, setFiles] = useAtom(DirectoryModeStateAtom);

  const loadFiles = ({
    sourceDir,
    outputDir,
  }: {
    sourceDir: string;
    outputDir: string;
  }) => {
    window.electronAPI
      .getDirectoryFiles({ directoryPath: sourceDir })
      .then((file) => {});
  };
};
