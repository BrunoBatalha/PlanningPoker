import type { ComponentStyleConfig, ThemeConfig } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const focusRing = {
  outline: "2px solid",
  outlineColor: "brand.300",
  outlineOffset: "3px",
  boxShadow: "0 0 0 4px rgba(124, 92, 255, 0.2)",
};

const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "xl",
    textStyle: "button",
    transitionProperty:
      "background-color, border-color, color, box-shadow, transform",
    transitionDuration: "180ms",
    _focusVisible: focusRing,
    _active: {
      transform: "translateY(1px)",
    },
  },
  sizes: {
    lg: {
      h: 12,
      px: 6,
      fontSize: "md",
    },
  },
  variants: {
    premium: {
      color: "white",
      bgGradient: "linear(to-r, brand.500, violet.500)",
      boxShadow: "0 14px 32px rgba(96, 74, 255, 0.28)",
      _hover: {
        bgGradient: "linear(to-r, brand.400, violet.400)",
        boxShadow: "0 18px 38px rgba(96, 74, 255, 0.36)",
        transform: "translateY(-2px)",
        _disabled: {
          transform: "none",
          boxShadow: "none",
        },
      },
    },
    glass: {
      color: "ink.50",
      bg: "whiteAlpha.100",
      border: "1px solid",
      borderColor: "whiteAlpha.200",
      _hover: {
        bg: "whiteAlpha.200",
        borderColor: "whiteAlpha.300",
        transform: "translateY(-1px)",
      },
    },
    subtle: {
      color: "ink.100",
      bg: "whiteAlpha.50",
      _hover: {
        bg: "whiteAlpha.100",
        color: "white",
      },
    },
    votingCard: {
      minW: 14,
      h: { base: 20, md: 24 },
      px: 0,
      textStyle: "code-card",
      color: "ink.50",
      bg: "rgba(17, 25, 49, 0.88)",
      border: "1px solid",
      borderColor: "whiteAlpha.200",
      borderRadius: "2xl",
      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      _hover: {
        borderColor: "brand.300",
        bg: "rgba(31, 42, 78, 0.94)",
        boxShadow:
          "0 0 0 1px rgba(139, 116, 255, 0.24), 0 14px 34px rgba(20, 12, 70, 0.32)",
      },
      _active: {
        transform: "translateY(1px)",
      },
      _disabled: {
        opacity: 0.52,
        cursor: "not-allowed",
        transform: "none",
      },
    },
  },
  defaultProps: {
    colorScheme: "purple",
  },
};

const Input: ComponentStyleConfig = {
  variants: {
    glass: {
      field: {
        h: 12,
        textStyle: "body",
        bg: "rgba(8, 13, 30, 0.62)",
        border: "1px solid",
        borderColor: "whiteAlpha.200",
        borderRadius: "xl",
        color: "white",
        _placeholder: {
          color: "ink.300",
        },
        _hover: {
          borderColor: "whiteAlpha.300",
        },
        _focusVisible: {
          borderColor: "brand.300",
          boxShadow: "0 0 0 3px rgba(124, 92, 255, 0.2)",
        },
      },
    },
  },
  defaultProps: {
    variant: "glass",
  },
};

const Card: ComponentStyleConfig = {
  parts: ["container", "header", "body", "footer"],
  baseStyle: {
    container: {
      color: "ink.100",
      borderRadius: "2xl",
    },
  },
  variants: {
    glass: {
      container: {
        bg: "canvas.800",
        border: "1px solid",
        borderColor: "whiteAlpha.200",
        boxShadow: "glass",
        "@supports (backdrop-filter: blur(1px))": {
          bg: "rgba(15, 23, 48, 0.7)",
          backdropFilter: "blur(18px)",
        },
      },
    },
  },
  defaultProps: {
    variant: "glass",
  },
};

const Modal: ComponentStyleConfig = {
  baseStyle: {
    overlay: {
      bg: "rgba(2, 6, 23, 0.78)",
      backdropFilter: "blur(8px)",
    },
    dialog: {
      color: "ink.100",
      bg: "canvas.800",
      border: "1px solid",
      borderColor: "whiteAlpha.200",
      borderRadius: "3xl",
      boxShadow: "glassStrong",
      "@supports (backdrop-filter: blur(1px))": {
        bg: "rgba(13, 20, 43, 0.86)",
        backdropFilter: "blur(22px)",
      },
    },
    header: {
      color: "white",
      textStyle: "h4",
    },
  },
};

const Tag: ComponentStyleConfig = {
  baseStyle: {
    container: {
      borderRadius: "full",
      textStyle: "caption",
      fontWeight: "700",
    },
  },
};

const Badge: ComponentStyleConfig = {
  baseStyle: {
    textStyle: "caption",
    fontWeight: "700",
    letterSpacing: "0.04em",
  },
};

const FormLabel: ComponentStyleConfig = {
  baseStyle: {
    textStyle: "label",
  },
};

const Accordion: ComponentStyleConfig = {
  baseStyle: {
    button: {
      _focusVisible: focusRing,
    },
  },
};

const CloseButton: ComponentStyleConfig = {
  baseStyle: {
    _focusVisible: focusRing,
  },
};

export const theme = extendTheme({
  config,
  fonts: {
    heading:
      '"Manrope Variable", "Inter Variable", ui-sans-serif, system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    body:
      '"Inter Variable", ui-sans-serif, system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  },
  colors: {
    canvas: {
      950: "#050816",
      900: "#080D1D",
      850: "#0C1329",
      800: "#101A35",
      700: "#172342",
    },
    ink: {
      50: "#F8FAFF",
      100: "#E9EDFA",
      200: "#C8D0E5",
      300: "#A3AEC8",
      400: "#7E8AA8",
    },
    brand: {
      50: "#F0EDFF",
      100: "#DDD6FF",
      200: "#C2B5FF",
      300: "#A38DFF",
      400: "#886BFF",
      500: "#7048F5",
      600: "#5E35D9",
      700: "#4C2AAF",
      800: "#3C2388",
      900: "#301E69",
    },
    violet: {
      400: "#AA66FF",
      500: "#9347F5",
      600: "#7732D2",
    },
    signal: {
      blue: "#60A5FA",
      indigo: "#9B8AFB",
      cyan: "#4DE3E3",
      green: "#4ADE80",
      red: "#FB7185",
      amber: "#FBBF24",
    },
  },
  radii: {
    "2xl": "1.25rem",
    "3xl": "1.75rem",
  },
  shadows: {
    glass:
      "0 18px 60px rgba(2, 6, 23, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    glassStrong:
      "0 28px 90px rgba(2, 6, 23, 0.52), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
    glowBrand: "0 0 42px rgba(124, 92, 255, 0.3)",
    glowCyan: "0 0 42px rgba(77, 227, 227, 0.22)",
  },
  styles: {
    global: {
      "html, body": {
        minH: "100%",
        bg: "canvas.950",
      },
      html: {
        colorScheme: "dark",
        scrollBehavior: "smooth",
      },
      body: {
        color: "ink.100",
        fontFamily: "body",
        fontSize: "md",
        lineHeight: "1.6",
        overflowX: "hidden",
      },
      "::selection": {
        bg: "brand.500",
        color: "white",
      },
      "*": {
        borderColor: "whiteAlpha.200",
      },
    },
  },
  textStyles: {
    display: {
      fontFamily: "heading",
      fontSize: { base: "2.5rem", md: "4rem", xl: "4.5rem" },
      fontWeight: "700",
      lineHeight: { base: "1.05", md: "1.02" },
      letterSpacing: "-0.035em",
    },
    h1: {
      fontFamily: "heading",
      fontSize: { base: "2rem", md: "3rem" },
      fontWeight: "700",
      lineHeight: { base: "1.15", md: "1.1" },
      letterSpacing: "-0.025em",
    },
    h2: {
      fontFamily: "heading",
      fontSize: { base: "1.75rem", md: "2.25rem" },
      fontWeight: "700",
      lineHeight: { base: "1.2", md: "1.15" },
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: "heading",
      fontSize: { base: "1.375rem", md: "1.5rem" },
      fontWeight: "700",
      lineHeight: "1.25",
      letterSpacing: "-0.015em",
    },
    h4: {
      fontFamily: "heading",
      fontSize: { base: "1.125rem", md: "1.25rem" },
      fontWeight: "700",
      lineHeight: { base: "1.35", md: "1.3" },
      letterSpacing: "-0.01em",
    },
    "body-lg": {
      fontFamily: "body",
      fontSize: { base: "1.125rem", md: "1.25rem" },
      fontWeight: "400",
      lineHeight: { base: "1.65", md: "1.6" },
      letterSpacing: "normal",
    },
    body: {
      fontFamily: "body",
      fontSize: "1rem",
      fontWeight: "400",
      lineHeight: "1.6",
      letterSpacing: "normal",
    },
    "body-sm": {
      fontFamily: "body",
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.55",
      letterSpacing: "normal",
    },
    caption: {
      fontFamily: "body",
      fontSize: "0.75rem",
      fontWeight: "500",
      lineHeight: "1.45",
      letterSpacing: "0.01em",
    },
    button: {
      fontFamily: "body",
      fontSize: "1rem",
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.01em",
      textTransform: "none",
    },
    label: {
      fontFamily: "body",
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.4",
      letterSpacing: "normal",
    },
    "code-card": {
      fontFamily: "heading",
      fontSize: { base: "1.5rem", md: "1.75rem" },
      fontWeight: "800",
      lineHeight: "1",
      letterSpacing: "-0.02em",
      fontVariantNumeric: "tabular-nums",
    },
    eyebrow: {
      fontFamily: "body",
      color: "brand.200",
      fontSize: "xs",
      fontWeight: "700",
      lineHeight: "1.4",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    result: {
      fontFamily: "heading",
      fontSize: { base: "3rem", md: "4rem" },
      fontWeight: "800",
      lineHeight: "1",
      letterSpacing: "-0.035em",
      fontVariantNumeric: "tabular-nums",
    },
  },
  components: {
    Accordion,
    Badge,
    Button,
    Card,
    CloseButton,
    FormLabel,
    Heading: {
      baseStyle: {
        color: "ink.50",
        fontFamily: "heading",
        fontWeight: "700",
      },
      sizes: {
        typography: {},
      },
      defaultProps: {
        size: "typography",
      },
    },
    Input,
    Link: {
      baseStyle: {
        borderRadius: "sm",
        _focusVisible: focusRing,
      },
    },
    Modal,
    Tag,
  },
});
