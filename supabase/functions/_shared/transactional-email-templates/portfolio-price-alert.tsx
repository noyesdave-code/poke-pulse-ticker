import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Button,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Poke-Pulse-Ticker"

interface PriceMovement {
  cardName: string
  cardSet: string
  oldPrice: string
  newPrice: string
  changePercent: string
  direction: string
}

interface PortfolioPriceAlertProps {
  displayName?: string
  movements?: PriceMovement[]
  totalPortfolioValue?: string
  totalChange?: string
}

const PortfolioPriceAlertEmail = ({
  displayName,
  movements = [],
  totalPortfolioValue,
  totalChange,
}: PortfolioPriceAlertProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Portfolio price alert — significant movements detected</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={logo}>PG</Text>
          <Heading style={h1}>Portfolio Price Alert</Heading>
        </Section>

        <Text style={greeting}>
          {displayName ? `Hey ${displayName},` : 'Hey there,'}
        </Text>

        <Text style={text}>
          We detected significant price movements in your portfolio. Here's a summary:
        </Text>

        {totalPortfolioValue && (
          <Section style={summaryBox}>
            <Text style={summaryLabel}>PORTFOLIO VALUE</Text>
            <Text style={summaryValue}>{totalPortfolioValue}</Text>
            {totalChange && (
              <Text style={{
                ...summaryChange,
                color: totalChange.startsWith('+') ? '#16a34a' : '#dc2626',
              }}>
                {totalChange}
              </Text>
            )}
          </Section>
        )}

        {movements.length > 0 && (
          <Section style={movementsSection}>
            <Text style={sectionTitle}>NOTABLE MOVEMENTS</Text>
            {movements.map((m, i) => (
              <Section key={i} style={movementRow}>
                <Text style={cardName}>{m.cardName}</Text>
                <Text style={cardSet}>{m.cardSet}</Text>
                <Text style={priceRow}>
                  {m.oldPrice} → {m.newPrice}{' '}
                  <span style={{
                    color: m.direction === 'up' ? '#16a34a' : '#dc2626',
                    fontWeight: 'bold',
                  }}>
                    ({m.changePercent})
                  </span>
                </Text>
                {i < movements.length - 1 && <Hr style={divider} />}
              </Section>
            ))}
          </Section>
        )}

        <Button style={ctaButton} href="https://poke-pulse-ticker.lovable.app/portfolio">
          View Full Portfolio
        </Button>

        <Hr style={divider} />

        <Text style={disclaimer}>
          This is an automated alert from {SITE_NAME}. Price data is sourced from
          pokemontcg.io and is for informational purposes only. Not financial advice.
        </Text>

        <Text style={footer}>
          © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PortfolioPriceAlertEmail,
  subject: (data: Record<string, any>) =>
    `Portfolio Alert: ${data.totalChange || 'Price movements detected'}`,
  displayName: 'Portfolio price alert',
  previewData: {
    displayName: 'Collector',
    totalPortfolioValue: '$12,450.00',
    totalChange: '+3.2%',
    movements: [
      {
        cardName: 'Charizard',
        cardSet: 'Base Set',
        oldPrice: '$470.00',
        newPrice: '$494.23',
        changePercent: '+5.2%',
        direction: 'up',
      },
      {
        cardName: 'Lugia',
        cardSet: 'Neo Genesis',
        oldPrice: '$1,320.00',
        newPrice: '$1,299.96',
        changePercent: '-1.5%',
        direction: 'down',
      },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logo = {
  display: 'inline-block',
  backgroundColor: '#16a34a',
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: '14px',
  width: '32px',
  height: '32px',
  lineHeight: '32px',
  textAlign: 'center' as const,
  borderRadius: '6px',
  margin: '0 auto 8px',
}
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0' }
const greeting = { fontSize: '15px', color: '#334155', margin: '0 0 8px' }
const text = { fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: '0 0 20px' }
const summaryBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center' as const,
  marginBottom: '20px',
}
const summaryLabel = { fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', margin: '0 0 4px', fontWeight: 'bold' }
const summaryValue = { fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0' }
const summaryChange = { fontSize: '14px', fontWeight: 'bold', margin: '4px 0 0' }
const movementsSection = { marginBottom: '20px' }
const sectionTitle = { fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', fontWeight: 'bold', margin: '0 0 12px' }
const movementRow = { marginBottom: '8px' }
const cardName = { fontSize: '14px', fontWeight: 'bold', color: '#0f172a', margin: '0' }
const cardSet = { fontSize: '12px', color: '#94a3b8', margin: '0 0 4px' }
const priceRow = { fontSize: '13px', color: '#475569', margin: '0' }
const ctaButton = {
  display: 'inline-block',
  backgroundColor: '#16a34a',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  margin: '8px 0 24px',
}
const divider = { borderColor: '#e2e8f0', margin: '16px 0' }
const disclaimer = { fontSize: '11px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 8px' }
const footer = { fontSize: '11px', color: '#cbd5e1', margin: '0' }
