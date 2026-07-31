import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Center minH="100dvh" bg="canvas.950">
      <VStack spacing={4}>
        <Spinner size="xl" thickness="3px" color="brand.300" />
        <Text color="ink.300">Carregando...</Text>
      </VStack>
    </Center>
  );
}
