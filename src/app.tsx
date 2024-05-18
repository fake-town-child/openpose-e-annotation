import { FC, useEffect } from "react";
import MainCanvas from "./components/MainCanvas";
import { useAtomValue, useSetAtom } from "jotai";
import { BufferToPNGDataURL, PNGdataURLtoBuffer } from "./util";
import {
  annotationLayerAtom,
  bgImgDataUrlAtom,
  canvasSizeAtom,
} from "./stores/atom";

const App: FC = () => {
  const annotationLayerRef = useAtomValue(annotationLayerAtom);
  const setBgImgDataUrl = useSetAtom(bgImgDataUrlAtom);

  const setCanvasSize = useSetAtom(canvasSizeAtom);

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
            setCanvasSize({ width: 1024, height: 512 });
          }}
        >
          canvas size change
        </button>
      </aside>
      <main id="stage-parent">
        <MainCanvas />
      </main>
    </div>
  );
};

export default App;
