import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "PGVA Ventures, LLC"
const BASE_URL = "https://eikhrxplszgnmgzsktdl.supabase.co/storage/v1/object/public/investor-assets"

interface InvestorOutreachProps {
  recipientName?: string
  firmName?: string
  partnerName?: string
  investorFocus?: string
  whyFit?: string
}

const InvestorOutreachEmail = ({ recipientName, firmName, partnerName, investorFocus, whyFit }: InvestorOutreachProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>PGVA Ventures — Strategic Investment Opportunity: 5-Tier Vertical Integration™ in $103B+ TCG Market</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Security Header */}
        <Section style={securityBanner}>
          <Text style={securityText}>🔒 CONFIDENTIAL — AUTHORIZED RECIPIENT ONLY</Text>
        </Section>

        <Section style={headerSection}>
          <Heading style={h1}>PGVA Ventures, LLC</Heading>
          <Text style={subtitle}>5-Tier Vertical Integration™ Platform</Text>
        </Section>

        <Hr style={divider} />

        <Text style={text}>
          {partnerName ? `Dear ${partnerName},` : recipientName ? `Dear ${recipientName},` : 'Dear Investment Team,'}
        </Text>

        <Text style={text}>
          I am David Noyes, Founder & CEO of PGVA Ventures, LLC, reaching out regarding a strategic 
          investment opportunity in the rapidly expanding Trading Card Game (TCG) and collectibles 
          market — a sector projected to exceed <strong>$103 billion by 2030</strong>.
        </Text>

        {firmName && (
          <Text style={text}>
            {firmName}'s track record{investorFocus ? ` in ${investorFocus}` : ''} aligns 
            exceptionally well with our vision.{whyFit ? ` ${whyFit}` : ''}
          </Text>
        )}

        <Section style={highlightBox}>
          <Heading as="h2" style={h2}>The Opportunity</Heading>
          <Text style={highlightText}>
            PGVA Ventures has built the <strong>world's first institutional-grade TCG market analytics 
            platform</strong> — the Poke Pulse Engine™ — encompassing a proprietary 5-Tier Vertical 
            Integration™ system spanning physical commerce, data analytics, media distribution, 
            and philanthropic impact.
          </Text>
        </Section>

        <Section style={metricsSection}>
          <Text style={metricItem}>📊 <strong>$16.9M projected Year 1 ARR</strong> across 5 integrated tiers</Text>
          <Text style={metricItem}>🎯 <strong>$1.89B+ target valuation</strong> by 2031</Text>
          <Text style={metricItem}>🌍 <strong>12 vertical markets</strong> addressable from a single engine</Text>
          <Text style={metricItem}>🏗️ <strong>5-Tier Vertical Integration™</strong> — franchise, analytics, institutional data, media, philanthropy</Text>
          <Text style={metricItem}>⚡ <strong>Live platform</strong> with real-time market data, SimTrader™, and Poké-Pulse Arena™</Text>
        </Section>

        <Hr style={divider} />

        <Section style={docsSection}>
          <Heading as="h2" style={h2}>Executive Summary Materials</Heading>
          <Text style={text}>
            Enclosed below are protected investor overview materials. Full financial projections, 
            IP documentation, and detailed pitch deck are available upon request and NDA execution.
          </Text>

          <Button style={downloadBtn} href={`${BASE_URL}/PGVA_5Tier_Vertical_Integration_2026.pdf`}>
            📄 5-Tier Vertical Integration™ Overview
          </Button>

          <Button style={downloadBtn} href={`${BASE_URL}/PGVA_Investor_Report_2026.pdf`}>
            📊 2026 Investor Report
          </Button>
        </Section>

        <Hr style={divider} />

        <Section style={ctaSection}>
          <Heading as="h2" style={h2}>Next Steps</Heading>
          <Text style={text}>
            I would welcome the opportunity to schedule a 30-minute introductory call to discuss 
            how PGVA Ventures aligns with {firmName ? `${firmName}'s` : 'your'} investment thesis. 
            I am available at your convenience.
          </Text>

          <Button style={ctaBtn} href="https://poke-pulse-ticker.com">
            Explore Live Platform →
          </Button>
        </Section>

        <Hr style={divider} />

        <Section style={contactSection}>
          <Text style={contactText}>
            <strong>David Noyes</strong> — Founder & CEO{'\n'}
            PGVA Ventures, LLC{'\n'}
            📧 contact@poke-pulse-ticker.com{'\n'}
            📧 pokegarageva@gmail.com{'\n'}
            🌐 poke-pulse-ticker.com
          </Text>
        </Section>

        {/* Legal Footer */}
        <Section style={legalSection}>
          <Text style={legalText}>
            CONFIDENTIAL & PROPRIETARY — This communication and all attached materials are the 
            exclusive intellectual property of PGVA Ventures, LLC, protected under U.S. copyright, 
            trademark, and trade secret law. Unauthorized reproduction, distribution, or disclosure 
            is strictly prohibited and may result in civil and criminal penalties under 18 U.S.C. § 1832 
            (Economic Espionage Act) and 17 U.S.C. § 501 (Copyright Act).
          </Text>
          <Text style={legalText}>
            This email does not constitute an offer to sell or solicitation of an offer to buy 
            securities. Any investment opportunity is available only to accredited investors and 
            is subject to the terms of applicable offering documents.
          </Text>
          <Text style={legalText}>
            © 2026 PGVA Ventures, LLC. All rights reserved. Poke Pulse Engine™, Pulse Engine™, 
            PGTV Media Hub™, PokéGarageVA™, SimTrader™, Poké-Pulse Arena™, and 5-Tier Vertical 
            Integration™ are trademarks of PGVA Ventures, LLC.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InvestorOutreachEmail,
  subject: (data: Record<string, any>) => 
    `PGVA Ventures — Strategic Investment Opportunity${data.firmName ? ` for ${data.firmName}` : ''}`,
  displayName: 'Investor outreach',
  previewData: { 
    recipientName: 'Partner', 
    firmName: 'Sequoia Capital',
    partnerName: 'Investment Team',
    investorFocus: 'technology and marketplace platforms',
    whyFit: 'Your portfolio of category-defining marketplace companies demonstrates the exact pattern we are building.'
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Helvetica Neue', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '600px', margin: '0 auto' }
const securityBanner = { backgroundColor: '#0a0e14', padding: '8px 16px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' as const }
const securityText = { fontSize: '11px', color: '#00d26a', fontWeight: '600', margin: '0', letterSpacing: '1px', textTransform: 'uppercase' as const }
const headerSection = { textAlign: 'center' as const, paddingBottom: '10px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0a0e14', margin: '0 0 5px', letterSpacing: '-0.5px' }
const subtitle = { fontSize: '13px', color: '#00d26a', fontWeight: '600', margin: '0', textTransform: 'uppercase' as const, letterSpacing: '1.5px' }
const h2 = { fontSize: '16px', fontWeight: 'bold', color: '#0a0e14', margin: '0 0 12px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '1.7', margin: '0 0 16px' }
const highlightBox = { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '18px 20px', margin: '16px 0' }
const highlightText = { fontSize: '14px', color: '#333', lineHeight: '1.7', margin: '0' }
const metricsSection = { padding: '8px 0' }
const metricItem = { fontSize: '13px', color: '#333', lineHeight: '1.5', margin: '0 0 8px', padding: '8px 14px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '3px solid #00d26a' }
const docsSection = { padding: '16px 0' }
const downloadBtn = { display: 'block', backgroundColor: '#0a0e14', color: '#00d26a', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textAlign: 'center' as const, margin: '0 0 8px', width: '100%' }
const ctaSection = { padding: '8px 0' }
const ctaBtn = { display: 'block', backgroundColor: '#00d26a', color: '#0a0e14', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', textAlign: 'center' as const, width: '100%' }
const contactSection = { padding: '12px 0' }
const contactText = { fontSize: '13px', color: '#333', lineHeight: '1.6', margin: '0', whiteSpace: 'pre-line' as const }
const divider = { borderColor: '#e5e7eb', margin: '20px 0' }
const legalSection = { backgroundColor: '#f9fafb', borderRadius: '6px', padding: '16px 18px', marginTop: '20px', borderTop: '2px solid #0a0e14' }
const legalText = { fontSize: '10px', color: '#777', lineHeight: '1.5', margin: '0 0 8px' }
