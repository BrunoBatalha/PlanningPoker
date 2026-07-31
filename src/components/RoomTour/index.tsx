"use client";

import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import {
  ACTIONS,
  STATUS,
  type EventHandler,
  type Step,
  useJoyride,
} from "react-joyride";
import { FiHelpCircle, FiMessageSquare, FiPlayCircle } from "react-icons/fi";

import { openSuggestionDialog } from "@/components/SuggestionButton";
import { useTranslations } from "@/i18n";

import {
  hasSeenTour,
  markTourSeen,
  TOUR_VERSIONS,
} from "@/services/TourService";

function getRoomTourSteps(
  t: ReturnType<typeof useTranslations>,
): Step[] {
  const targets = [
    ['[data-tour="room-header"]', "bottom"],
    ['[data-tour="room-participants"]', "right"],
    ['[data-tour="room-round-title"]', "bottom"],
    ['[data-tour="room-round-actions"]', "bottom"],
    ['[data-tour="room-round-results"]', "top"],
    ['[data-tour="room-voting-cards"]', "top"],
    ['[data-tour="room-history"]', "top"],
  ] as const;

  return targets.map(([target, placement], index) => ({
    target,
    placement,
    title: t(`steps.${index + 1}.title`),
    content: t(`steps.${index + 1}.content`),
  }));
}

const ROOM_TOUR_VERSION = TOUR_VERSIONS.room;

export function RoomTour() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const helpT = useTranslations("roomHelp");
  const tourT = useTranslations("roomTour");

  const handleTourEvent = useCallback<EventHandler>((data, controls) => {
    const hasFinished =
      data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED;
    const hasClosed = data.action === ACTIONS.CLOSE;

    if (!hasFinished && !hasClosed) {
      return;
    }

    markTourSeen("room", ROOM_TOUR_VERSION);

    if (hasClosed) {
      controls.stop();
    }
  }, []);

  const { controls, Tour } = useJoyride({
    continuous: true,
    onEvent: handleTourEvent,
    options: {
      arrowColor: "#111931",
      backgroundColor: "#111931",
      blockTargetInteraction: true,
      buttons: ["back", "skip", "primary", "close"],
      closeButtonAction: "skip",
      dismissKeyAction: "close",
      overlayClickAction: false,
      overlayColor: "rgba(2, 6, 23, 0.82)",
      primaryColor: "#7C5CFF",
      scrollDuration: prefersReducedMotion ? 0 : 320,
      scrollOffset: 24,
      showProgress: true,
      skipBeacon: true,
      spotlightPadding: 8,
      spotlightRadius: 16,
      targetWaitTimeout: 1500,
      textColor: "#E8ECF8",
      width: "min(380px, calc(100vw - 32px))",
      zIndex: 1600,
    },
    locale: {
      back: tourT("tour.back"),
      close: tourT("tour.close"),
      last: tourT("tour.last"),
      next: tourT("tour.next"),
      nextWithProgress: tourT("tour.nextWithProgress"),
      open: tourT("tour.open"),
      skip: tourT("tour.skip"),
    },
    scrollToFirstStep: true,
    steps: getRoomTourSteps(tourT),
    styles: {
      buttonBack: {
        color: "#B8C0D9",
        fontWeight: 700,
      },
      buttonClose: {
        color: "#B8C0D9",
      },
      buttonPrimary: {
        borderRadius: 12,
        color: "#FFFFFF",
        fontWeight: 700,
        padding: "10px 16px",
      },
      buttonSkip: {
        color: "#B8C0D9",
        fontWeight: 700,
      },
      tooltip: {
        border: "1px solid rgba(255, 255, 255, 0.14)",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
      },
      tooltipContent: {
        lineHeight: 1.6,
      },
      tooltipTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: 800,
      },
    },
  });

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (!hasSeenTour("room", ROOM_TOUR_VERSION)) {
        controls.start(0);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [controls]);

  return (
    <>
      {Tour}
      <Menu placement="top-end">
        <MenuButton
          as={Button}
          aria-label={helpT("label")}
          leftIcon={<Icon as={FiHelpCircle} boxSize={5} />}
          position="fixed"
          right={{ base: 4, md: 6 }}
          bottom={{
            base: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
            md: 6,
          }}
          minH={12}
          borderRadius="xl"
          color="white"
          bgGradient="linear(to-br, brand.400, violet.500)"
          boxShadow="0 14px 34px rgba(20, 12, 70, 0.46)"
          zIndex={20}
          _hover={{
            bgGradient: "linear(to-br, brand.300, violet.400)",
            transform: "translateY(-2px)",
          }}
          _active={{ transform: "translateY(0)" }}
        >
          {helpT("label")}
        </MenuButton>
        <MenuList
          bg="canvas.800"
          borderColor="whiteAlpha.200"
          zIndex="dropdown"
        >
          <MenuItem
            icon={<Icon as={FiPlayCircle} />}
            bg="transparent"
            onClick={() => controls.start(0)}
          >
            {helpT("tutorial")}
          </MenuItem>
          <MenuItem
            icon={<Icon as={FiMessageSquare} />}
            bg="transparent"
            onClick={openSuggestionDialog}
          >
            {helpT("suggestion")}
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
