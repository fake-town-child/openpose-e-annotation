import { PrimitiveAtom, atom } from "jotai";
import { atomWithReset, splitAtom } from "jotai/utils";
import { Layer as ELayer } from "konva/lib/Layer";
import {
  AppMode,
  AppState,
  CurrentImgSrcFilepath,
  DirectoryModeState,
  History,
  Layer,
} from "../types";
import { defaultLayers, humanNodes } from "./define";
import { currentVersion } from "../version";

export const appModeDef = ["Single", "Directory"] as const;

export const canvasSizeAtom = atomWithReset<{ width: number; height: number }>({
  width: 1024,
  height: 1024,
});

export type LayerAtom = PrimitiveAtom<Layer>;

export const layerListAtom = atomWithReset<Layer[]>(defaultLayers);

export const layerListAtomsAtom = splitAtom(layerListAtom);

export const updateLayerListAtom = atom(
  (get) => !!get(layerListAtom),
  (get, set, targetAtom: PrimitiveAtom<Layer>, value: Layer) => {
    set(targetAtom, value);
  }
);

export const appModeAtom = atom<AppMode>("Single");

export const currentImgSrcFilepathAtom =
  atomWithReset<CurrentImgSrcFilepath>(undefined);

export const currentSaveFilepathAtom = atomWithReset<string | undefined>(
  undefined
);

export const appStateAtom = atom<AppState>((get) => ({
  appVersion: currentVersion,
  layerList: get(layerListAtom),
  size: get(canvasSizeAtom),
  state: {
    currentImgSrcFilepath: get(currentImgSrcFilepathAtom),
    currentSaveFilepath: get(currentSaveFilepathAtom),
  },
  runtimeState: {
    appMode: get(appModeAtom),
    directoryMode: get(DirectoryModeStateAtom),
  },
}));

export const isSaveImageModeAtom = atom<boolean>(false);

export const historyAtom = atomWithReset<History>({
  layerList: [],
  index: 0,
});

export const saveHistoryAtom = atom(null, (get, set) => {
  const { layerList, index } = get(historyAtom);
  set(historyAtom, {
    layerList: [...layerList.slice(0, index + 1), get(layerListAtom)],
    index: index + 1,
  });
});

export const undoHistoryAtom = atom(
  (get) => {
    const { index } = get(historyAtom);
    const canUndo = index > 0;
    return canUndo;
  },
  (get, set) => {
    const { index, layerList } = get(historyAtom);
    if (index > 0) {
      set(layerListAtom, layerList[index - 1]);
      set(historyAtom, { layerList, index: index - 1 });
    }
  }
);

export const redoHistoryAtom = atom(
  (get) => {
    const { index, layerList } = get(historyAtom);
    const canRedo = index < layerList.length - 1;
    return canRedo;
  },
  (get, set) => {
    const { index, layerList } = get(historyAtom);
    if (index < layerList.length - 1) {
      set(layerListAtom, layerList[index + 1]);
      set(historyAtom, { layerList, index: index + 1 });
    }
  }
);

export const DirectoryModeStateAtom = atomWithReset<DirectoryModeState>({
  files: [],
  sourceDir: "",
  outputDir: "",
});
