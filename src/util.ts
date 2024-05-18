import {
  Connection,
  NodeStructure,
  Target,
  TargetPosition,
  TargetStyle,
} from "./types";
import { Buffer } from "buffer";

export const createNodes = ({
  nodes,
  targetStyle = [],
  targetPosition = [],
}: {
  nodes: NodeStructure[];
  targetStyle?: TargetStyle[];
  targetPosition?: TargetPosition[];
}): {
  targets: Target[];
  connections: Connection[];
} => {
  const targetNameSet = new Set<string>();

  const connections: Connection[] = nodes.map((node) => {
    targetNameSet.add(node.start);
    targetNameSet.add(node.end);
    return {
      id: `connection-${node.start}-${node.end}`,
      from: `target-${node.start}`,
      to: `target-${node.end}`,
      color: node.color,
      strokeWidth: node.strokeWidth,
    };
  });

  const targets: Target[] = Array.from(targetNameSet).map((targetName) => {
    const { id: _, ...omitIdStyle } = targetStyle.find(
      (style) => style.id === targetName
    ) ?? { id: "_" };

    const container = document.querySelector("#stage-parent");
    const containerWidth = container
      ? container.getBoundingClientRect().width
      : window.innerWidth;
    const containerHeight = container
      ? container.getBoundingClientRect().height
      : window.innerHeight;
    const {
      id: __,
      x,
      y,
    } = targetPosition.find((position) => position.id === targetName) ?? {
      id: "_",
      x: containerWidth * Math.random(),
      y: containerHeight * Math.random(),
    };

    return {
      id: `target-${targetName}`,
      x: x,
      y: y,
      connections: connections
        .filter(
          (connection) =>
            connection.from === `target-${targetName}` ||
            connection.to === `target-${targetName}`
        )
        .map((connection) => connection.id),
      ...omitIdStyle,
    };
  });

  console.log(targets, connections);

  return { targets, connections };
};

export const PNGdataURLtoBuffer = (dataURL: string): Buffer => {
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64Data, "base64");
};

// https://zenn.dev/takaodaze/articles/74ac1684a7d1d2
function toBinary(string: string) {
  // JSの文字列はUTF-16からなるので、16bitの箱を用意する
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    // １文字ずつコードポイントを出力して、入れていく
    codeUnits[i] = string.charCodeAt(i);
  }
  // （...） 内がわかりにくいが、16bit 毎だったバイナリを 8bit 毎にわけて、それぞれを文字列に変換している
  // Uint8Array の要素の範囲は 0..255 であるため変換後の文字が`バイナリ文字`であることが保証できる
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}

function arrayBufferToBinaryString(arrayBuffer: Buffer) {
  let binaryString = "";
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return binaryString;
}

export const BufferToPNGDataURL = (buffer: Buffer): string => {
  const binaryString = arrayBufferToBinaryString(buffer);
  const base64Data = btoa(binaryString);
  return `data:image/png;base64,${base64Data}`;
};