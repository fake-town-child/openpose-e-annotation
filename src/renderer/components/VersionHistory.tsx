import { currentVersion, versionHistory } from "@/shared/version";
import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";

const VersionHistory: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Text fontSize={"x-small"} color="gray.400" onClick={onOpen}>
        v{currentVersion}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Openpose-e-annotation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align={"start"} gap={4}>
              <Heading size="sm">Version History</Heading>
              {versionHistory.reverse().map((version) => (
                <VStack align={"start"} gap={0}>
                  <Heading size="xs">{version.version}</Heading>
                  <Text>
                    {version.description.split("\n").map((c) => (
                      <>
                        {c} <br />
                      </>
                    ))}
                  </Text>
                </VStack>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VersionHistory;
