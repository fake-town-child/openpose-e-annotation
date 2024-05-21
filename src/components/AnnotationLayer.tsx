import { useAtom, useAtomValue } from "jotai";
import { FC, useCallback, useEffect, useRef } from "react";
import { Circle, Layer, Line } from "react-konva";
import { LayerAtom, canvasSizeAtom, isSaveImageModeAtom } from "../stores/atom";
import { Line as ELine } from "konva/lib/shapes/Line";
import { Layer as ELayer } from "konva/lib/Layer";
import { createNodes } from "../util";

type Props = {
  layerAtom: LayerAtom;
};

const AnnotationLayer: FC<Props> = ({ layerAtom }) => {
  const [layerData, setLayerData] = useAtom(layerAtom);

  const localLayerRef = useRef<ELayer | null>(null);

  const setLayerRef = useCallback(
    (ref: ELayer) => {
      localLayerRef.current = ref;
      setLayerData({ ...layerData, ref });
    },
    [setLayerData, localLayerRef]
  );

  const { targets, connections } = createNodes({
    nodes: layerData.nodes.nodes,
    targetStyle: layerData.nodes.targetStyle,
    targetPosition: layerData.nodes.targetPosition,
  });

  const canvasSize = useAtomValue(canvasSizeAtom);

  const connectionRefs = useRef<{
    [key in string]: ELine;
  }>({});

  const callbackRef = useCallback((node: ELine) => {
    if (node) {
      connectionRefs.current[node.id()] = node;
    }
  }, []);

  const isSaveImageMode = useAtomValue(isSaveImageModeAtom);

  return (
    <>
      <Layer
        ref={setLayerRef}
        width={canvasSize.width}
        height={canvasSize.height}
      >
        {connections.map((connection) => {
          const from = targets.find((target) => target.id === connection.from);
          const to = targets.find((target) => target.id === connection.to);

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
              opacity={
                from.state === "disabled" && to.state === "disabled"
                  ? isSaveImageMode
                    ? 0
                    : 0.5
                  : 1
              }
            />
          );
        })}
        {targets.map((target) => (
          <Circle
            key={target.id}
            id={target.id}
            fill={target.color ?? "black"}
            radius={20}
            shodowBlur={10}
            draggable={true}
            opacity={
              target.state === "disabled" ? (isSaveImageMode ? 0 : 0.5) : 1
            }
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
              const target = targets.find(
                (target) => target.id === event.target.id()
              );
              if (target) {
                setLayerData({
                  ...layerData,
                  nodes: {
                    ...layerData.nodes,
                    targetPosition: layerData.nodes.targetPosition?.map((p) =>
                      `target-${p.id}` === target.id
                        ? { ...p, x: event.target.x(), y: event.target.y() }
                        : p
                    ),
                  },
                });
              }
            }}
            onClick={(event) => {
              if (event.evt.button == 2) {
                const target = targets.find(
                  (target) => target.id === event.target.id()
                );
                if (target) {
                  setLayerData({
                    ...layerData,
                    nodes: {
                      ...layerData.nodes,
                      targetPosition: layerData.nodes.targetPosition?.map((p) =>
                        `target-${p.id}` === target.id
                          ? {
                              ...p,
                              state:
                                target.state === "default" ||
                                target.state === undefined
                                  ? "disabled"
                                  : "default",
                            }
                          : p
                      ),
                    },
                  });
                }
              }
            }}
          />
        ))}
      </Layer>
    </>
  );
};

export default AnnotationLayer;
