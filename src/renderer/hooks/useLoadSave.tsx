import {
  DirectoryModeStateAtom,
  appStateAtom,
  canvasSizeAtom,
  currentImgSrcFilepathAtom,
  currentSaveFilepathAtom,
  isSaveImageModeAtom,
  layerListAtom,
  layerListAtomsAtom,
  stageRefAtom,
} from "@/shared/stores/atom";
import { DirectoryModeFile, DirectoryModeState, Layer } from "@/shared/types";
import {
  BufferToPNGDataURL,
  ChangeExtension,
  GenerateSaveFile,
  LoadSaveFile,
  PNGdataURLtoBuffer,
} from "@/shared/util";
import { useToast } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { useResetCampus } from "./useReset";
import { useCanvasSize } from "./useCanvasSize";
import { annotationLayerNames } from "@/shared/stores/define";

export const useLoadImage = () => {
  const [layerListAtoms, dispatchListAtoms] = useAtom(layerListAtomsAtom);

  const [currentImgSrcFilepath, setCurrentImgSrcFilepath] = useAtom(
    currentImgSrcFilepathAtom
  );

  const { resetCampus } = useResetCampus();

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
        resetCampus();
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

  const getSaveFile = (filePath: string, overwriteImgSrc?: string) => {
    setState("loading");
    resetCampus();
    window.electronAPI
      .getFile({ filePath: filePath })
      .then((data) => {
        const { layerList, size, state } = LoadSaveFile(data);

        const newLayerList = !overwriteImgSrc
          ? layerList
          : layerList.map((layer) => {
              if (layer.type === "image") {
                return {
                  ...layer,
                  filePath: overwriteImgSrc,
                };
              }
              return layer;
            });
        resetCampus();
        setLayerList(newLayerList);
        if (size) {
          setCanvasSize(size);
        }
        if (state) {
          setCurrentImgSrcFilepath(
            overwriteImgSrc || state.currentImgSrcFilepath
          );
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
  const [isSaveImageMode, setIsSaveImageMode] = useAtom(isSaveImageModeAtom);
  const toast = useToast();
  const stageRef = useAtomValue(stageRefAtom);
  const { ResetWindow, FitToWindow } = useCanvasSize();

  const saveImage = (
    filePath: string,
    activeLayer: string[],
    callBack?: () => void
  ) => {
    // activelayer以外を非表示にする
    layerList.map((layer) => {
      if (layer.ref) {
        layer.ref.visible(activeLayer.includes(layer.name));
      }
    });
    setIsSaveImageMode(true);
    if (stageRef) {
      ResetWindow(stageRef);
    }

    if (layerList[0].ref?.parent) {
      const dataURL = layerList[0].ref?.parent.toDataURL({
        // pixelRatio: 1 / layerList[0].ref.parent?.scaleX(),
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

      if (stageRef) {
        FitToWindow(stageRef);
      }
    }

    setIsSaveImageMode(false);
    //全レイヤーを表示に戻す
    layerList.map((layer) => {
      if (layer.ref) {
        layer.ref.visible(true);
      }
    });

    callBack && callBack();
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

export const useDirectoryMode = ({
  sourceDir,
  outputDir,
}: {
  sourceDir: string;
  outputDir: string;
}) => {
  const appState = useAtomValue(appStateAtom);
  const [state, setState] = useState<
    "initial" | "loading" | "loaded" | "error"
  >("initial");

  const [dirModeState, setDirModeState] = useAtom(DirectoryModeStateAtom);

  const toast = useToast();

  const loadFiles = () => {
    setState("loading");
    window.electronAPI
      .getDirectoryFiles({ directoryPath: sourceDir })
      .then(async (files) => {
        const dirModeFiles: DirectoryModeFile[] = await Promise.all(
          files.map(async (file) => {
            const filename = await window.electronAPI.getBaseName({
              filePath: file,
            });
            const isSavefileExists = await window.electronAPI.checkFileExists({
              filePath: await window.electronAPI.joinPath({
                paths: [outputDir, ChangeExtension(filename, ".json")],
              }),
            });
            const isAnnotationImageExists =
              await window.electronAPI.checkFileExists({
                filePath: await window.electronAPI.joinPath({
                  paths: [outputDir, ChangeExtension(filename, ".png")],
                }),
              });
            return {
              sourcePath: file,
              sourceFileName: filename,
              isSavefileExists: isSavefileExists,
              isAnnotationImageExists: isAnnotationImageExists,
            };
          })
        );
        console.log(dirModeFiles);
        setDirModeState({
          sourceDir: sourceDir,
          outputDir: outputDir,
          files: dirModeFiles,
        });
        setState("loaded");
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
        setState("error");
      });
  };

  return { loadFiles, state, dirModeState };
};

export const useBatchSave = () => {
  const directoryModeState = useAtomValue(DirectoryModeStateAtom);

  const appState = useAtomValue(appStateAtom);

  const { saveSaveFile } = useSaveSavefile();
  const { saveImage } = useSaveImage();
  const { getImageFile } = useLoadImage();
  const { getSaveFile } = useLoadSaveFile();

  const saveCurrent = async () => {
    if (!(directoryModeState.sourceDir && directoryModeState.outputDir)) return;
    const basename = await window.electronAPI.getBaseName({
      filePath: appState.state.currentImgSrcFilepath ?? "",
    });
    if (directoryModeState.sourceDir) {
      window.electronAPI
        .joinPath({
          paths: [
            directoryModeState.outputDir,
            ChangeExtension(basename, ".json"),
          ],
        })
        .then((filePath) => {
          saveSaveFile(filePath);
        });
    }
    window.electronAPI
      .joinPath({
        paths: [
          directoryModeState.outputDir,
          ChangeExtension(basename, ".png"),
        ],
      })
      .then((filePath) => {
        saveImage(filePath, annotationLayerNames);
      });
  };

  //directoryModeState.filesのうち、isSavefileExistsがtrueのものを順次読み込んで、saveCurrent()する
  const saveAll = async () => {
    if (!(directoryModeState.sourceDir && directoryModeState.outputDir)) return;
    const files = directoryModeState.files.filter(
      (file) => file.isSavefileExists
    );
    for (const file of files) {
      await getImageFile(file.sourcePath);
      await getSaveFile(
        await window.electronAPI.joinPath({
          paths: [
            directoryModeState.outputDir,
            ChangeExtension(file.sourceFileName, ".json"),
          ],
        }),
        file.sourcePath
      );
      await saveCurrent();
    }
  };

  return { saveAll };
};
