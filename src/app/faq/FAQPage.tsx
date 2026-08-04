'use client'

import { AppShell, GlassPanel, Header } from '@/components'
import { useLocale, useLocaleContent, useTranslations } from '@/i18n'
import { getLocalizedHref, getPageAlternates } from '@/lib/locale-routing'
import { CheckCircleIcon, ChevronRightIcon, QuestionIcon } from '@chakra-ui/icons'
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Container,
    Divider,
    Flex,
    Heading,
    Icon,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { FaChartLine, FaClock, FaLightbulb, FaUsers } from 'react-icons/fa'

const categoryColors = {
  basico: 'blue',
  tecnico: 'purple',
  metodologia: 'green',
  pratico: 'orange'
}

const categoryIcons = {
  basico: QuestionIcon,
  tecnico: FaChartLine,
  metodologia: FaLightbulb,
  pratico: FaUsers
}

export default function FAQPage() {
  const locale = useLocale()
  const t = useTranslations('faqPage')
  const categoryLabels = {
    basico: t('basic'),
    tecnico: t('technical'),
    metodologia: t('methodology'),
    pratico: t('practical')
  }
  const localizedFaqData = useLocaleContent().faq
  const borderColor = 'whiteAlpha.200'
  const hoverBg = 'whiteAlpha.100'
  const categoryBg = 'whiteAlpha.50'

  return (
    <AppShell>
      <Header localeHrefs={getPageAlternates('faq')} />
      
      <Box as="main">
        <Container maxW="7xl" py={{ base: 10, md: 16 }} px={{ base: 4, md: 6 }}>
          {/* Breadcrumbs */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="ink.400" />}
            mb={6}
            textStyle="body-sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href={getLocalizedHref(locale, 'home')}>
                {t('home')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#" color="brand.200" fontWeight="medium">
                FAQ
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header Section */}
          <VStack spacing={6} textAlign="center" mb={12}>
            <Heading
              as="h1"
              textStyle="h1"
              bgGradient="linear(to-r, brand.200, signal.cyan)"
              bgClip="text"
            >
              {t('title')}
            </Heading>
            <Text textStyle="body-lg" color="ink.300" maxW="3xl">
              {t('description')}
            </Text>
            
            {/* Stats Cards */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full" maxW="2xl">
              <GlassPanel p={4} textAlign="center">
                <Icon as={QuestionIcon} color="signal.blue" mb={2} />
                <Text textStyle="h3">25+</Text>
                <Text textStyle="body-sm" color="ink.300">{t('questions')}</Text>
              </GlassPanel>
              <GlassPanel p={4} textAlign="center">
                <Icon as={FaUsers} color="signal.green" mb={2} />
                <Text textStyle="h3">4</Text>
                <Text textStyle="body-sm" color="ink.300">{t('categories')}</Text>
              </GlassPanel>
              <GlassPanel p={4} textAlign="center">
                <Icon as={FaClock} color="signal.amber" mb={2} />
                <Text textStyle="h3">5min</Text>
                <Text textStyle="body-sm" color="ink.300">{t('averageReading')}</Text>
              </GlassPanel>
              <GlassPanel p={4} textAlign="center">
                <Icon as={CheckCircleIcon} color="brand.300" mb={2} />
                <Text textStyle="h3">100%</Text>
                <Text textStyle="body-sm" color="ink.300">{t('useful')}</Text>
              </GlassPanel>
            </SimpleGrid>
          </VStack>

          {/* FAQ Content */}
          <GlassPanel p={{ base: 5, md: 8 }} strength="strong">
            <VStack spacing={8} align="stretch">
              {/* Category Filters */}
              <Box>
                <Heading as="h2" textStyle="h4" mb={4}>{t('categories')}</Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  {Object.entries(categoryLabels).map(([key, label]) => {
                    const IconComponent = categoryIcons[key as keyof typeof categoryIcons]
                    const count = localizedFaqData.filter(faq => faq.category === key).length
                    return (
                      <Flex
                        key={key}
                        align="center"
                        p={3}
                        borderRadius="lg"
                        border="1px"
                        borderColor={borderColor}
                        bg={categoryBg}
                      >
                        <Icon as={IconComponent} color={`${categoryColors[key as keyof typeof categoryColors]}.500`} mr={2} />
                        <Box>
                          <Text textStyle="label">{label}</Text>
                          <Text textStyle="body-sm" color="ink.300">{t('questionCount', { count })}</Text>
                        </Box>
                      </Flex>
                    )
                  })}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* FAQ Accordion */}
              <Box>
                <Heading as="h2" textStyle="h4" mb={6}>{t('allQuestions')}</Heading>
                <Accordion allowMultiple>
                  {localizedFaqData.map((faq) => (
                    <AccordionItem key={faq.id} border="1px" borderColor={borderColor} borderRadius="lg" mb={4}>
                      <h3>
                        <AccordionButton p={{ base: 4, md: 6 }} _hover={{ bg: hoverBg }}>
                          <Box flex="1" textAlign="left">
                            <Flex
                              direction={{ base: "column", sm: "row" }}
                              align={{ base: "flex-start", sm: "center" }}
                              gap={{ base: 2, sm: 3 }}
                            >
                              <Badge 
                                colorScheme={categoryColors[faq.category]} 
                                variant="subtle"
                              >
                                {categoryLabels[faq.category]}
                              </Badge>
                              <Text textStyle="h4">
                                {faq.question}
                              </Text>
                            </Flex>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h3>
                      <AccordionPanel p={{ base: 4, md: 6 }} pt={0}>
                        <Text textStyle="body" color="ink.300">
                          {faq.answer}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Box>

              <Divider />

              {/* CTA Section */}
              <VStack spacing={6} textAlign="center">
                <Heading as="h2" textStyle="h2">{t('stillQuestions')}</Heading>
                <Text color="ink.300" maxW="2xl" textStyle="body">
                  {t('ctaDescription')}
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full" maxW="lg">
                  <Button
                    as={NextLink}
                    href={getLocalizedHref(locale, 'home')}
                    variant="premium"
                    size="lg"
                    leftIcon={<Icon as={FaUsers} />}
                  >
                    {t('createRoom')}
                  </Button>
                  <Button
                    as={NextLink}
                    href={getLocalizedHref(locale, 'guide')}
                    variant="glass"
                    size="lg"
                    leftIcon={<Icon as={FaLightbulb} />}
                  >
                    {t('completeGuide')}
                  </Button>
                </SimpleGrid>
                
                <Box mt={8} p={6} bg="whiteAlpha.50" borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
                  <Text textStyle="body-sm" color="ink.300" textAlign="center">
                    {t('tip')}
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </GlassPanel>
        </Container>
      </Box>
    </AppShell>
  )
}
