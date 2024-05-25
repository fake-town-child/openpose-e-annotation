import {
  canvasSizeAtom,
  currentImgSrcFilepathAtom,
  currentSaveFilepathAtom,
  layerListAtom,
} from "@/shared/stores/atom";
import { LoadSaveFile } from "@/shared/util";
import {
  VStack,
  Heading,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FC } from "react";

const SaveFileLoad: FC = () => {
  const toast = useToast();
  const [currentSaveFilepath, setCurrentSaveFilepath] = useAtom(
    currentSaveFilepathAtom
  );
  const [layerList, setLayerList] = useAtom(layerListAtom);
  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const [currentImgSrcFilepath, setCurrentImgSrcFilepath] = useAtom(
    currentImgSrcFilepathAtom
  );

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
          setCurrentSaveFilepath(filePath);
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

  const getSaveFile = (filePath: string) => {
    window.electronAPI
      .getFile({ filePath: filePath })
      .then((data) => {
        const { layerList, size, state } = LoadSaveFile(data);
        setLayerList(layerList);
        if (size) {
          setCanvasSize(size);
        }
        if (state) {
          setCurrentImgSrcFilepath(state.currentImgSrcFilepath);
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
          value={currentSaveFilepath}
          onChange={(e) => {
            setCurrentSaveFilepath(e.target.value);
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
      <Button
        size="sm"
        onClick={() => {
          if (currentSaveFilepath) {
            getSaveFile(currentSaveFilepath);
          }
        }}
      >
        Load Savefile
      </Button>
    </VStack>
  );
};

export default SaveFileLoad;
