import {
  VStack,
  Heading,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { useLoadSaveFile } from "../hooks/useLoadSave";

const SaveFileLoad: FC = () => {
  const toast = useToast();

  const [inputValue, setInputValue] = useState<string>("");

  const { state, getSaveFile } = useLoadSaveFile();

  const setSavefileWithDialog = () => {
    window.electronAPI
      .getFileNamesWithOpenDialog({
        payload: {
          filters: [{ name: "JSON", extensions: ["json"] }],
          properties: ["openFile"],
        },
      })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          const filePath = filePaths[0];
          setInputValue(filePath);
          getSaveFile(filePath);
        }
      })
      .catch((err) => {
        toast({
          description: err.message,
          status: "error",
          size: "sm",
          isClosable: true,
          position: "top-right",
        });
        console.error(err);
      });
  };

  return (
    <VStack align={"flex-start"}>
      <Heading fontSize={"sm"}>Load Save File</Heading>
      <InputGroup size={"sm"}>
        <Input
          placeholder="Input save file path"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <InputRightElement w="5rem">
          <Button
            size="xs"
            onClick={() => {
              setSavefileWithDialog();
            }}
          >
            Open File
          </Button>
        </InputRightElement>
      </InputGroup>
      <HStack>
        <Button
          size="sm"
          onClick={() => {
            if (inputValue !== "") {
              getSaveFile(inputValue);
            }
          }}
          isLoading={state === "loading"}
        >
          Load Savefile
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setInputValue("");
          }}
          variant={"ghost"}
        >
          Clear input
        </Button>
      </HStack>
    </VStack>
  );
};

export default SaveFileLoad;
