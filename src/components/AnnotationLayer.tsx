import { useAtom, useAtomValue } from "jotai";
import { FC, useCallback, useRef } from "react";
import { Circle, Layer, Line } from "react-konva";
import { canvasSizeAtom } from "../stores/atom";
import { Line as ELine } from "konva/lib/shapes/Line";
import { Layer as ELayer } from "konva/lib/Layer";
import { Connection, Target } from "../types";

type Props = {
  connections: Connection[];
  targets: Target[];
};

const AnnotationLayer: FC<Props> = ({ connections, targets }) => {
  const canvasSize = useAtomValue(canvasSizeAtom);

  const connectionRefs = useRef<{
    [key in string]: ELine;
  }>({});

  const callbackRef = useCallback((node: ELine) => {
    if (node) {
      connectionRefs.current[node.id()] = node;
    }
  }, []);

  return (
    <>
      <Layer
        ref={setAnnotationLayerRef}
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
                settargets(
                  targets.map((t) =>
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
    </>
  );
};

export default AnnotationLayer;
