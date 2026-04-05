import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "PGVA Ventures / Poke Pulse Market Terminal"
const BASE_URL = "https://eikhrxplszgnmgzsktdl.supabase.co/storage/v1/object/public/investor-assets"

interface InvestorPacketProps {
  recipientName?: string
  customMessage?: string
}

const InvestorPacketEmail = ({ recipientName, customMessage }: InvestorPacketProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>PGVA Ventures - Investor Acquisition Package & YouTube TV Contacts</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>PGVA Ventures, LLC</Heading>
          <Text style={subtitle}>Investor Acquisition Package</Text>
        </Section>

        <Hr style={divider} />

        <Text style={text}>
          {recipientName ? `Dear ${recipientName},` : 'Dear Investor,'}
        </Text>

        <Text style={text}>
          Please find below the complete PGVA Ventures investor acquisition package for the 
          Poke Pulse Market Terminal Engine - the world's first institutional-grade Pokemon TCG 
          market analytics platform.
        </Text>

        {customMessage && <Text style={text}>{customMessage}</Text>}

        <Section style={docsSection}>
          <Heading as="h2" style={h2}>Investor Documents</Heading>
          
          <Button style={downloadBtn} href={`${BASE_URL}/PGVA_Top_20_Investor_Targets_Safety_Analysis_2026.pdf`}>
            Download: Top 20 Investor Targets & Safety Analysis
          </Button>

          <Button style={downloadBtn} href={`${BASE_URL}/PGVA_3Tier_Vertical_Integration_2026.pdf`}>
            Download: 3-Tier Vertical Integration Deck
          </Button>

          <Button style={downloadBtn} href={`${BASE_URL}/PGVA_Investor_Report_2026.pdf`}>
            Download: 2026 Investor Report
          </Button>

          <Button style={downloadBtn} href={`${BASE_URL}/PGVA_Financial_Projections_2026_2029.pdf`}>
            Download: Financial Projections 2026-2029
          </Button>

          <Button style={downloadBtn} href={`${BASE_URL}/PGVA_IP_Assignment_Protection_Agreement.pdf`}>
            Download: IP Protection Agreement
          </Button>

          <Button style={downloadBtn} href={`${BASE_URL}/PGVA_Promo_Social_Media_Copy_2026.pdf`}>
            Download: Social Media Campaign Copy
          </Button>
        </Section>

        <Hr style={divider} />

        <Section style={docsSection}>
          <Heading as="h2" style={h2}>YouTube TV Investor Contacts</Heading>
          <Text style={text}>
            Key contacts at YouTube/Google for partnership, advertising, and content distribution:
          </Text>

          <Text style={contactBlock}>
            <strong>Neal Mohan</strong> - CEO, YouTube{'\n'}
            neal@google.com | nmohan@youtube.com{'\n'}
            Focus: Platform strategy, creator partnerships, content distribution
          </Text>

          <Text style={contactBlock}>
            <strong>Philipp Schindler</strong> - SVP & CBO, Google{'\n'}
            schindler@google.com | philipp@google.com{'\n'}
            Focus: Advertising partnerships, revenue deals, brand integrations
          </Text>

          <Text style={contactBlock}>
            <strong>Mary Ellen Coe</strong> - President, YouTube Ads & Commerce{'\n'}
            mecoe@google.com{'\n'}
            Focus: YouTube TV ad buys, commerce integrations, sponsored content
          </Text>

          <Text style={contactBlock}>
            <strong>Lyor Cohen</strong> - Global Head of Music, YouTube{'\n'}
            lyor@youtube.com | lyorc@google.com{'\n'}
            Focus: Content licensing, creator fund, music/media partnerships
          </Text>

          <Text style={contactBlock}>
            <strong>Robert Kyncl</strong> - Former CBO YouTube (now Warner Music CEO){'\n'}
            rkyncl@wmg.com{'\n'}
            Focus: Media distribution, content licensing, strategic partnerships
          </Text>

          <Text style={contactBlock}>
            <strong>YouTube TV Partnerships (General)</strong>{'\n'}
            tv-partnerships@youtube.com | youtubetv-support@google.com{'\n'}
            Focus: Channel distribution, content carriage, PGTV integration
          </Text>

          <Text style={contactBlock}>
            <strong>Google Ventures (GV) - General Partner</strong>{'\n'}
            info@gv.com | investments@gv.com{'\n'}
            Focus: Seed/Series A funding, tech-enabled marketplace investments
          </Text>
        </Section>

        <Hr style={divider} />

        <Section style={docsSection}>
          <Heading as="h2" style={h2}>Live Platform</Heading>
          <Button style={ctaBtn} href="https://poke-pulse-ticker.com">
            Visit Poke Pulse Market Terminal
          </Button>
        </Section>

        <Text style={footer}>
          CONFIDENTIAL - For authorized recipients only.{'\n'}
          (c) 2026 PGVA Ventures, LLC. All rights reserved.{'\n'}
          Poke Pulse Market Terminal, SimTrader World, and Poke-Pulse Arena are trademarks of PGVA Ventures, LLC.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InvestorPacketEmail,
  subject: 'PGVA Ventures - Investor Acquisition Package & YouTube TV Contacts',
  displayName: 'Investor packet delivery',
  previewData: { recipientName: 'Dave' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Helvetica Neue', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '600px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, paddingBottom: '10px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0a0e14', margin: '0 0 5px', letterSpacing: '-0.5px' }
const subtitle = { fontSize: '14px', color: '#00d26a', fontWeight: '600', margin: '0', textTransform: 'uppercase' as const, letterSpacing: '1.5px' }
const h2 = { fontSize: '16px', fontWeight: 'bold', color: '#0a0e14', margin: '0 0 12px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 16px' }
const contactBlock = { fontSize: '13px', color: '#333', lineHeight: '1.6', margin: '0 0 14px', padding: '10px 14px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '3px solid #00d26a', whiteSpace: 'pre-line' as const }
const docsSection = { padding: '16px 0' }
const downloadBtn = { display: 'block', backgroundColor: '#0a0e14', color: '#00d26a', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textAlign: 'center' as const, margin: '0 0 8px', width: '100%' }
const ctaBtn = { display: 'block', backgroundColor: '#00d26a', color: '#0a0e14', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', textAlign: 'center' as const, width: '100%' }
const divider = { borderColor: '#e5e7eb', margin: '20px 0' }
const footer = { fontSize: '11px', color: '#999', lineHeight: '1.5', margin: '24px 0 0', textAlign: 'center' as const, whiteSpace: 'pre-line' as const }
