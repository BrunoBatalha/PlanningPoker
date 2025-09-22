'use client'
import { Box, Button, Container, Heading, HStack, Image, Spacer } from "@chakra-ui/react";
import Link from "next/link";

interface HeaderProps {
  showFullLogo?: boolean;
}

export default function Header({ showFullLogo = false }: HeaderProps) {
  return (
    <Box as="header" py={4} borderBottom="1px solid" borderColor="gray.200">
      <Container maxW="6xl">
        <HStack spacing={4}>
          <Link href="/">
            {showFullLogo ? (
              <Image 
                src="/logo-text.png" 
                alt="Planning Poker Online - Logo"
                maxH="60px"
                objectFit="contain"
                fallback={
                  <Heading 
                    as="h1" 
                    size="lg" 
                    fontWeight="bold"
                    bgGradient="linear(to-r, purple.600, blue.600)"
                    bgClip="text"
                  >
                    Planning Poker Online
                  </Heading>
                }
              />
            ) : (
              <HStack spacing={2}>
                <Image 
                  src="/logo.png" 
                  alt="Planning Poker Logo"
                  w={8} 
                  h={8}
                  fallback={<Box w={8} h={8} bg="purple.500" borderRadius="md" />}
                />
                <Heading 
                  as="h1" 
                  size="md" 
                  fontWeight="bold"
                  color="purple.600"
                >
                  Planning Poker
                </Heading>
              </HStack>
            )}
          </Link>
          
          <Spacer />
          
          <HStack spacing={2} display={{ base: "none", md: "flex" }}>
            <Button as={Link} href="/o-que-e-planning-poker" variant="ghost" size="sm">
              Guia
            </Button>
            <Button as={Link} href="/faq" variant="ghost" size="sm">
              FAQ
            </Button>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
