import {
  useDirectoryMode,
  useLoadImage,
  useLoadSaveFile,
  useSaveImage,
  useSaveSavefile,
} from "@/renderer/hooks/useLoadSave";
import { useMousetrap } from "@/renderer/hooks/useMousetrap";
import { useResetCampus } from "@/renderer/hooks/useReset";
import { appStateAtom } from "@/shared/stores/atom";
import { annotationLayerNames } from "@/shared/stores/define";
import { ChangeExtension, GetExtension } from "@/shared/util";
import {
  Button,
  ButtonGroup,
  Divider,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { FC, useState } from "react";
import { MdArticle, MdDirectionsRun, MdFileOpen } from "react-icons/md";

const DirectoryModeMenu: FC = () => {
  const [sourceDirValue, setSourceDirValue] = useState<string>("");
  const [outputDirValue, setOutputDirValue] = useState<string>("");
  const { loadFiles, state, dirModeState } = useDirectoryMode({
    sourceDir: sourceDirValue,
    outputDir: outputDirValue,
  });
  const toast = useToast();

  const { saveSaveFile } = useSaveSavefile();
  const { saveImage } = useSaveImage();
  const { getImageFile } = useLoadImage();
  const { getSaveFile } = useLoadSaveFile();

  const { resetCampus } = useResetCampus();

  const appState = useAtomValue(appStateAtom);

  const setDirWithDialog = (callback?: (filepath: string) => void) => {
    window.electronAPI
      .getFileNamesWithOpenDialog({
        payload: {
          properties: ["openDirectory"],
        },
      })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          const filePath = filePaths[0];
          callback && callback(filePath);
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

  const saveCurrent = async () => {
    if (!(sourceDirValue !== "" && outputDirValue !== "")) return;
    const basename = await window.electronAPI.getBaseName({
      filePath: appState.state.currentImgSrcFilepath ?? "",
    });
    if (appState.state.currentImgSrcFilepath) {
      window.electronAPI
        .joinPath({
          paths: [outputDirValue, ChangeExtension(basename, ".json")],
        })
        .then((filePath) => {
          saveSaveFile(filePath);
        });
    }
    if (appState.state.currentImgSrcFilepath) {
      window.electronAPI
        .joinPath({
          paths: [outputDirValue, ChangeExtension(basename, ".png")],
        })
        .then((filePath) => {
          saveImage(filePath, annotationLayerNames);
        });
    }
  };

  useMousetrap(
    "ctrl+s",
    () => {
      saveCurrent();
    },
    undefined,
    [appState.state.currentSaveFilepath]
  );

  return (
    <VStack align="flex-start">
      <HStack>
        <ButtonGroup>
          <Button
            onClick={() => {
              saveCurrent();
            }}
            isDisabled={
              !(
                sourceDirValue !== "" &&
                outputDirValue !== "" &&
                !!appState.state.currentImgSrcFilepath &&
                appState.state.currentImgSrcFilepath !== ""
              )
            }
          >
            One click save
          </Button>
        </ButtonGroup>
      </HStack>
      <VStack align={"flex-start"} w="100%">
        <Heading fontSize={"sm"}>Source Directory</Heading>
        <InputGroup size={"sm"}>
          <Input
            placeholder="Input source directory path"
            value={sourceDirValue}
            onChange={(e) => {
              setSourceDirValue(e.target.value);
            }}
          />
          <InputRightElement w="5rem">
            <Button
              size="xs"
              onClick={() => {
                setDirWithDialog((filePath) => {
                  setSourceDirValue(filePath);
                });
              }}
            >
              Open File
            </Button>
          </InputRightElement>
        </InputGroup>
      </VStack>
      <VStack align={"flex-start"} w="100%">
        <Heading fontSize={"sm"}>Output Directory</Heading>
        <InputGroup size={"sm"}>
          <Input
            placeholder="Input output directory path"
            value={outputDirValue}
            onChange={(e) => {
              setOutputDirValue(e.target.value);
            }}
          />
          <InputRightElement w="5rem">
            <Button
              size="xs"
              onClick={() => {
                setDirWithDialog((filePath) => {
                  setOutputDirValue(filePath);
                });
              }}
            >
              Open File
            </Button>
          </InputRightElement>
        </InputGroup>
      </VStack>
      {!(sourceDirValue !== "" && outputDirValue !== "") ? (
        <Text size="xs" color={"red.400"}>
          Please input source and output directory path.
        </Text>
      ) : (
        ""
      )}

      <Button
        size={"sm"}
        onClick={() => {
          loadFiles();
        }}
        isLoading={state === "loading"}
        isDisabled={!(sourceDirValue !== "" && outputDirValue !== "")}
      >
        Load Files
      </Button>
      <Divider />
      <TableContainer>
        <Table size="sm">
          <Tbody>
            {dirModeState.files
              .filter((file) =>
                ["png", "jpg", "jpeg", "PNG", "JPG", "JPEG"].includes(
                  GetExtension(file.sourceFileName) ?? ""
                )
              )
              .map((file) => (
                <Tr
                  cursor={"pointer"}
                  onDoubleClick={() => {
                    if (file.isSavefileExists) {
                      window.electronAPI
                        .joinPath({
                          paths: [
                            outputDirValue,
                            ChangeExtension(file.sourceFileName, ".json"),
                          ],
                        })
                        .then((filePath) => {
                          getSaveFile(filePath);
                        });
                    } else {
                      resetCampus();
                      getImageFile(file.sourcePath);
                    }
                  }}
                >
                  <Td px={1}>
                    {file.isAnnotationImageExists ? (
                      <Icon
                        as={MdDirectionsRun}
                        boxSize={5}
                        color={"green.400"}
                      />
                    ) : (
                      ""
                    )}
                  </Td>
                  <Td px={1}>
                    {file.isSavefileExists ? (
                      <Icon as={MdArticle} boxSize={5} color={"green.400"} />
                    ) : (
                      ""
                    )}
                  </Td>
                  <Td>{file.sourceFileName}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default DirectoryModeMenu;
