import { Stage, Layer, Circle, Line } from "react-konva";
import { FC, useCallback, useEffect, useRef } from "react";
import { Connection, NodeStructure, Target, TargetStyle } from "../types";
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

const styles: TargetStyle[] = [{ id: "a", color: "#12FF00" }];

const { targets, connections } = createNodes({
  nodes: nnnn,
  targetStyle: styles,
});

export const currentTargetsAtom = atom<Target[]>(targets);
export const currentConnectionsAtom = atom<Connection[]>(connections);

const MainCanvas: FC = () => {
  const stageRef = useRef<EStage>(null);
  const [annotationLayer, setAnnotationLayer] = useAtom(annotationLayerAtom);
  const localAnnotationLayerRef = useRef<ELayer | null>(null);

  useEffect(() => {
    if (annotationLayer) {
      console.log("annotationLayer", annotationLayer);
    } else {
      console.log("annotationLayer is null");
    }
  }, [annotationLayer]);

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

      const containerSize = Math.min(containerWidth, containerHeight);

      const scale = Math.min(
        containerWidth / canvasSize.width,
        containerHeight / canvasSize.height
      );

      if (stageRef.current && localAnnotationLayerRef.current) {
        stageRef.current.width(containerSize);
        stageRef.current.height(containerSize);
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
              strokeWidth={connection.strokeWidth ?? 2}
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
