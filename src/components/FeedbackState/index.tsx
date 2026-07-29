import {
  Box,
  Button,
  Heading,
  Icon,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiAlertTriangle, FiInbox } from "react-icons/fi";

import { GlassPanel } from "@/components/GlassPanel";

interface FeedbackStateProps {
  title: string;
  description: string;
  status?: "loading" | "error" | "empty";
  actionHref?: string;
  actionLabel?: string;
}

export function FeedbackState({
  title,
  description,
  status = "empty",
  actionHref,
  actionLabel,
}: FeedbackStateProps) {
  const accent = status === "error" ? "signal.red" : "brand.300";

  return (
    <GlassPanel
      w="full"
      maxW="lg"
      mx="auto"
      p={{ base: 7, md: 10 }}
      textAlign="center"
      role={status === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <VStack spacing={5}>
        {status === "loading" ? (
          <Spinner
            thickness="3px"
            speed="0.75s"
            color="brand.300"
            size="xl"
          />
        ) : (
          <Box
            display="grid"
            placeItems="center"
            w={14}
            h={14}
            borderRadius="2xl"
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Icon
              as={status === "error" ? FiAlertTriangle : FiInbox}
              boxSize={6}
              color={accent}
            />
          </Box>
        )}
        <VStack spacing={2}>
          <Heading as="h1" textStyle="h2">
            {title}
          </Heading>
          <Text color="ink.300" maxW="sm" textStyle="body">
            {description}
          </Text>
        </VStack>
        {actionHref && actionLabel ? (
          <Button as={Link} href={actionHref} variant="premium">
            {actionLabel}
          </Button>
        ) : null}
      </VStack>
    </GlassPanel>
  );
}
