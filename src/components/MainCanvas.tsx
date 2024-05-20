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
} from "../stores/atom";
import ImageObj from "./ImageObj";
import { Layer as ELayer } from "konva/lib/Layer";

const nnnn: NodeStructure[] = [
  { start: "a", end: "b" },
  { start: "b", end: "c" },
  { start: "b", end: "d", color: "#12FF12" },
];

const jingaiBones: NodeStructure[] = [
  { start: "nose", end: "neck", color: "#000099" },
  { start: "nose", end: "eye.R", color: "#330099" },
  { start: "nose", end: "eye.L", color: "#990099" },
  { start: "neck", end: "shoulder.R", color: "#990000" },
  { start: "neck", end: "shoulder.L", color: "#993300" },
  { start: "shoulder.R", end: "lower_arm.R", color: "#996600" },
  { start: "lower_arm.R", end: "hand.R", color: "#999900" },
  { start: "shoulder.L", end: "lower_arm.L", color: "#669900" },
  { start: "lower_arm.L", end: "hand.L", color: "#339900" },
  { start: "neck", end: "upper_leg.R", color: "#009900" },
  { start: "upper_leg.R", end: "lower_leg.R", color: "#009933" },
  { start: "lower_leg.R", end: "foot.R", color: "#009966" },
  { start: "neck", end: "upper_leg.L", color: "#009999" },
  { start: "upper_leg.L", end: "lower_leg.L", color: "#006699" },
  { start: "lower_leg.L", end: "foot.L", color: "#003399" },
];

const boneStyles: TargetStyle[] = [
  { id: "nose", color: "#990000" },
  { id: "eye.R", color: "#AA00FF" },
  { id: "eye.L", color: "#FF00AA" },
  { id: "neck", color: "#FF5500" },
  { id: "shoulder.R", color: "#FFAA00" },
  { id: "lower_arm.R", color: "#FFFF00" },
  { id: "hand.R", color: "#AAFF00" },
  { id: "shoulder.L", color: "#55FF00" },
  { id: "lower_arm.L", color: "#00FF00" },
  { id: "hand.L", color: "#00FF55" },
  { id: "upper_leg.R", color: "#00FFAA" },
  { id: "lower_leg.R", color: "#00FFFF" },
  { id: "foot.R", color: "#00AAFF" },
  { id: "upper_leg.L", color: "#0055FF" },
  { id: "lower_leg.L", color: "#0000FF" },
  { id: "foot.L", color: "#5500FF" },
];

const bonePositions: TargetPosition[] = [
  { id: "nose", x: 366.90820518231374, y: 127.8512909755458 },
  { id: "neck", x: 436.5364326211785, y: 318.3679866460696 },
  { id: "eye.R", x: 276.5781342448584, y: 91.41829276424066 },
  { id: "eye.L", x: 442.2879964196603, y: 74.92714025908587 },
  { id: "shoulder.R", x: 546.8808964015277, y: 300.8611594508731 },
  { id: "shoulder.L", x: 291.377855121397, y: 282.2936321338425 },
  { id: "lower_arm.R", x: 708.2860603037107, y: 372.81032780436635 },
  { id: "hand.R", x: 783.8164103646277, y: 525.9924281698684 },
  { id: "lower_arm.L", x: 190.31715499956292, y: 419.22914609694266 },
  { id: "hand.L", x: 134.61457304847136, y: 519.0296054259819 },
  { id: "upper_leg.R", x: 550.2625374379903, y: 628.3133690844971 },
  { id: "lower_leg.R", x: 589.7185329866801, y: 747.9415965233616 },
  { id: "foot.R", x: 527.0531282917021, y: 883.8164103646279 },
  { id: "upper_leg.L", x: 434.2154917065495, y: 616.708664511353 },
  { id: "lower_leg.L", x: 427.2526689626632, y: 754.9044192672479 },
  { id: "foot.L", x: 336.73597329213936, y: 867.5698239622261 },
];

const { targets, connections } = createNodes({
  nodes: jingaiBones,
  targetStyle: boneStyles,
  targetPosition: bonePositions,
});

export const savedNodesAtom = atom<{
  nodes: NodeStructure[];
  targetStyle?: TargetStyle[];
  targetPosition?: TargetPosition[];
}>({
  nodes: jingaiBones,
  targetStyle: boneStyles,
  targetPosition: bonePositions,
});
export const currentTargetsAtom = atom<Target[]>(targets);
export const currentConnectionsAtom = atom<Connection[]>(connections);

const MainCanvas: FC = () => {
  const stageRef = useRef<EStage>(null);
  const [annotationLayer, setAnnotationLayer] = useAtom(annotationLayerAtom);
  const localAnnotationLayerRef = useRef<ELayer | null>(null);

  const setAnnotationLayerRef = useCallback(
    (ref: ELayer) => {
      localAnnotationLayerRef.current = ref;
      setAnnotationLayer(ref);
    },
    [setAnnotationLayer, localAnnotationLayerRef]
  );

  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);

  const connectionRefs = useRef<{
    [key in string]: ELine;
  }>({});

  const callbackRef = useCallback((node: ELine) => {
    if (node) {
      connectionRefs.current[node.id()] = node;
    }
  }, []);

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

      if (stageRef.current && localAnnotationLayerRef.current) {
        stageRef.current.width(actualWidth);
        stageRef.current.height(actualHeight);
        stageRef.current.scale({ x: scale, y: scale });
        localAnnotationLayerRef.current.width(containerSize);
        localAnnotationLayerRef.current.height(containerSize);
        // localAnnotationLayerRef.current.scale({ x: scale, y: scale });
      }
      console.log(annotationLayer, localAnnotationLayerRef.current);
    }
  };

  useWindowEvent(
    "resize",
    () => {
      FitToWindow();
    },
    [canvasSize, annotationLayer]
  );

  useEffect(() => {
    FitToWindow();
  }, [canvasSize]);

  const [currentTargets, setCurrentTargets] = useAtom(currentTargetsAtom);
  const [currentConnections, setCurrentConnections] = useAtom(
    currentConnectionsAtom
  );

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
      <Layer
        ref={setAnnotationLayerRef}
        width={canvasSize.width}
        height={canvasSize.height}
      >
        {currentConnections.map((connection) => {
          const from = currentTargets.find(
            (target) => target.id === connection.from
          );
          const to = currentTargets.find(
            (target) => target.id === connection.to
          );

          if (!from || !to) {
            return null;
          }

          return (
            <Line
              id={connection.id}
              key={connection.id}
              points={[from.x, from.y, to.x, to.y]}
              stroke={connection.color ?? "black"}
              ref={callbackRef}
              strokeWidth={connection.strokeWidth ?? 10}
            />
          );
        })}
        {currentTargets.map((target) => (
          <Circle
            key={target.id}
            id={target.id}
            fill={target.color ?? "black"}
            radius={20}
            shodowBlur={10}
            draggable={true}
            x={target.x}
            y={target.y}
            onDragMove={(event) => {
              target.connections !== undefined
                ? target.connections.map((connectionId) => {
                    const connection = connectionRefs.current[connectionId];

                    if (
                      connections.find(
                        (connection) => connection.id === connectionId
                      )?.from === target.id
                    ) {
                      connection.points([
                        event.target.x(),
                        event.target.y(),
                        connection.points()[2],
                        connection.points()[3],
                      ]);
                    } else if (
                      connections.find(
                        (connection) => connection.id === connectionId
                      )?.to === target.id
                    ) {
                      connection.points([
                        connection.points()[0],
                        connection.points()[1],
                        event.target.x(),
                        event.target.y(),
                      ]);
                    }
                  })
                : null;
            }}
            onDragEnd={(event) => {
              const target = currentTargets.find(
                (target) => target.id === event.target.id()
              );
              if (target) {
                setCurrentTargets(
                  currentTargets.map((t) =>
                    t.id === target.id
                      ? { ...t, x: event.target.x(), y: event.target.y() }
                      : t
                  )
                );
              }
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default MainCanvas;
