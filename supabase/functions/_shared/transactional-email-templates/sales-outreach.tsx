import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Poke-Pulse-Engine™"

interface SalesOutreachProps {
  recipientName?: string
  subject?: string
  emailBody?: string
}

const SalesOutreachEmail = ({ recipientName, emailBody }: SalesOutreachProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Real-time Pokémon TCG market intelligence for {recipientName || 'you'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{SITE_NAME}</Heading>
        <Hr style={hr} />
        <Text style={text}>
          {emailBody || `Hi ${recipientName || 'there'},\n\nDiscover institutional-grade Pokémon card market data with Poke-Pulse-Engine™ — real-time pricing, Alpha Signals, arbitrage detection, and portfolio tracking across 3,000+ cards.`}
        </Text>
        <Button style={button} href="https://poke-pulse-ticker.com/pricing">
          View Plans →
        </Button>
        <Text style={footer}>
          {SITE_NAME} | poke-pulse-ticker.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SalesOutreachEmail,
  subject: (data: Record<string, any>) => data.subject || `${SITE_NAME} — Real-Time Pokémon Card Market Data`,
  displayName: 'Sales outreach',
  previewData: {
    recipientName: 'Alex',
    subject: 'Poke-Pulse-Engine™ — Your Edge in Pokémon Card Trading',
    emailBody: 'Hi Alex,\n\nI noticed your shop carries a strong selection of vintage Pokemon cards. Our platform tracks real-time pricing on 3,000+ cards with Alpha Signal™ predictive analytics that could help you price inventory 20-40% more accurately.\n\nWould you be open to a quick demo?',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'SF Mono', 'Fira Code', monospace, Arial, sans-serif" }
const container = { padding: '24px 28px', maxWidth: '580px' }
const h1 = { fontSize: '20px', fontWeight: 'bold', color: '#10b981', margin: '0 0 16px', letterSpacing: '-0.5px' }
const hr = { borderColor: '#e5e7eb', margin: '16px 0' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 24px', whiteSpace: 'pre-line' as const }
const button = { backgroundColor: '#10b981', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }
const footer = { fontSize: '11px', color: '#9ca3af', margin: '28px 0 0' }
