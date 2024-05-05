import { Card, CardBody, CardProps, Heading } from "@chakra-ui/react";
import { HTMLMotionProps, motion } from "framer-motion";

export function CardPoint({ point, cardProps, headingSize }: { headingSize: string, point: string, cardProps?: CardProps & HTMLMotionProps<'div'> }) {
    return (
        <Card
            borderColor='purple'
            borderWidth='3px'
            borderStyle='solid'
            as={motion.div}
            variants={{
                hidden: {
                    y: 20,
                    opacity: 0
                },
                visible: {
                    y: 0,
                    opacity: 1,
                },
            }}
            {...cardProps}
        >
            <CardBody>
                <Heading size={headingSize} textAlign='center'>{point}</Heading>
            </CardBody>
        </Card>
    )
}
