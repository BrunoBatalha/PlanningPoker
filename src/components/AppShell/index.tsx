import { Box, type BoxProps } from "@chakra-ui/react";

export function AppShell({ children, ...props }: BoxProps) {
  return (
    <Box
      minH="100dvh"
      position="relative"
      isolation="isolate"
      overflowX="hidden"
      bg="canvas.950"
      _before={{
        content: '""',
        position: "fixed",
        zIndex: -2,
        inset: 0,
        bg:
          "radial-gradient(circle at 12% 8%, rgba(69, 97, 255, 0.18), transparent 30%), radial-gradient(circle at 84% 18%, rgba(139, 75, 255, 0.17), transparent 32%), radial-gradient(circle at 58% 92%, rgba(45, 212, 191, 0.1), transparent 30%), linear-gradient(145deg, #050816 0%, #080D1D 48%, #0B1024 100%)",
      }}
      _after={{
        content: '""',
        position: "fixed",
        zIndex: -1,
        inset: 0,
        opacity: 0.2,
        pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent 72%)",
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
