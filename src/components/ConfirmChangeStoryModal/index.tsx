import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Badge,
    Button,
    Text,
} from "@chakra-ui/react";
import { useRef } from "react";

interface ConfirmChangeStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStoryName: string;
  newStoryName: string;
  currentAverage: string;
}

export function ConfirmChangeStoryModal({
  isOpen,
  onClose,
  onConfirm,
  currentStoryName,
  newStoryName,
  currentAverage,
}: ConfirmChangeStoryModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            ⚠️ Confirmar troca de estória
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text mb="3">
              Você está prestes a trocar de estória com as cartas reveladas.
            </Text>
            
            <Text mb="2">
              <strong>Estória atual:</strong>{" "}
              <Badge colorScheme="blue" fontSize="sm">
                {currentStoryName}
              </Badge>
            </Text>
            
            <Text mb="2">
              <strong>Pontuação atual:</strong>{" "}
              <Badge colorScheme="purple" fontSize="sm">
                {currentAverage}
              </Badge>
            </Text>
            
            <Text mb="3">
              <strong>Nova estória:</strong>{" "}
              <Badge colorScheme="green" fontSize="sm">
                {newStoryName}
              </Badge>
            </Text>

            <Text fontSize="sm" color="gray.600" bg="yellow.50" p="3" borderRadius="md" borderLeft="4px solid" borderColor="yellow.400">
              <strong>⚠️ Ao confirmar:</strong>
              <br />
              • A pontuação atual será salva automaticamente
              <br />
              • Uma nova rodada será iniciada
              <br />
              • Todos os votos serão zerados
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="purple" onClick={onConfirm} ml={3}>
              Confirmar troca
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
