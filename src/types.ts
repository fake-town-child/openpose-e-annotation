import { Layer as ELayer } from "konva/lib/Layer";

export type Nodes = {
  nodes: NodeStructure[];
  targetStyle?: TargetStyle[];
  targetPosition?: TargetPosition[];
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

export type Layer = {
  name: string;
  nodes: Nodes;
  ref: ELayer | null;
};

export type AppState = {
  layerList: Layer[];
  size: {
    width: number;
    height: number;
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
