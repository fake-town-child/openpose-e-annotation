import { appModeAtom, appModeDef } from "../../shared/stores/atom";
import { AppMode } from "@/shared/types";
import { Select, Box, Divider } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FC } from "react";
import SingleModeMenu from "./SingleModeMenu";
import Debug from "./Debug";
import CurrentStatus from "./CurrentStatus";
import DirectoryModeMenu from "./DirectoryMode/DirectoryModeMenu";

const Sidebar: FC = () => {
  const [appMode, setAppMode] = useAtom(appModeAtom);

  const switchMenu = (mode: AppMode) => {
    switch (mode) {
      case "Single":
        return <SingleModeMenu />;
      case "Directory":
        return <DirectoryModeMenu />;
    }
  };

  return (
    <Box
      as="aside"
      maxWidth={400}
      h="100%"
      overflowY={"auto"}
      borderColor={"gray.200"}
      bgColor={"white"}
      borderWidth={1}
      borderRadius={""}
      p={4}
      flexGrow={1}
      display={"flex"}
      flexDir={"column"}
      gap={4}
    >
      <Select
        size={"sm"}
        value={appMode}
        onChange={(e) => {
          appModeDef.includes(e.target.value as AppMode) &&
            setAppMode(e.target.value as AppMode);
        }}
      >
        <option value="Single">Single Image Mode</option>
        <option value="Directory">Directory Mode</option>
      </Select>

      <CurrentStatus />
      <Divider />
      {switchMenu(appMode)}
      <Debug />
    </Box>
  );
};

export default Sidebar;
