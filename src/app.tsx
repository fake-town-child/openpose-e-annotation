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

const App: FC = () => {
  const [currentCanvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const [layerList, setLayerList] = useAtom(layerListAtom);
  const [layerListAtoms, dispatchListAtoms] = useAtom(layerListAtomsAtom);
  const [isSaveImageMode, setIsSaveImageMode] = useAtom(isSaveImageModeAtom);

  const appState = useAtomValue(appSateAtom);

  return (
    <div className="app-container">
      <aside>
        {/* sidebar */}
        <button
          className="button"
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
        </button>
        <button
          className="button"
          onClick={() => {
            console.log("open image", layerList);
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
                    const newLayerList: Layer[] = [
                      {
                        name: "bgImage",
                        type: "image",
                        src: BufferToPNGDataURL(data),
                        ref: null,
                      },
                      ...layerList,
                    ];
                    setLayerList(newLayerList);
                  });
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        >
          open image
        </button>
        <button
          className="button"
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
        </button>
        <button
          className="button"
          onClick={() => {
            setCanvasSize({ width: 1024, height: 512 });
          }}
        >
          change size
        </button>
        <button
          className="button"
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
        </button>
      </aside>
      <main id="stage-parent">
        <MainCanvas />
      </main>
    </div>
  );
};

export default App;
