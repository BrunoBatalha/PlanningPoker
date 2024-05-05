import { Box, Tag, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CardPoint } from "../CardPoint";

export function CardOtherPlayer({ point, username, showPoint }: { point: string | null, username: string, showPoint: boolean }) {
    return (
        <Box maxW='fit-content'>
            <VStack>
                <Box position='relative' >
                    {point && showPoint && <CardPoint
                        headingSize='md'
                        point={point}
                        cardProps={{ as: motion.div }}
                    />}
                </Box>
                {!showPoint && point && <Tag size='lg' colorScheme="green" variant='solid'>Pronto!</Tag>}
                {showPoint && !point && <Tag size='lg' colorScheme="yellow" variant='solid'>Não votou</Tag>}
                {!showPoint && !point && <Tag size='lg'>Pensando...</Tag>}
                <Text>{username}</Text>
            </VStack>
        </Box>
    )
}