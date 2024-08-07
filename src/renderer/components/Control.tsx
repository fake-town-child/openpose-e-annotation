import {
  appStateAtom,
  redoHistoryAtom,
  undoHistoryAtom,
} from "@/shared/stores/atom";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import { useResetAnnotation, useResetCampus } from "../hooks/useReset";
import { useMousetrap } from "../hooks/useMousetrap";
import { defaultLayersSmall } from "@/shared/stores/define";
const Control: FC = () => {
  const appState = useAtomValue(appStateAtom);
  const { resetCampus } = useResetCampus();
  const { resetAnnotation } = useResetAnnotation();
  const [canUndo, undo] = useAtom(undoHistoryAtom);
  const [canRedo, redo] = useAtom(redoHistoryAtom);

  useMousetrap(
    "ctrl+z",
    () => {
      undo();
    },
    undefined,
    [canUndo]
  );

  useMousetrap(
    "ctrl+shift+z",
    () => {
      redo();
    },
    undefined,
    [canRedo]
  );

  return (
    <ButtonGroup size="sm" flexWrap={"wrap"} rowGap={2}>
      <Button onClick={() => undo()} isDisabled={!canUndo}>
        Undo
      </Button>
      <Button onClick={() => redo()} isDisabled={!canRedo}>
        Redo
      </Button>
      <Button onClick={() => resetCampus()}>Reset All</Button>
      <Button onClick={() => resetAnnotation()}>Reset Annotation</Button>
      <Button
        onClick={() => {
          resetAnnotation({
            referenceLayers: defaultLayersSmall,
          });
        }}
      >
        Reset Annotation(small)
      </Button>
    </ButtonGroup>
  );
};

export default Control;
