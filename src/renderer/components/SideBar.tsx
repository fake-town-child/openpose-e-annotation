import {
  appModeAtom,
  appModeDef,
  appStateAtom,
  canvasSizeAtom,
  isSaveImageModeAtom,
  layerListAtom,
  layerListAtomsAtom,
} from "../../shared/stores/atom";
import { AppMode, Layer } from "@/shared/types";
import {
  PNGdataURLtoBuffer,
  BufferToPNGDataURL,
  LoadSaveFile,
  GenerateSaveFile,
} from "../../shared/util";
import { Select, Button, Box } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import SingleModeMenu from "./SingleModeMenu";
import Debug from "./Debug";

const Sidebar: FC = () => {
  const [currentCanvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const [layerList, setLayerList] = useAtom(layerListAtom);
  const [layerListAtoms, dispatchListAtoms] = useAtom(layerListAtomsAtom);
  const [isSaveImageMode, setIsSaveImageMode] = useAtom(isSaveImageModeAtom);
  const [appMode, setAppMode] = useAtom(appModeAtom);

  const appState = useAtomValue(appStateAtom);
  return (
    <Box
      as="aside"
      maxWidth={400}
      h="100%"
      overflowY={"auto"}
      borderColor={"gray.200"}
      bgColor={"white"}
      borderWidth={1}
      borderRadius={""}
      p={4}
      flexGrow={1}
      display={"flex"}
      flexDir={"column"}
      gap={4}
    >
      <Select
        size={"sm"}
        value={appMode}
        onChange={(e) => {
          appModeDef.includes(e.target.value as AppMode) &&
            setAppMode(e.target.value as AppMode);
        }}
      >
        <option value="Single">Single Image Mode</option>
        <option value="Directory">Directory Mode</option>
      </Select>
      <Box>
        <Button
          // className="button"
          onClick={() => {
            setIsSaveImageMode(true);
            const dataURL = appState.layerList[0].ref?.toDataURL({
              pixelRatio: appState.layerList[0].ref.parent
                ? 1 / appState.layerList[0].ref.parent?.scaleX()
                : 1,
            });
            if (dataURL) {
              window.electronAPI
                .getFileNameWithSaveDialog({
                  payload: {
                    defaultPath: "save.png",
                    filters: [{ name: "PNG", extensions: ["png"] }],
                  },
                })
                .then(({ canceled, filePath }) => {
                  !canceled &&
                    window.electronAPI
                      .saveFile({
                        filePath: filePath,
                        data: PNGdataURLtoBuffer(dataURL),
                      })
                      .then((result) => {
                        console.log("save success");
                      });
                })
                .catch((err) => {
                  console.error(err);
                });
            }
            setIsSaveImageMode(false);
          }}
        >
          save image
        </Button>
        <Button
          className="button"
          onClick={() => {
            window.electronAPI
              .getFileNamesWithOpenDialog({
                payload: {
                  filters: [
                    { name: "Image", extensions: ["png", "jpg", "jpeg"] },
                  ],
                  properties: ["openFile"],
                },
              })
              .then(({ canceled, filePaths }) => {
                if (!canceled) {
                  const filePath = filePaths[0];
                  window.electronAPI
                    .getFile({ filePath: filePath })
                    .then((data) => {
                      const newLayer: Layer = {
                        name: "bgImage",
                        type: "image",
                        src: BufferToPNGDataURL(data),
                        filePath: filePath,
                        ref: null,
                      };
                      dispatchListAtoms({
                        type: "insert",
                        value: newLayer,
                        before: layerListAtoms[0],
                      });
                    });
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        >
          open image
        </Button>
        <Button
          onClick={() => {
            window.electronAPI
              .getFileNamesWithOpenDialog({
                payload: {
                  filters: [{ name: "JSON", extensions: ["json"] }],
                  properties: ["openFile"],
                },
              })
              .then(({ canceled, filePaths }) => {
                if (!canceled) {
                  const filePath = filePaths[0];
                  window.electronAPI
                    .getFile({ filePath: filePath })
                    .then((data) => {
                      const { layerList, size } = LoadSaveFile(data);
                      setLayerList(layerList);
                      if (size) {
                        setCanvasSize(size);
                      }
                    });
                }
              });
          }}
        >
          open json
        </Button>
        <Button
          onClick={() => {
            setCanvasSize({ width: 1024, height: 512 });
          }}
        >
          change size
        </Button>
        <Button
          onClick={() => {
            const saveFile = GenerateSaveFile(appState);
            window.electronAPI
              .getFileNameWithSaveDialog({
                payload: {
                  defaultPath: "save.json",
                  filters: [{ name: "JSON", extensions: ["json"] }],
                },
              })
              .then(({ canceled, filePath }) => {
                !canceled &&
                  window.electronAPI
                    .saveFile({
                      filePath: filePath,
                      data: saveFile,
                    })
                    .then((result) => {
                      console.log("save success");
                    });
              });
          }}
        >
          save json
        </Button>
      </Box>
      <SingleModeMenu />
      <Debug />
    </Box>
  );
};

export default Sidebar;
