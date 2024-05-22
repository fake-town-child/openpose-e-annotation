import { PrimitiveAtom, atom } from "jotai";
import { splitAtom } from "jotai/utils";
import { Layer as ELayer } from "konva/lib/Layer";
import { AppState, Layer } from "../types";
import { humanNodes } from "./define";

export const canvasSizeAtom = atom<{ width: number; height: number }>({
  width: 1024,
  height: 1024,
});

export type LayerAtom = PrimitiveAtom<Layer>;

const defaultLayer: Layer = {
  name: "humanAnnotation",
  type: "annotation",
  nodes: humanNodes,
  ref: null,
};

export const layerListAtom = atom<Layer[]>([defaultLayer]);

export const layerListAtomsAtom = splitAtom(layerListAtom);

export const appSateAtom = atom<AppState>((get) => ({
  layerList: get(layerListAtom),
  size: get(canvasSizeAtom),
}));

export const isSaveImageModeAtom = atom<boolean>(false);
