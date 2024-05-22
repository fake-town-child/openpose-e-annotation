import { Stage, Layer, Circle } from "react-konva";
import { FC, useEffect, useRef } from "react";
import { useWindowEvent } from "../hooks/windowEvent";
import { Stage as EStage } from "konva/lib/Stage";
import { useAtom, useAtomValue } from "jotai";
import {
  canvasSizeAtom,
  layerListAtom,
  layerListAtomsAtom,
} from "../stores/atom";
import AnnotationLayer from "./AnnotationLayer";
import ImageLayer from "./ImageLayer";

const MainCanvas: FC = () => {
  const stageRef = useRef<EStage>(null);

  const layerList = useAtomValue(layerListAtom);
  const layerListAtoms = useAtomValue(layerListAtomsAtom);
  const canvasSize = useAtomValue(canvasSizeAtom);

  const FitToWindow = () => {
    const container = document.querySelector("#stage-parent");
    if (container && stageRef) {
      const containerWidth = container.getBoundingClientRect().width;
      const containerHeight = container.getBoundingClientRect().height;

      const scaleWidth = containerWidth / canvasSize.width;
      const scaleHeight = containerHeight / canvasSize.height;
      const scale = Math.min(scaleWidth, scaleHeight);

      if (stageRef.current) {
        stageRef.current.width(canvasSize.width * scale);
        stageRef.current.height(canvasSize.height * scale);
        stageRef.current.scale({ x: scale, y: scale });
      }
    }
  };

  useWindowEvent(
    "resize",
    () => {
      FitToWindow();
    },
    [canvasSize, layerList, layerListAtoms]
  );

  useEffect(() => {
    FitToWindow();
  }, [canvasSize, layerList, layerListAtoms]);

  return (
    <Stage
      width={canvasSize.width}
      height={canvasSize.height}
      ref={stageRef}
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
