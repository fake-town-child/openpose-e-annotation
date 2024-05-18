import { FC, useEffect } from "react";
import MainCanvas, {
  currentConnectionsAtom,
  currentTargetsAtom,
} from "./components/MainCanvas";
import { useAtomValue, useSetAtom } from "jotai";
import { BufferToPNGDataURL, PNGdataURLtoBuffer, createNodes } from "./util";
import {
  annotationLayerAtom,
  bgImgDataUrlAtom,
  canvasSizeAtom,
} from "./stores/atom";

const App: FC = () => {
  const annotationLayerRef = useAtomValue(annotationLayerAtom);
  const setBgImgDataUrl = useSetAtom(bgImgDataUrlAtom);

  const setCanvasSize = useSetAtom(canvasSizeAtom);
  const setCurrentTargets = useSetAtom(currentTargetsAtom);
  const setCurrentConnections = useSetAtom(currentConnectionsAtom);

  useEffect(() => {
    window.electronAPI.onSaveFileReply((event, message) => {
      console.log(message);
    });

    window.electronAPI.onOpenFileReply((event, result) => {
      if (result.isSuccess) {
        setBgImgDataUrl(BufferToPNGDataURL(result.data));
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
            const dataURL = annotationLayerRef?.toDataURL();
            if (dataURL) {
              window.electronAPI.saveFile(PNGdataURLtoBuffer(dataURL));
            }
          }}
        >
          button
        </button>
        <button
          className="button"
          onClick={() => {
            window.electronAPI.openFile();
          }}
        >
          open
        </button>
        <button
          className="button"
          onClick={() => {
            setCanvasSize({ width: 1024, height: 1024 });
          }}
        >
          canvas size change
        </button>
        <button
          className="button"
          onClick={() => {
            const { targets, connections } = createNodes({
              nodes: [
                { start: "a", end: "b" },
                { start: "b", end: "c" },
                { start: "b", end: "d", color: "#12FF12" },
              ],
            });

            setCurrentTargets(targets);
            // setCurrentConnections(connections);
          }}
        >
          reset nodes
        </button>
      </aside>
      <main id="stage-parent">
        <MainCanvas />
      </main>
    </div>
  );
};

export default App;
