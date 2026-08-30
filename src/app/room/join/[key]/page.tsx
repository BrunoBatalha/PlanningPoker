'use client'

import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AppShell,
  FeedbackState,
  GlassPanel,
  UsernameForm,
} from "@/components";
import { roomService } from "@/services/RoomService";
import { userService } from "@/services/UserService";
import { useLocale, useTranslations } from "@/i18n";
import { getLocalizedHref } from "@/lib/locale-routing";

interface ParamsUrl {
  key: string;
}

type JoinPageState = "loading" | "ready" | "not-found" | "error";

export default function Page({ params }: { params: ParamsUrl }) {
  const router = useRouter();
  const toast = useToast();
  const locale = useLocale();
  const t = useTranslations("joinRoom");
  const homeHref = getLocalizedHref(locale, "home");
  const [pageState, setPageState] = useState<JoinPageState>("loading");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function validateRoom() {
      try {
        const exists = await roomService.roomExists(params.key);

        if (isMounted) {
          setPageState(exists ? "ready" : "not-found");
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setPageState("error");
        }
      }
    }

    validateRoom();

    return () => {
      isMounted = false;
    };
  }, [params.key]);

  async function handleSubmit({ username }: { username: string }) {
    setIsJoining(true);

    try {
      const stillExists = await roomService.roomExists(params.key);

      if (!stillExists) {
        setPageState("not-found");
        setIsJoining(false);
        return;
      }

      const userKey = await userService.addUserToRoom(params.key, username);
      userService.setCurrentUser({ key: userKey, username });
      router.replace(`/room/${params.key}`);
    } catch (error) {
      console.error(error);
      toast({
        title: t("joinErrorTitle"),
        description: t("joinErrorDescription"),
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setIsJoining(false);
    }
  }

  return (
    <AppShell display="grid" placeItems="center" py={{ base: 6, md: 12 }}>
      <Container maxW="lg" px={{ base: 4, md: 6 }}>
        {pageState === "loading" ? (
          <FeedbackState
            status="loading"
            title={t("loadingTitle")}
            description={t("loadingDescription")}
          />
        ) : null}

        {pageState === "not-found" ? (
          <FeedbackState
            status="error"
            title={t("notFoundTitle")}
            description={t("notFoundDescription")}
            actionHref={homeHref}
            actionLabel={t("notFoundAction")}
          />
        ) : null}

        {pageState === "error" ? (
          <FeedbackState
            status="error"
            title={t("errorTitle")}
            description={t("errorDescription")}
            actionHref={homeHref}
            actionLabel={t("errorAction")}
          />
        ) : null}

        {pageState === "ready" ? (
          <GlassPanel strength="strong" p={{ base: 6, sm: 8, md: 10 }}>
            <VStack spacing={7} align="stretch">
              <Box>
                <Button
                  as={Link}
                  href={homeHref}
                  leftIcon={<ArrowBackIcon />}
                  variant="ghost"
                  size="sm"
                  color="ink.300"
                  px={0}
                  mb={7}
                >
                  {t("back")}
                </Button>
                <Box
                  display="grid"
                  placeItems="center"
                  boxSize={16}
                  mb={5}
                >
                  <Image
                    src="/logo.png"
                    alt="Battle Poker"
                    width={64}
                    height={64}
                    priority
                  />
                </Box>
                <Text textStyle="eyebrow">{t("eyebrow")}</Text>
                <Heading as="h1" textStyle="h1" mt={2}>
                  {t("title")}
                </Heading>
                <Text color="ink.300" mt={3} textStyle="body">
                  {t("description")}
                </Text>
              </Box>
              <UsernameForm
                onSubmit={handleSubmit}
                isLoading={isJoining}
                submitLabel={t("submit")}
              />
            </VStack>
          </GlassPanel>
        ) : null}
      </Container>
    </AppShell>
  );
}
