import { CardPoint, EffectDisable } from "@/components";
import { Box, Button, Flex, Wrap, WrapItem } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

interface PointsGridProps {
  points: string[];
  pointSelected: string | null;
  onSelectPoint: (point: string) => void;
  onUndoPoint: () => void;
}

export function PointsGrid({ 
  points, 
  pointSelected, 
  onSelectPoint, 
  onUndoPoint 
}: PointsGridProps) {
  return (
    <Flex flex='1' flexDir='column' w='full' gap='8'>
      <Box textAlign='center'>
        <AnimatePresence>
          {pointSelected && (
            <Box as={motion.div} display='inline-block'>
              <CardPoint
                headingSize='xl'
                point={pointSelected}
              />
              <Button
                as={motion.button}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                initial='hidden'
                animate="visible"
                mt='4'
                variant='link'
                onClick={onUndoPoint}
              >
                Desfazer
              </Button>
            </Box>
          )}
        </AnimatePresence>
      </Box>

      <Flex justifyContent='center'>
        <Box pos='relative'>
          <EffectDisable isVisible={!!pointSelected} />

          <Wrap
            display='inline-block'
            p='8'
            gap='4'
            as={motion.div}
            variants={{
              hidden: {
                opacity: 1,
                scale: 0
              },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { delayChildren: 0.3, staggerChildren: 0.1 }
              }
            }}
            initial='hidden'
            animate="visible"
            bgColor='purple.100'
          >
            {points.map((value) => (
              <WrapItem key={value}>
                <CardPoint
                  headingSize='md'
                  point={value}
                  cardProps={{
                    as: motion.div,
                    onClick: () => onSelectPoint(value),
                    whileHover: { scale: 1.1 },
                    _hover: { cursor: 'pointer' }
                  }}
                />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </Flex>
    </Flex>
  );
}
