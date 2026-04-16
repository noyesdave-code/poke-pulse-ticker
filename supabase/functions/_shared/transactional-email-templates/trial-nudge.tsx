import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Poke-Pulse-Engine™"

interface TrialNudgeProps {
  recipientName?: string
  daysRemaining?: number
  tier?: string
}

const TrialNudgeEmail = ({ recipientName, daysRemaining = 7, tier = 'Pro' }: TrialNudgeProps) => {
  const urgency = daysRemaining <= 1 ? 'Last chance!' : daysRemaining <= 3 ? 'Trial ending soon' : 'Halfway through your trial'
  const emoji = daysRemaining <= 1 ? '⏰' : daysRemaining <= 3 ? '⚡' : '📈'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{urgency} — lock in your {SITE_NAME} {tier} access</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{SITE_NAME}</Heading>
          <Hr style={hr} />
          <Heading style={h2}>{emoji} {urgency}</Heading>
          <Text style={text}>
            Hi {recipientName || 'there'},
            {'\n\n'}
            You have <strong>{daysRemaining} day{daysRemaining === 1 ? '' : 's'} left</strong> on your free {tier} trial.
            {'\n\n'}
            Lock in your access now and keep:
            {'\n'}• Real-time pricing across 3,000+ Pokémon cards
            {'\n'}• Alpha Signal™ predictive analytics
            {'\n'}• Arbitrage detection (Raw vs Graded vs Sealed)
            {'\n'}• Portfolio tracking + grading ROI calculator
            {'\n'}• Daily market intelligence reports
            {'\n\n'}
            Plans start at just <strong>$0.99/mo</strong>. Cancel anytime.
          </Text>
          <Button style={button} href="https://poke-pulse-ticker.com/pricing">
            Continue with {tier} →
          </Button>
          <Text style={smallText}>
            Questions? Just reply — we read every message.
          </Text>
          <Text style={footer}>
            {SITE_NAME} | PGVA Ventures, LLC | poke-pulse-ticker.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: TrialNudgeEmail,
  subject: (data: Record<string, any>) => {
    const days = data.daysRemaining ?? 7
    if (days <= 1) return `⏰ Last day of your ${SITE_NAME} trial`
    if (days <= 3) return `⚡ ${days} days left in your trial`
    return `📈 Halfway through your ${SITE_NAME} trial`
  },
  displayName: 'Trial nudge',
  previewData: {
    recipientName: 'Alex',
    daysRemaining: 7,
    tier: 'Pro',
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
