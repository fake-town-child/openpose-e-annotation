import {
  appStateAtom,
  redoHistoryAtom,
  undoHistoryAtom,
} from "@/shared/stores/atom";
import { Button } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import { useResetCampus } from "../hooks/useReset";

const Debug: FC = () => {
  const appState = useAtomValue(appStateAtom);
  const { resetCampus } = useResetCampus();
  const [canUndo, undo] = useAtom(undoHistoryAtom);
  const [canRedo, redo] = useAtom(redoHistoryAtom);

  return (
    <div>
      <Button onClick={() => console.log(appState)}>Debug</Button>
      <Button onClick={() => resetCampus()}>Reset</Button>
      <Button onClick={() => undo()} isDisabled={!canUndo}>
        Undo
      </Button>
      <Button onClick={() => redo()} isDisabled={!canRedo}>
        Redo
      </Button>
    </div>
  );
};

export default Debug;
