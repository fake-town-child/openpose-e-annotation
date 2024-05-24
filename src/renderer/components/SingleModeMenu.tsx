import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FC } from "react";

const SingleModeMenu: FC = () => {
  const toast = useToast();

  return (
    <>
      <Divider />
      <VStack align={"flex-start"}>
        <Heading fontSize={"sm"}>Loading</Heading>
        <InputGroup size={"sm"}>
          <Input placeholder="Input image file path" />
          <InputRightElement w="5rem">
            <Button size="xs">Open File</Button>
          </InputRightElement>
        </InputGroup>
        <Button
          size="sm"
          onClick={() => {
            toast({
              description: "hello",
              status: "info",
              size: "sm",
              isClosable: true,
              position: "top-right",
            });
          }}
        >
          Load Image
        </Button>
      </VStack>
    </>
  );
};

export default SingleModeMenu;
