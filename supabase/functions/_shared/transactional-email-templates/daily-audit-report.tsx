import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Button,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Poke-Pulse-Ticker"

interface CategoryResult {
  name: string
  score: number
  status: string
  findings?: string[]
  recommendations?: string[]
}

interface DailyAuditReportProps {
  overallScore?: number
  summary?: string
  categories?: CategoryResult[]
  auditDate?: string
  topPriorities?: Array<{ title: string; category: string; impact: string; description: string }>
}

const statusColor = (status: string) => {
  switch (status) {
    case 'strong': return '#16a34a'
    case 'adequate': return '#ca8a04'
    case 'needs_improvement': return '#ea580c'
    case 'critical': return '#dc2626'
    default: return '#64748b'
  }
}

const DailyAuditReportEmail = ({
  overallScore = 0,
  summary = '',
  categories = [],
  auditDate,
  topPriorities = [],
}: DailyAuditReportProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Daily Audit: {overallScore}/100 — {summary?.slice(0, 80)}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={logo}>PG</Text>
          <Heading style={h1}>Daily Site Audit Report</Heading>
          <Text style={dateText}>{auditDate || new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </Section>

        <Section style={scoreBox}>
          <Text style={scoreLabel}>OVERALL SCORE</Text>
          <Text style={{
            ...scoreValue,
            color: overallScore >= 90 ? '#16a34a' : overallScore >= 75 ? '#ca8a04' : '#dc2626',
          }}>{overallScore}/100</Text>
        </Section>

        {summary && (
          <Text style={summaryText}>{summary}</Text>
        )}

        {categories.length > 0 && (
          <Section style={categoriesSection}>
            <Text style={sectionTitle}>CATEGORY BREAKDOWN</Text>
            {categories.map((cat, i) => (
              <Section key={i} style={categoryRow}>
                <Text style={categoryName}>
                  {cat.name.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </Text>
                <Text style={categoryScore}>
                  <span style={{ color: statusColor(cat.status), fontWeight: 'bold' }}>
                    {cat.score}/100
                  </span>
                  {' — '}
                  <span style={{ color: statusColor(cat.status), fontSize: '11px', textTransform: 'uppercase' as const }}>
                    {cat.status.replace(/_/g, ' ')}
                  </span>
                </Text>
                {cat.recommendations && cat.recommendations.length > 0 && (
                  <Text style={recText}>→ {cat.recommendations[0]}</Text>
                )}
              </Section>
            ))}
          </Section>
        )}

        {topPriorities.length > 0 && (
          <Section style={prioritiesSection}>
            <Text style={sectionTitle}>TOP PRIORITIES</Text>
            {topPriorities.slice(0, 3).map((p, i) => (
              <Section key={i} style={priorityRow}>
                <Text style={priorityTitle}>{i + 1}. {p.title}</Text>
                <Text style={priorityDesc}>{p.description}</Text>
                <Button style={fixLink} href={`https://poke-pulse-ticker.lovable.app/command-center?fix=${encodeURIComponent(p.category || p.title)}`}>
                  Fix This →
                </Button>
              </Section>
            ))}
          </Section>
        )}

        <Button style={ctaButton} href="https://poke-pulse-ticker.lovable.app/command-center">
          View Full Audit Report
        </Button>

        <Hr style={divider} />

        <Text style={disclaimer}>
          Automated daily audit by {SITE_NAME} AI. Scores are based on implemented feature
          counts and AI quality assessment. Not a substitute for professional review.
        </Text>

        <Text style={footer}>
          © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DailyAuditReportEmail,
  subject: (data: Record<string, any>) =>
    `Daily Audit: ${data.overallScore || 0}/100 — ${SITE_NAME}`,
  displayName: 'Daily audit report',
  previewData: {
    overallScore: 95,
    summary: 'Platform maintains strong performance across all 11 categories with a 95/100 overall score.',
    auditDate: 'Monday, March 31, 2026',
    categories: [
      { name: 'aesthetics', score: 96, status: 'strong', recommendations: ['Consider micro-animations on hover states'] },
      { name: 'efficiency', score: 95, status: 'strong', recommendations: [] },
      { name: 'security', score: 95, status: 'strong', recommendations: ['Add CSP report-uri endpoint'] },
    ],
    topPriorities: [
      { title: 'Add PSA grading API integration', category: 'competitive_edge', impact: 'high', description: 'Direct PSA population data would strengthen grading arbitrage signals.' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '24px 28px', maxWidth: '600px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logo = {
  display: 'inline-block', backgroundColor: '#16a34a', color: '#ffffff',
  fontWeight: 'bold', fontSize: '14px', width: '32px', height: '32px',
  lineHeight: '32px', textAlign: 'center' as const, borderRadius: '6px',
  margin: '0 auto 8px',
}
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 4px' }
const dateText = { fontSize: '12px', color: '#94a3b8', margin: '0' }
const scoreBox = {
  backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px',
  padding: '16px', textAlign: 'center' as const, marginBottom: '20px',
}
const scoreLabel = { fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', margin: '0 0 4px', fontWeight: 'bold' }
const scoreValue = { fontSize: '36px', fontWeight: 'bold', margin: '0' }
const summaryText = { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 20px' }
const categoriesSection = { marginBottom: '24px' }
const sectionTitle = { fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', fontWeight: 'bold', margin: '0 0 12px' }
const categoryRow = { marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }
const categoryName = { fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 2px' }
const categoryScore = { fontSize: '13px', color: '#475569', margin: '0 0 2px' }
const recText = { fontSize: '12px', color: '#94a3b8', margin: '2px 0 0', fontStyle: 'italic' }
const prioritiesSection = { marginBottom: '24px' }
const priorityRow = { marginBottom: '10px' }
const priorityTitle = { fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 2px' }
const priorityDesc = { fontSize: '12px', color: '#64748b', margin: '0', lineHeight: '1.5' }
const ctaButton = {
  display: 'inline-block', backgroundColor: '#16a34a', color: '#ffffff',
  fontSize: '14px', fontWeight: 'bold', padding: '12px 24px', borderRadius: '6px',
  textDecoration: 'none', textAlign: 'center' as const, margin: '8px 0 24px',
}
const fixLink = {
  display: 'inline-block', backgroundColor: '#0f172a', color: '#ffffff',
  fontSize: '11px', fontWeight: 'bold', padding: '6px 14px', borderRadius: '4px',
  textDecoration: 'none', marginTop: '4px',
}
const divider = { borderColor: '#e2e8f0', margin: '16px 0' }
const disclaimer = { fontSize: '11px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 8px' }
const footer = { fontSize: '11px', color: '#cbd5e1', margin: '0' }
