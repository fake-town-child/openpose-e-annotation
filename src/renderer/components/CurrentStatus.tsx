import { appStateAtom } from "@/shared/stores/atom";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { FC } from "react";

const CurrentStatus: FC = () => {
  const appState = useAtomValue(appStateAtom);

  const contents = [
    {
      title: "Loaded Image",
      content: appState.state.currentImgSrcFilepath ?? "(none)",
    },
    {
      title: "Loaded Savefile",
      content: appState.state.currentSaveFilepath ?? "(none)",
    },
    {
      title: "Canvas Size",
      content: `${appState.size.width} x ${appState.size.height}`,
    },
  ];

  return (
    <VStack align={"flex-start"}>
      {contents.map((content) => (
        <VStack key={content.title} align={"flex-start"} gap={1}>
          <Heading size="xs">{content.title}</Heading>
          <Text fontSize={"sm"} overflowWrap={"anywhere"}>
            {content.content}
          </Text>
        </VStack>
      ))}
    </VStack>
  );
};

export default CurrentStatus;
