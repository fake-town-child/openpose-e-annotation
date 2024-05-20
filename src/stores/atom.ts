import { atom } from "jotai";
import { Layer } from "konva/lib/Layer";

export const bgImgDataUrlAtom = atom<string | null>(null);

export const annotationLayerAtom = atom<Layer | null>(null);

export const canvasSizeAtom = atom<{ width: number; height: number }>({
  width: 1024,
  height: 1024,
});
