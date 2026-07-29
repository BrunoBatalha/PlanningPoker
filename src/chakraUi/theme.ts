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
    fontWeight: "700",
    letterSpacing: "-0.01em",
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
      color: "ink.50",
      bg: "rgba(17, 25, 49, 0.88)",
      border: "1px solid",
      borderColor: "whiteAlpha.200",
      borderRadius: "2xl",
      fontSize: { base: "xl", md: "2xl" },
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
        bg: "rgba(8, 13, 30, 0.62)",
        border: "1px solid",
        borderColor: "whiteAlpha.200",
        borderRadius: "xl",
        color: "white",
        _placeholder: {
          color: "whiteAlpha.500",
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
      fontWeight: "800",
    },
  },
};

const Tag: ComponentStyleConfig = {
  baseStyle: {
    container: {
      borderRadius: "full",
      fontWeight: "700",
    },
  },
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: '"Manrope Variable", ui-sans-serif, system-ui, sans-serif',
    body: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
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
    eyebrow: {
      color: "brand.200",
      fontSize: "xs",
      fontWeight: "800",
      letterSpacing: "0.16em",
      textTransform: "uppercase",
    },
  },
  components: {
    Button,
    Card,
    Heading: {
      baseStyle: {
        color: "ink.50",
        letterSpacing: "-0.035em",
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
