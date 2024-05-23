import { FC, useEffect } from "react";
import MainCanvas from "./components/MainCanvas";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  BufferToPNGDataURL,
  GenerateSaveFile,
  LoadSaveFile,
  PNGdataURLtoBuffer,
} from "./util";
import {
  appSateAtom,
  canvasSizeAtom,
  isSaveImageModeAtom,
  layerListAtom,
  layerListAtomsAtom,
} from "./stores/atom";
import { Layer } from "@/types";
import { Box, Button, ChakraProvider, extendTheme } from "@chakra-ui/react";

const App: FC = () => {
  const [currentCanvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const [layerList, setLayerList] = useAtom(layerListAtom);
  const [layerListAtoms, dispatchListAtoms] = useAtom(layerListAtomsAtom);
  const [isSaveImageMode, setIsSaveImageMode] = useAtom(isSaveImageModeAtom);

  const appState = useAtomValue(appSateAtom);

  return (
    <ChakraProvider>
      <Box className="app-container" bgColor={"gray.50"}>
        <Box
          as="aside"
          maxWidth={400}
          borderColor={"gray.200"}
          bgColor={"white"}
          borderWidth={1}
          borderRadius={""}
          p={4}
          flexGrow={1}
        >
          {/* sidebar */}
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
                  .then((filePath) => {
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
                .then((filePaths) => {
                  const filePath = filePaths[0];
                  window.electronAPI
                    .getFile({ filePath: filePath })
                    .then((data) => {
                      const newLayer: Layer = {
                        name: "bgImage",
                        type: "image",
                        src: BufferToPNGDataURL(data),
                        ref: null,
                      };
                      dispatchListAtoms({
                        type: "insert",
                        value: newLayer,
                        before: layerListAtoms[0],
                      });
                    });
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
                .then((filePaths) => {
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
                .then((filePath) => {
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
        <main id="stage-parent">
          <MainCanvas />
        </main>
      </Box>
    </ChakraProvider>
  );
};

export default App;
