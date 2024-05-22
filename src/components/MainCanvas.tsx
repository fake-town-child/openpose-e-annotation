import { Stage, Layer } from "react-konva";
import { FC, useEffect, useRef } from "react";
import { useWindowEvent } from "../hooks/windowEvent";
import { Stage as EStage } from "konva/lib/Stage";
import { useAtom, useAtomValue } from "jotai";
import {
  canvasSizeAtom,
  layerListAtom,
  layerListAtomsAtom,
} from "../stores/atom";
import ImageObj from "./ImageObj";
import AnnotationLayer from "./AnnotationLayer";
import ImageLayer from "./ImageLayer";

const MainCanvas: FC = () => {
  const stageRef = useRef<EStage>(null);

  const layerList = useAtomValue(layerListAtom);
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
        console.log(layerList);
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
      {/* <Layer>
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
            }}
          />
        ) : null}
      </Layer> */}
      {layerListAtoms.map((layer, i) => {
        console.log(layerList, layerListAtoms);
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
