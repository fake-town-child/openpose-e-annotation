import { Stage, Layer, Circle } from "react-konva";
import { FC, useCallback, useEffect, useRef } from "react";
import { useWindowEvent } from "../hooks/windowEvent";
import { Stage as EStage } from "konva/lib/Stage";
import { useAtom, useAtomValue } from "jotai";
import {
  canvasSizeAtom,
  layerListAtom,
  layerListAtomsAtom,
  stageRefAtom,
} from "../../shared/stores/atom";
import AnnotationLayer from "./AnnotationLayer";
import ImageLayer from "./ImageLayer";
import { useCanvasSize } from "../hooks/useCanvasSize";

const MainCanvas: FC = () => {
  const localStageRef = useRef<EStage | null>(null);

  const layerList = useAtomValue(layerListAtom);
  const layerListAtoms = useAtomValue(layerListAtomsAtom);
  const canvasSize = useAtomValue(canvasSizeAtom);
  const [stageRef, setStageRef] = useAtom(stageRefAtom);

  const { FitToWindow } = useCanvasSize();

  const setLayerRef = useCallback((ref: EStage) => {
    if (!localStageRef.current) {
      localStageRef.current = ref;
      setStageRef(localStageRef);
    }
  }, []);

  useWindowEvent(
    "resize",
    () => {
      FitToWindow(localStageRef);
    },
    [canvasSize, layerList, layerListAtoms]
  );

  useEffect(() => {
    FitToWindow(localStageRef);
  }, [canvasSize, layerList, layerListAtoms]);

  return (
    <Stage
      width={canvasSize.width}
      height={canvasSize.height}
      ref={setLayerRef}
      id="stage"
      onClick={(e) => {
        e.evt.preventDefault();
      }}
    >
      {layerListAtoms.map((layer, i) => {
        switch (layerList[i].type) {
          case "annotation":
            return (
              <AnnotationLayer key={layerList[i].name} layerAtom={layer} />
            );
          case "image":
            return <ImageLayer key={layerList[i].name} layerAtom={layer} />;
          default:
            return null;
        }
      })}
    </Stage>
  );
};

export default MainCanvas;
