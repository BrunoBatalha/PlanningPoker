import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

export function EffectDisable({ isVisible }: { isVisible: boolean }) {
    return (
        <Box
            as={motion.div}
            variants={{
                hidden: {
                    width: 0
                },
                show: {
                    width: '100%',
                },
            }}
            initial='hidden'
            animate={isVisible ? 'show' : 'hidden'}
            pos='absolute'
            top={0}
            left={0}
            h='full'
            bgColor='purple.50'
            opacity='.8'
            zIndex='10'
            _hover={{ cursor: 'not-allowed' }}
        />
    )
}
