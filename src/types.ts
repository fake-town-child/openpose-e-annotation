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
};

export type ConnectionStyle = {
  color?: string;
  strokeWidth?: number;
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
