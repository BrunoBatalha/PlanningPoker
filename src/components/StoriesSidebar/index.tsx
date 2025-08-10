import { AddIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Badge,
    Box,
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    Tooltip,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

interface StoryPending {
  key: string;
  name: string;
}

interface StoryScored {
  key: string;
  name: string;
  average: string;
}

interface StoriesSidebarProps {
  pendingStories: StoryPending[];
  scoredStories: StoryScored[];
  storyInput: string;
  onStoryInputChange: (value: string) => void;
  onAddStory: (name: string) => void;
  onSelectPendingStory: (story: StoryPending) => void;
  onUpdateStoryScore: (storyKey: string, newAverage: string) => void;
  currentStory: { name: string } | null;
}

export function StoriesSidebar({
  pendingStories,
  scoredStories,
  storyInput,
  onStoryInputChange,
  onAddStory,
  onSelectPendingStory,
  onUpdateStoryScore,
  currentStory,
}: StoriesSidebarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isEditModalOpen, 
    onOpen: onEditModalOpen, 
    onClose: onEditModalClose 
  } = useDisclosure();
  
  const [editingStory, setEditingStory] = useState<StoryScored | null>(null);
  const [newScore, setNewScore] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleAddStory = () => {
    const name = storyInput.trim();
    if (!name) return;
    onAddStory(name);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddStory();
    }
  };

  const handleEditScore = (story: StoryScored) => {
    setEditingStory(story);
    setNewScore(story.average);
    onEditModalOpen();
  };

  const handleConfirmEdit = () => {
    if (editingStory && newScore.trim()) {
      onUpdateStoryScore(editingStory.key, newScore.trim());
      onEditModalClose();
      setEditingStory(null);
      setNewScore("");
    }
  };

  const handleCancelEdit = () => {
    onEditModalClose();
    setEditingStory(null);
    setNewScore("");
  };

  const pendingCount = pendingStories.length;
  const scoredCount = scoredStories.length;

  return (
    <>
      {/* Floating Hamburger Button */}
      <Box position="fixed" top="4" right="4" zIndex="1000">
        <Tooltip label="Gerenciar estórias" placement="left">
          <IconButton
            aria-label="Abrir menu de estórias"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            colorScheme="purple"
            variant="solid"
            size="lg"
            borderRadius="full"
            boxShadow="lg"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "xl",
            }}
            transition="all 0.2s"
          />
        </Tooltip>
        
        {/* Badge with story count */}
        {(pendingCount > 0 || scoredCount > 0) && (
          <Badge
            position="absolute"
            top="-2"
            right="-2"
            colorScheme="red"
            borderRadius="full"
            fontSize="xs"
            minW="20px"
            h="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {pendingCount + scoredCount}
          </Badge>
        )}
      </Box>

      {/* Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" pb="4">
            <Flex align="center" gap="2">
              <Text fontSize="lg" fontWeight="bold">
                📖 Estórias
              </Text>
            </Flex>
            {currentStory && (
              <Text fontSize="sm" color="gray.600" mt="2">
                Atual: <Badge colorScheme="blue">{currentStory.name}</Badge>
              </Text>
            )}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing="6" align="stretch">
              {/* Add New Story Section */}
              <Box>
                <Text fontSize="md" fontWeight="semibold" mb="3">
                  ➕ Nova Estória
                </Text>
                <InputGroup>
                  <Input
                    placeholder="Digite o nome da estória..."
                    value={storyInput}
                    onChange={(e) => onStoryInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    size="md"
                    focusBorderColor="purple.500"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Adicionar estória"
                      icon={<AddIcon />}
                      onClick={handleAddStory}
                      size="sm"
                      colorScheme="purple"
                      variant="ghost"
                      isDisabled={!storyInput.trim()}
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>

              <Divider />

              {/* Pending Stories Section */}
              <Box>
                <Flex justify="space-between" align="center" mb="3">
                  <Text fontSize="md" fontWeight="semibold">
                    ⏳ A Pontuar
                  </Text>
                  <Badge colorScheme="orange" variant="subtle">
                    {pendingCount}
                  </Badge>
                </Flex>

                <VStack align="stretch" spacing="2" maxH="200px" overflowY="auto">
                  {pendingCount === 0 ? (
                    <Box
                      p="4"
                      borderRadius="md"
                      bg="gray.50"
                      textAlign="center"
                      border="2px dashed"
                      borderColor="gray.200"
                    >
                      <Text fontSize="sm" color="gray.500">
                        Nenhuma estória pendente
                      </Text>
                    </Box>
                  ) : (
                    pendingStories.map((story) => {
                      const isCurrentStory = currentStory?.name === story.name;
                      return (
                        <Box
                          key={story.key}
                          p="3"
                          borderRadius="md"
                          borderWidth="2px"
                          borderColor={isCurrentStory ? "blue.400" : "gray.200"}
                          bg={isCurrentStory ? "blue.50" : "white"}
                          position="relative"
                          _hover={{
                            borderColor: isCurrentStory ? "blue.500" : "purple.300",
                            bg: isCurrentStory ? "blue.100" : "purple.50",
                            transform: "translateY(-1px)",
                            boxShadow: "sm",
                          }}
                          transition="all 0.2s"
                        >
                          {isCurrentStory && (
                            <Badge
                              position="absolute"
                              top="-2"
                              left="-2"
                              colorScheme="blue"
                              variant="solid"
                              fontSize="xs"
                              borderRadius="full"
                            >
                              Atual
                            </Badge>
                          )}
                          <Flex justify="space-between" align="center">
                            <Text
                              fontSize="sm"
                              fontWeight={isCurrentStory ? "bold" : "medium"}
                              noOfLines={2}
                              flex="1"
                              mr="2"
                              color={isCurrentStory ? "blue.700" : "gray.700"}
                            >
                              {story.name}
                            </Text>
                            <Button
                              size="sm"
                              colorScheme={isCurrentStory ? "blue" : "purple"}
                              variant={isCurrentStory ? "solid" : "outline"}
                              onClick={() => onSelectPendingStory(story)}
                              minW="fit-content"
                              isDisabled={isCurrentStory}
                            >
                              {isCurrentStory ? "Selecionada" : "Selecionar"}
                            </Button>
                          </Flex>
                        </Box>
                      );
                    })
                  )}
                </VStack>
              </Box>

              <Divider />

              {/* Scored Stories Section */}
              <Box>
                <Flex justify="space-between" align="center" mb="3">
                  <Text fontSize="md" fontWeight="semibold">
                    ✅ Pontuadas
                  </Text>
                  <Badge colorScheme="green" variant="subtle">
                    {scoredCount}
                  </Badge>
                </Flex>

                <VStack align="stretch" spacing="2" maxH="200px" overflowY="auto">
                  {scoredCount === 0 ? (
                    <Box
                      p="4"
                      borderRadius="md"
                      bg="gray.50"
                      textAlign="center"
                      border="2px dashed"
                      borderColor="gray.200"
                    >
                      <Text fontSize="sm" color="gray.500">
                        Nenhuma estória pontuada ainda
                      </Text>
                    </Box>
                  ) : (
                    scoredStories.map((story) => (
                      <Box
                        key={story.key}
                        p="3"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="green.200"
                        bg="green.50"
                        transition="all 0.2s"
                        _hover={{
                          borderColor: "green.300",
                          bg: "green.100",
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            noOfLines={2}
                            flex="1"
                            mr="2"
                          >
                            {story.name}
                          </Text>
                          <Flex align="center" gap="2">
                            <Badge
                              colorScheme="purple"
                              variant="solid"
                              fontSize="xs"
                              px="2"
                              py="1"
                            >
                              {story.average}
                            </Badge>
                            <Tooltip label="Editar pontuação" placement="top">
                              <IconButton
                                aria-label="Editar pontuação"
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleEditScore(story)}
                                _hover={{
                                  bg: "blue.100",
                                  transform: "scale(1.1)",
                                }}
                              />
                            </Tooltip>
                          </Flex>
                        </Flex>
                      </Box>
                    ))
                  )}
                </VStack>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Edit Score Modal */}
      <AlertDialog
        isOpen={isEditModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelEdit}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              ✏️ Editar Pontuação
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text mb="3">
                Editando pontuação da estória:{" "}
                <Text as="span" fontWeight="bold" color="blue.600">
                  {editingStory?.name}
                </Text>
              </Text>
              
              <Text mb="2" fontSize="sm" color="gray.600">
                Pontuação atual: {" "}
                <Badge colorScheme="purple" fontSize="sm">
                  {editingStory?.average}
                </Badge>
              </Text>

              <Input
                placeholder="Digite a nova pontuação..."
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                focusBorderColor="purple.500"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmEdit();
                  }
                }}
              />
              
              <Text fontSize="xs" color="gray.500" mt="2">
                💡 Dica: Use números decimais (ex: 3.5) ou símbolos especiais (ex: ?, ☕)
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button 
                colorScheme="purple" 
                onClick={handleConfirmEdit} 
                ml={3}
                isDisabled={!newScore.trim() || newScore.trim() === editingStory?.average}
              >
                Salvar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
