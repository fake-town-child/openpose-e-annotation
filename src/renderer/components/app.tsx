import { FC } from "react";
import MainCanvas from "./MainCanvas";
import { Box, ChakraProvider } from "@chakra-ui/react";
import Sidebar from "./SideBar";

const App: FC = () => {
  return (
    <ChakraProvider resetCSS>
      <Box className="app-container" bgColor={"gray.50"}>
        <Sidebar />
        <main id="stage-parent">
          <MainCanvas />
        </main>
      </Box>
    </ChakraProvider>
  );
};

export default App;
