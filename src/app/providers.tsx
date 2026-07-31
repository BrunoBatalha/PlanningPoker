'use client'

import { ChakraProviderTheme } from '@/chakraUi/chakraProvider'
import { SuggestionButton } from '@/components/SuggestionButton'
import { LanguageProvider } from '@/i18n'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProviderTheme>
            <LanguageProvider>
                {children}
                <SuggestionButton />
            </LanguageProvider>
        </ChakraProviderTheme>
    )
}
