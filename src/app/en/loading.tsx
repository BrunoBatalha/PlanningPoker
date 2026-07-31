import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export default function EnglishLoading() {
  return (
    <Center minH="100dvh" bg="canvas.950">
      <VStack spacing={4}>
        <Spinner size="xl" thickness="3px" color="brand.300" />
        <Text color="ink.300">Loading...</Text>
      </VStack>
    </Center>
  );
}
