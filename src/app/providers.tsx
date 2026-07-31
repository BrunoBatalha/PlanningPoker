'use client'

import { ChakraProviderTheme } from '@/chakraUi/chakraProvider'
import { LanguageProvider } from '@/i18n'

export function Providers({ children }: { children: React.ReactNode }) {
    return <ChakraProviderTheme><LanguageProvider>{children}</LanguageProvider></ChakraProviderTheme>
}
