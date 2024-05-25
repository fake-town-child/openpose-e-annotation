import { PrimitiveAtom, atom } from "jotai";
import { atomWithReset, splitAtom } from "jotai/utils";
import { Layer as ELayer } from "konva/lib/Layer";
import { AppMode, AppState, CurrentImgSrcFilepath, Layer } from "../types";
import { humanNodes } from "./define";

export const appModeDef = ["Single", "Directory"] as const;

export const canvasSizeAtom = atomWithReset<{ width: number; height: number }>({
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

export const layerListAtom = atomWithReset<Layer[]>([defaultLayer]);

export const layerListAtomsAtom = splitAtom(layerListAtom);

export const appModeAtom = atom<AppMode>("Single");

export const currentImgSrcFilepathAtom =
  atomWithReset<CurrentImgSrcFilepath>(undefined);

export const currentSaveFilepathAtom = atomWithReset<string | undefined>(
  undefined
);

export const appStateAtom = atom<AppState>((get) => ({
  layerList: get(layerListAtom),
  size: get(canvasSizeAtom),
  state: {
    appMode: get(appModeAtom),
    currentImgSrcFilepath: get(currentImgSrcFilepathAtom),
    currentSaveFilepath: get(currentSaveFilepathAtom),
  },
}));

export const isSaveImageModeAtom = atom<boolean>(false);
