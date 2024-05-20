import { Stage, Layer, Circle, Line } from "react-konva";
import { FC, useCallback, useEffect, useRef } from "react";
import {
  Connection,
  NodeStructure,
  Target,
  TargetPosition,
  TargetStyle,
} from "../types";
import { createNodes } from "../util";
import { Line as ELine } from "konva/lib/shapes/Line";
import { useWindowEvent } from "../hooks/windowEvent";
import { Stage as EStage } from "konva/lib/Stage";
import { atom, useAtom, useAtomValue } from "jotai";
import {
  annotationLayerAtom,
  bgImgDataUrlAtom,
  canvasSizeAtom,
  layerListAtom,
  layerListAtomsAtom,
} from "../stores/atom";
import ImageObj from "./ImageObj";
import { Layer as ELayer } from "konva/lib/Layer";
import { humanNodes } from "../stores/define";
import AnnotationLayer from "./AnnotationLayer";

const { targets, connections } = createNodes(humanNodes);

export const savedNodesAtom = atom<{
  nodes: NodeStructure[];
  targetStyle?: TargetStyle[];
  targetPosition?: TargetPosition[];
}>(humanNodes);
export const currentTargetsAtom = atom<Target[]>(targets);
export const currentConnectionsAtom = atom<Connection[]>(connections);

const MainCanvas: FC = () => {
  const stageRef = useRef<EStage>(null);

  const [layerList, setLayerList] = useAtom(layerListAtom);
  const layerListAtoms = useAtomValue(layerListAtomsAtom);

  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);

  const FitToWindow = () => {
    const container = document.querySelector("#stage-parent");
    if (container && stageRef) {
      const containerWidth = container.getBoundingClientRect().width;
      const containerHeight = container.getBoundingClientRect().height;

      const {
        width: actualWidth,
        height: actualHeight,
        scale,
      } = canvasSize.width > canvasSize.height
        ? {
            width: containerWidth,
            height: containerWidth * (canvasSize.height / canvasSize.width),
            scale: containerWidth / canvasSize.width,
          }
        : {
            width: containerHeight * (canvasSize.width / canvasSize.height),
            height: containerHeight,
            scale: containerHeight / canvasSize.height,
          };

      const containerSize = Math.min(containerWidth, containerHeight);

      if (stageRef.current) {
        stageRef.current.width(actualWidth);
        stageRef.current.height(actualHeight);
        stageRef.current.scale({ x: scale, y: scale });
        layerList.forEach((layer) => {
          if (layer.ref) {
            layer.ref.width(containerSize);
            layer.ref.height(containerSize);
            // layer.ref.scale({ x: scale, y: scale });
          }
        });
      }
    }
  };

  useWindowEvent(
    "resize",
    () => {
      FitToWindow();
    },
    [canvasSize, layerList]
  );

  useEffect(() => {
    FitToWindow();
  }, [canvasSize]);

  const bgImgDataUrl = useAtomValue(bgImgDataUrlAtom);

  return (
    <Stage
      width={canvasSize.width}
      height={canvasSize.height}
      ref={stageRef}
      id="stage"
    >
      <Layer>
        {bgImgDataUrl ? (
          <ImageObj
            src={bgImgDataUrl}
            width={canvasSize.width}
            height={canvasSize.height}
            onLoadCallback={(img) => {
              setCanvasSize({
                width: img.naturalWidth,
                height: img.naturalHeight,
              });
              console.log(img.naturalWidth, img.naturalHeight);
            }}
          />
        ) : null}
      </Layer>
      {layerListAtoms.map((layer) => (
        <AnnotationLayer key={String(layer)} layerAtom={layer} />
      ))}
    </Stage>
  );
};

export default MainCanvas;
