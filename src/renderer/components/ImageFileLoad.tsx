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
import { FC, useEffect, useState } from "react";
import { useLoadImage } from "../hooks/useLoadSave";
import { currentImgSrcFilepathAtom } from "@/shared/stores/atom";
import { useAtomValue } from "jotai";

const ImageFileLoad: FC = () => {
  const toast = useToast();
  const [inputValue, setInputValue] = useState<string>("");
  const currentImgSrcFilepath = useAtomValue(currentImgSrcFilepathAtom);

  const { state, getImageFile } = useLoadImage();

  useEffect(() => {
    if (currentImgSrcFilepath) {
      setInputValue(currentImgSrcFilepath);
    }
  }, [currentImgSrcFilepath]);

  const setImgSrcWithDialog = () => {
    window.electronAPI
      .getFileNamesWithOpenDialog({
        payload: {
          filters: [{ name: "Image", extensions: ["png", "jpg", "jpeg"] }],
          properties: ["openFile"],
        },
      })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          const filePath = filePaths[0];
          setInputValue(filePath);
          getImageFile(filePath);
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
      <Heading fontSize={"sm"}>Load Image File</Heading>
      <InputGroup size={"sm"}>
        <Input
          placeholder="Input image file path"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <InputRightElement w="5rem">
          <Button
            size="xs"
            onClick={() => {
              setImgSrcWithDialog();
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
              getImageFile(inputValue);
            }
          }}
          isLoading={state === "loading"}
        >
          Load Image
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

export default ImageFileLoad;
