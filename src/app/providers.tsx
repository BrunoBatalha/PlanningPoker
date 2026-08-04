'use client'

import { ChakraProviderTheme } from '@/chakraUi/chakraProvider'
import { SuggestionButton } from '@/components/SuggestionButton'
import { LanguageProvider } from '@/i18n'
import type { Locale } from '@/generated/locale-catalogs'
import type { LocaleCatalog } from '@/lib/locale-types'

export function Providers({ children, locale, catalog }: { children: React.ReactNode; locale: Locale; catalog: LocaleCatalog }) {
    return (
        <ChakraProviderTheme>
            <LanguageProvider locale={locale} catalog={catalog}>
                {children}
                <SuggestionButton />
            </LanguageProvider>
        </ChakraProviderTheme>
    )
}
