import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Poke-Pulse-Engine™"

interface DunningProps {
  recipientName?: string
  attemptNumber?: number
}

const DunningRecoveryEmail = ({ recipientName, attemptNumber = 1 }: DunningProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Quick action needed — your {SITE_NAME} access is paused</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{SITE_NAME}</Heading>
        <Hr style={hr} />
        <Heading style={h2}>Your last payment didn't go through</Heading>
        <Text style={text}>
          Hi {recipientName || 'there'},
          {'\n\n'}
          We tried to renew your subscription but the card on file was declined (attempt #{attemptNumber}).
          {'\n\n'}
          Your real-time market data, Alpha Signals™, and portfolio tracking are temporarily paused. Update your payment method in 2 clicks to restore full access.
        </Text>
        <Button style={button} href="https://poke-pulse-ticker.com/pricing">
          Update Payment Method →
        </Button>
        <Text style={smallText}>
          Need help? Reply to this email and we'll sort it out instantly.
        </Text>
        <Text style={footer}>
          {SITE_NAME} | PGVA Ventures, LLC | poke-pulse-ticker.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DunningRecoveryEmail,
  subject: (data: Record<string, any>) => `Action needed: Update your ${SITE_NAME} payment method`,
  displayName: 'Dunning recovery',
  previewData: {
    recipientName: 'Alex',
    attemptNumber: 1,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'SF Mono', 'Fira Code', monospace, Arial, sans-serif" }
const container = { padding: '24px 28px', maxWidth: '580px' }
const h1 = { fontSize: '20px', fontWeight: 'bold', color: '#10b981', margin: '0 0 16px', letterSpacing: '-0.5px' }
const h2 = { fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px' }
const hr = { borderColor: '#e5e7eb', margin: '16px 0' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 24px', whiteSpace: 'pre-line' as const }
const smallText = { fontSize: '12px', color: '#6b7280', margin: '20px 0 0' }
const button = { backgroundColor: '#10b981', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }
const footer = { fontSize: '11px', color: '#9ca3af', margin: '28px 0 0' }
