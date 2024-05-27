import { Button, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { useSaveImage, useSaveSavefile } from "../hooks/useLoadSave";
import { appStateAtom } from "@/shared/stores/atom";
import { useAtomValue } from "jotai";
import { useMousetrap } from "../hooks/useMousetrap";
import { annotationLayerNames } from "@/shared/stores/define";

const FileSave: FC = () => {
  const { saveImage } = useSaveImage();
  const { saveSaveFile } = useSaveSavefile();
  const appState = useAtomValue(appStateAtom);

  useMousetrap(
    "ctrl+s",
    () => {
      console.log(appState.state.currentSaveFilepath);
      if (appState.state.currentSaveFilepath) {
        saveSaveFile(appState.state.currentSaveFilepath);
      } else {
        window.electronAPI
          .getFileNameWithSaveDialog({
            payload: {
              defaultPath: "save.json",
              filters: [{ name: "JSON", extensions: ["json"] }],
            },
          })
          .then(({ canceled, filePath }) => {
            !canceled && saveSaveFile(filePath);
          });
      }
    },
    undefined,
    [appState.state.currentSaveFilepath]
  );

  return (
    <HStack>
      <Button
        size="sm"
        onClick={() => {
          window.electronAPI
            .getFileNameWithSaveDialog({
              payload: {
                defaultPath: "save.png",
                filters: [{ name: "PNG", extensions: ["png"] }],
              },
            })
            .then(({ canceled, filePath }) => {
              !canceled && saveImage(filePath, annotationLayerNames);
            });
        }}
      >
        Save Annotation Image
      </Button>
      <Button
        size="sm"
        onClick={() => {
          window.electronAPI
            .getFileNameWithSaveDialog({
              payload: {
                defaultPath: "save.json",
                filters: [{ name: "JSON", extensions: ["json"] }],
              },
            })
            .then(({ canceled, filePath }) => {
              !canceled && saveSaveFile(filePath);
            });
        }}
      >
        Save savefile
      </Button>
      <Button
        size="sm"
        onClick={() => {
          if (appState.state.currentSaveFilepath) {
            saveSaveFile(appState.state.currentSaveFilepath);
          }
        }}
        isDisabled={!appState.state.currentSaveFilepath}
      >
        Quick Save
      </Button>
    </HStack>
  );
};

export default FileSave;
