import { FC, useEffect } from "react";
import MainCanvas, {
  currentConnectionsAtom,
  currentTargetsAtom,
  savedNodesAtom,
} from "./components/MainCanvas";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  BufferToPNGDataURL,
  GenerateSaveFile,
  LoadSaveFile,
  PNGdataURLtoBuffer,
  TargetsToTargetPositions,
  createNodes,
} from "./util";
import {
  annotationLayerAtom,
  bgImgDataUrlAtom,
  canvasSizeAtom,
} from "./stores/atom";

const App: FC = () => {
  const annotationLayerRef = useAtomValue(annotationLayerAtom);
  const setBgImgDataUrl = useSetAtom(bgImgDataUrlAtom);
  const [currentCanvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const [currentTargets, setCurrentTargets] = useAtom(currentTargetsAtom);
  const setCurrentConnections = useSetAtom(currentConnectionsAtom);

  const savedNodes = useAtomValue(savedNodesAtom);

  useEffect(() => {
    window.electronAPI.onSaveFileReply((event, token, message) => {
      console.log(message);
    });

    window.electronAPI.onOpenFileReply((event, token, result) => {
      console.log(event);
      if (result && result.isSuccess) {
        switch (token) {
          case "openSaveJson": {
            const { nodes, size, targetPosition, targetStyle } = LoadSaveFile(
              result.data
            );
            const { connections, targets } = createNodes({
              nodes,
              targetPosition,
              targetStyle,
            });
            setCurrentTargets(targets);
            setCurrentConnections(connections);
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
            const dataURL = annotationLayerRef?.toDataURL({
              pixelRatio: annotationLayerRef.parent
                ? 1 / annotationLayerRef.parent?.scaleX()
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
          }}
        >
          button
        </button>
        <button
          className="button"
          onClick={() => {
            window.electronAPI.openFile("openImage", {
              // filters: [{ name: "Image", extensions: ["png", "jpg", "jpeg"] }],
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
            const unSaveTargetPosition =
              TargetsToTargetPositions(currentTargets);
            const saveFile = GenerateSaveFile({
              nodes: savedNodes.nodes,
              targetStyle: savedNodes.targetStyle,
              targetPosition: unSaveTargetPosition,
              size: currentCanvasSize,
            });
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
