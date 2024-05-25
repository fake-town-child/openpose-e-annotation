import {
  layerListAtomsAtom,
  currentImgSrcFilepathAtom,
  currentSaveFilepathAtom,
} from "@/shared/stores/atom";
import { Layer } from "@/shared/types";
import { BufferToPNGDataURL } from "@/shared/util";
import {
  VStack,
  Heading,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";

const ImageFileLoad: FC = () => {
  const toast = useToast();
  const [layerListAtoms, dispatchListAtoms] = useAtom(layerListAtomsAtom);
  const [currentImgSrcFilepath, setCurrentImgSrcFilepath] = useAtom(
    currentImgSrcFilepathAtom
  );
  const currentSaveFilepath = useAtomValue(currentSaveFilepathAtom);

  const isActive: boolean =
    currentSaveFilepath === "" ||
    currentSaveFilepath === null ||
    currentSaveFilepath === undefined;

  const getImageFile = (filePath: string) => {
    window.electronAPI
      .getFile({ filePath: filePath })
      .then((data) => {
        const newLayer: Layer = {
          name: "bgImage",
          type: "image",
          src: BufferToPNGDataURL(data),
          ref: null,
          filePath: filePath,
        };
        dispatchListAtoms({
          type: "insert",
          value: newLayer,
          before: layerListAtoms[0],
        });
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
          setCurrentImgSrcFilepath(filePath);
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
          value={currentImgSrcFilepath}
          onChange={(e) => {
            setCurrentImgSrcFilepath(e.target.value);
          }}
          disabled={!isActive}
        />
        <InputRightElement w="5rem">
          <Button
            size="xs"
            onClick={() => {
              setImgSrcWithDialog();
            }}
            isDisabled={!isActive}
          >
            Open File
          </Button>
        </InputRightElement>
      </InputGroup>
      <Button
        size="sm"
        onClick={() => {
          if (currentImgSrcFilepath) {
            getImageFile(currentImgSrcFilepath);
          }
        }}
        isDisabled={!isActive}
      >
        Load Image
      </Button>
    </VStack>
  );
};

export default ImageFileLoad;
