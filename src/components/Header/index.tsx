'use client'

import {
  Box,
  Button,
  Container,
  HStack,
  Icon,
  Link as ChakraLink,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiLayers } from "react-icons/fi";

interface HeaderProps {
  showFullLogo?: boolean;
}

export default function Header({ showFullLogo = false }: HeaderProps) {
  return (
    <Box
      as="header"
      position="relative"
      zIndex={10}
      py={4}
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      bg="canvas.900"
      sx={{
        "@supports (backdrop-filter: blur(1px))": {
          background: "rgba(8, 13, 29, 0.66)",
          backdropFilter: "blur(18px)",
        },
      }}
    >
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <HStack spacing={4}>
          <ChakraLink
            as={Link}
            href="/"
            display="flex"
            alignItems="center"
            gap={3}
            _hover={{ textDecoration: "none" }}
            aria-label="Battle Poker — página inicial"
          >
            <Box
              display="grid"
              placeItems="center"
              boxSize={10}
              borderRadius="xl"
              bgGradient="linear(to-br, brand.400, violet.500)"
              boxShadow="glowBrand"
            >
              <Icon as={FiLayers} boxSize={5} color="white" />
            </Box>
            <Box>
              <Text
                color="white"
                fontWeight="900"
                letterSpacing="-0.035em"
                lineHeight="1"
              >
                Battle Poker
              </Text>
              {showFullLogo ? (
                <Text color="ink.400" fontSize="xs" mt={1}>
                  Planning Poker para times ágeis
                </Text>
              ) : null}
            </Box>
          </ChakraLink>

          <Spacer />

          <HStack
            as="nav"
            aria-label="Navegação principal"
            spacing={1}
            display={{ base: "none", md: "flex" }}
          >
            <Button
              as={Link}
              href="/o-que-e-planning-poker"
              variant="subtle"
              size="sm"
            >
              Guia
            </Button>
            <Button as={Link} href="/faq" variant="subtle" size="sm">
              FAQ
            </Button>
          </HStack>
          <Button as={Link} href="/" variant="glass" size="sm">
            Criar sala
          </Button>
        </HStack>
      </Container>
    </Box>
  );
}
