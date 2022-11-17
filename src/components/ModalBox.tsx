import { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean,
  onClose: () => void;
  children?: ReactNode;
};

function ModalBox({ children, isOpen, onClose }: Props) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent maxH="500px" maxW="500px">
            <ModalCloseButton />
            <ModalBody py={10} overflowY={'scroll'}>
              {children}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default ModalBox;
