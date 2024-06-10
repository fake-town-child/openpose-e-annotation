import { canvasSizeAtom } from "@/shared/stores/atom";
import { useAtomValue } from "jotai";
import { Stage } from "konva/lib/Stage";
import { RefObject } from "react";

export const useCanvasSize = () => {
  const canvasSize = useAtomValue(canvasSizeAtom);

  const FitToWindow = (stageRef: RefObject<Stage>) => {
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

  const ResetWindow = (stageRef: RefObject<Stage>) => {
    if (stageRef.current) {
      stageRef.current.width(canvasSize.width);
      stageRef.current.height(canvasSize.height);
      stageRef.current.scale({ x: 1, y: 1 });
    }
  };

  return { FitToWindow, ResetWindow };
};
