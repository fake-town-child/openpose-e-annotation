import { Layer as ELayer } from "konva/lib/Layer";
import { appModeDef } from "./stores/atom";

export type Nodes = {
  nodes: NodeStructure[];
  targetStyle?: TargetStyle[];
  targetPosition?: TargetPosition[];
  defaultTargetStyle?: Omit<TargetStyle, "id">;
  defaultConnectionStyle?: Omit<ConnectionStyle, "id">;
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
      filePath: string | null;
    }
);

export type AppMode = (typeof appModeDef)[number];

export type CurrentImgSrcFilepath = string | undefined;

export type CurrentSaveFilepath = string | undefined;

export type DirectoryModeFile = {
  sourcePath: string;
  sourceFileName: string;
  isSavefileExists: boolean;
  isAnnotationImageExists: boolean;
};

export type DirectoryModeState = {
  sourceDir?: string;
  outputDir?: string;
  files: DirectoryModeFile[];
};

export type AppState = {
  layerList: Layer[];
  size: {
    width: number;
    height: number;
  };
  state: {
    currentImgSrcFilepath: CurrentImgSrcFilepath;
    currentSaveFilepath: CurrentSaveFilepath;
  };
  runtimeState: {
    appMode: AppMode;
    directoryMode?: DirectoryModeState;
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

export type SaveFile = Omit<AppState, "runtimeState">;

export type History = {
  layerList: Layer[][];
  index: number;
};
