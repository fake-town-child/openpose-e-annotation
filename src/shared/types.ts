import { Layer as ELayer } from "konva/lib/Layer";
import { appModeDef } from "./stores/atom";

export type Nodes = {
  nodes: NodeStructure[];
  targetStyle?: TargetStyle[];
  targetPosition?: TargetPosition[];
  defaultTargetStyle?: Omit<TargetStyle, "id">;
};

export type Target = {
  id: string;
  connections?: string[];
} & TargetPosition &
  TargetStyle;

export type Connection = {
  id: string;
  from: string;
  to: string;
} & ConnectionStyle;

export type NodeStructure = {
  start: string;
  end: string;
  color?: string;
  strokeWidth?: number;
};

export type TargetStyle = {
  id: string;
  color?: string;
  radius?: number;
};

export type TargetPosition = {
  id: string;
  x: number;
  y: number;
  state?: "default" | "disabled";
};

export type ConnectionStyle = {
  color?: string;
  strokeWidth?: number;
};

export type LayerType = "annotation" | "image";

export type Layer = {
  name: string;
  ref: ELayer | null;
  visible?: boolean;
} & (
  | {
      type: "annotation";
      nodes: Nodes;
    }
  | {
      type: "image";
      src: string | null;
    }
);

export type AppMode = (typeof appModeDef)[number];

export type CurrentImgSrcFilepath = string | undefined;

export type AppState = {
  layerList: Layer[];
  size: {
    width: number;
    height: number;
  };
  state: {
    appMode: AppMode;
    currentImgSrcFilepath: CurrentImgSrcFilepath;
  };
};

export type OpenFile =
  | {
      isSuccess: true;
      data: Buffer;
    }
  | {
      isSuccess: false;
      message: string;
    };

export type SaveFile = AppState;
