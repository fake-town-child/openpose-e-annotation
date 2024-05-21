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
  bgImgDataUrlAtom,
  canvasSizeAtom,
  isSaveImageModeAtom,
  layerListAtom,
} from "./stores/atom";

const App: FC = () => {
  const setBgImgDataUrl = useSetAtom(bgImgDataUrlAtom);
  const [currentCanvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const [layerList, setLayerList] = useAtom(layerListAtom);
  const [isSaveImageMode, setIsSaveImageMode] = useAtom(isSaveImageModeAtom);

  const appState = useAtomValue(appSateAtom);

  useEffect(() => {
    window.electronAPI.onSaveFileReply((event, token, message) => {
      console.log(message);
    });

    window.electronAPI.onOpenFileReply((event, token, result) => {
      console.log(event);
      if (result && result.isSuccess) {
        switch (token) {
          case "openSaveJson": {
            const { layerList, size } = LoadSaveFile(result.data);
            setLayerList(layerList);
            if (size) {
              setCanvasSize(size);
            }
            break;
          }
          case "openImage": {
            setBgImgDataUrl(BufferToPNGDataURL(result.data));
            break;
          }
          default:
            break;
        }
      }
    });
  }, []);

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
              window.electronAPI.saveFile(
                PNGdataURLtoBuffer(dataURL),
                "saveImage",
                {
                  defaultPath: "save.png",
                  filters: [{ name: "PNG", extensions: ["png"] }],
                }
              );
            }
            setIsSaveImageMode(false);
          }}
        >
          save image
        </button>
        <button
          className="button"
          onClick={() => {
            window.electronAPI.openFile("openImage", {
              filters: [{ name: "Image", extensions: ["png", "jpg", "jpeg"] }],
            });
          }}
        >
          open image
        </button>
        <button
          className="button"
          onClick={() => {
            window.electronAPI.openFile("openSaveJson", {
              filters: [{ name: "JSON", extensions: ["json"] }],
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
            window.electronAPI.saveFile(saveFile, "saveJson", {
              defaultPath: "save.json",
              filters: [{ name: "JSON", extensions: ["json"] }],
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
