import { ReactNode, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

type ModalProps = {
  isOpen: boolean,
  onClose: () => void;
  children?: ReactNode;
};

const ModalBox = ({ children, isOpen, onClose }: ModalProps) => {
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
