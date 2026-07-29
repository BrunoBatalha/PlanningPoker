"use client";

import {
  Icon,
  IconButton,
  Tooltip,
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
import { FiHelpCircle } from "react-icons/fi";

import {
  hasSeenTour,
  markTourSeen,
  TOUR_VERSIONS,
} from "@/services/TourService";

const ROOM_TOUR_STEPS: Step[] = [
  {
    target: '[data-tour="room-header"]',
    placement: "bottom",
    title: "Sua sala",
    content:
      "Aqui você vê sua identificação, copia o convite para o time e pode criar outra sala quando precisar.",
  },
  {
    target: '[data-tour="room-participants"]',
    placement: "right",
    title: "Participantes",
    content:
      "Acompanhe quem já votou. As estimativas individuais continuam secretas até as cartas serem reveladas.",
  },
  {
    target: '[data-tour="room-round-title"]',
    placement: "bottom",
    title: "Rodada atual",
    content:
      "Dê um nome para a história ou tarefa que o time está estimando. A alteração é compartilhada com todos na sala.",
  },
  {
    target: '[data-tour="room-round-actions"]',
    placement: "bottom",
    title: "Andamento da rodada",
    content:
      "Veja quantas pessoas votaram e use a ação disponível para revelar as cartas, refazer ou iniciar uma nova rodada.",
  },
  {
    target: '[data-tour="room-round-results"]',
    placement: "top",
    title: "Resultado da estimativa",
    content:
      "Antes da revelação, os votos ficam protegidos. Depois, este espaço apresenta as cartas e a média dos valores numéricos.",
  },
  {
    target: '[data-tour="room-voting-cards"]',
    placement: "top",
    title: "Escolha sua carta",
    content:
      "Selecione uma estimativa. Use “?” quando precisar de mais informações e “☕” quando o time precisar de uma pausa.",
  },
  {
    target: '[data-tour="room-history"]',
    placement: "top",
    title: "Histórico de rodadas",
    content:
      "As rodadas concluídas ficam registradas aqui para o time consultar os resultados anteriores.",
  },
];

const ROOM_TOUR_VERSION = TOUR_VERSIONS.room;

export function RoomTour() {
  const prefersReducedMotion = usePrefersReducedMotion();

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
      back: "Voltar",
      close: "Fechar",
      last: "Concluir",
      next: "Próximo",
      nextWithProgress: "Próximo ({current} de {total})",
      open: "Abrir tutorial",
      skip: "Pular",
    },
    scrollToFirstStep: true,
    steps: ROOM_TOUR_STEPS,
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
      <Tooltip label="Ver tutorial desta tela" placement="left" hasArrow>
        <IconButton
          aria-label="Ver tutorial desta tela"
          icon={<Icon as={FiHelpCircle} boxSize={6} />}
          onClick={() => controls.start(0)}
          position="fixed"
          right={{ base: 4, md: 6 }}
          bottom={{
            base: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
            md: 6,
          }}
          boxSize={12}
          minW={12}
          borderRadius="full"
          color="white"
          bgGradient="linear(to-br, brand.400, violet.500)"
          boxShadow="0 14px 34px rgba(20, 12, 70, 0.46)"
          zIndex={20}
          _hover={{
            bgGradient: "linear(to-br, brand.300, violet.400)",
            transform: "translateY(-2px)",
          }}
          _active={{ transform: "translateY(0)" }}
        />
      </Tooltip>
    </>
  );
}
