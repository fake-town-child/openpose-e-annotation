import { Box, Divider, Text } from "@chakra-ui/react";
import { FC } from "react";
import ImageFileLoad from "./ImageFileLoad";
import SaveFileLoad from "./SaveFileLoad";

const SingleModeMenu: FC = () => {
  return (
    <>
      <Divider />
      <Box>
        <Text fontSize="sm">
          Note: If you load image or savefile, current state can be destroied
        </Text>
      </Box>
      <ImageFileLoad />
      <SaveFileLoad />
      <Divider />
    </>
  );
};

export default SingleModeMenu;
