import { Box, type BoxProps } from "@chakra-ui/react";

type GlassPanelProps = BoxProps & {
  strength?: "soft" | "regular" | "strong";
};

const backgrounds = {
  soft: {
    fallback: "canvas.850",
    supported: "rgba(12, 19, 41, 0.58)",
    blur: "14px",
  },
  regular: {
    fallback: "canvas.800",
    supported: "rgba(15, 24, 50, 0.72)",
    blur: "18px",
  },
  strong: {
    fallback: "canvas.800",
    supported: "rgba(12, 20, 43, 0.88)",
    blur: "24px",
  },
};

export function GlassPanel({
  children,
  strength = "regular",
  ...props
}: GlassPanelProps) {
  const surface = backgrounds[strength];

  return (
    <Box
      bg={surface.fallback}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="3xl"
      boxShadow={strength === "strong" ? "glassStrong" : "glass"}
      sx={{
        "@supports (backdrop-filter: blur(1px))": {
          background: surface.supported,
          backdropFilter: `blur(${surface.blur})`,
        },
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
