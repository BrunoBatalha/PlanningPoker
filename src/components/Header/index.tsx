'use client'

import {
  Box,
  Button,
  Container,
  HStack,
  Icon,
  IconButton,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiLayers, FiMenu } from "react-icons/fi";
import { LanguageSwitcher, type Locale, useLocale, useTranslations } from "@/i18n";
import { getLocalizedHref } from "@/lib/locale-routing";

interface HeaderProps {
  showFullLogo?: boolean;
  localeHrefs?: Partial<Record<Locale, string>>;
}

export default function Header({ showFullLogo = false, localeHrefs }: HeaderProps) {
  const locale = useLocale();
  const t = useTranslations("header");
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
            href={getLocalizedHref(locale, "home")}
            display="flex"
            alignItems="center"
            gap={3}
            _hover={{ textDecoration: "none" }}
            aria-label={t("homeAria")}
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
                fontFamily="heading"
                fontSize="md"
                fontWeight="800"
                letterSpacing="-0.025em"
                lineHeight="1"
              >
                Battle Poker
              </Text>
              {showFullLogo ? (
                <Text
                  color="ink.300"
                  textStyle="caption"
                  mt={1}
                  display={{ base: "none", sm: "block" }}
                  whiteSpace="nowrap"
                >
                  {t("subtitle")}
                </Text>
              ) : null}
            </Box>
          </ChakraLink>

          <Spacer />

          <HStack
            as="nav"
            aria-label={t("navAria")}
            spacing={1}
            display={{ base: "none", md: "flex" }}
          >
            <Button
              as={Link}
              href={getLocalizedHref(locale, "guide")}
              variant="subtle"
              size="sm"
            >
              {t("guide")}
            </Button>
            <Button as={Link} href={getLocalizedHref(locale, "articles")} variant="subtle" size="sm">
              {t("articles")}
            </Button>
            <Button as={Link} href={getLocalizedHref(locale, "faq")} variant="subtle" size="sm">
              {t("faq")}
            </Button>
          </HStack>
          <Menu>
            <MenuButton
              as={IconButton}
              display={{ base: "inline-flex", md: "none" }}
              icon={<FiMenu />}
              aria-label={t("menu")}
              variant="subtle"
              size="sm"
            />
            <Portal>
              <MenuList zIndex="dropdown" bg="canvas.800" borderColor="whiteAlpha.200">
                <MenuItem as={Link} href={getLocalizedHref(locale, "guide")} bg="transparent">
                  {t("guide")}
                </MenuItem>
                <MenuItem as={Link} href={getLocalizedHref(locale, "articles")} bg="transparent">
                  {t("articles")}
                </MenuItem>
                <MenuItem as={Link} href={getLocalizedHref(locale, "faq")} bg="transparent">
                  {t("faq")}
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
          <LanguageSwitcher localeHrefs={localeHrefs} />
          <Button as={Link} href={getLocalizedHref(locale, "home")} variant="glass" size="sm">
            {t("createRoom")}
          </Button>
        </HStack>
      </Container>
    </Box>
  );
}
