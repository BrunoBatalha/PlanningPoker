'use client'

import { ChakraProviderTheme } from '@/chakraUi/chakraProvider'

export function Providers({ children }: { children: React.ReactNode }) {
    return <ChakraProviderTheme>{children}</ChakraProviderTheme>
}