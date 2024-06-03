import { appStateAtom } from "@/shared/stores/atom";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { FC, useState } from "react";

const CurrentStatus: FC = () => {
  const appState = useAtomValue(appStateAtom);
  const [isOpen, setIsOpen] = useState(true);

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
      <Button
        size="xs"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {isOpen ? "Hide" : "Open"} Status
      </Button>
      <VStack align={"flex-start"} hidden={!isOpen}>
        {contents.map((content) => (
          <VStack key={content.title} align={"flex-start"} gap={1}>
            <Heading size="xs">{content.title}</Heading>
            <Text fontSize={"sm"} overflowWrap={"anywhere"}>
              {content.content}
            </Text>
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default CurrentStatus;
