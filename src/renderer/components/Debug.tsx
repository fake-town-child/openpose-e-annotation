import { appStateAtom } from "@/shared/stores/atom";
import { Button } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { useResetCampus } from "../hooks/useReset";

const Debug: FC = () => {
  const appState = useAtomValue(appStateAtom);
  const { resetCampus } = useResetCampus();
  return (
    <div>
      <Button onClick={() => console.log(appState)}>Debug</Button>
      <Button onClick={() => resetCampus()}>Reset</Button>
    </div>
  );
};

export default Debug;
