import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    fonts: {
        heading: 'var(--font-roboto)',
        body: 'var(--font-roboto)',
    },
    components: {
        Heading: {
            baseStyle: {
                color: 'gray.600'
            }
        },      
        Button: {
            defaultProps:{
                colorScheme: 'purple'
            }
        }
    }
});