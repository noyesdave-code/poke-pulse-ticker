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

interface BalanceSheetLine {
  label: string
  amount: number
  detail?: string
}

interface DailyAuditReportProps {
  overallScore?: number
  summary?: string
  categories?: CategoryResult[]
  auditDate?: string
  topPriorities?: Array<{ title: string; category: string; impact: string; description: string }>
  balanceSheet?: {
    subscriptionRevenue?: BalanceSheetLine[]
    productRevenue?: BalanceSheetLine[]
    affiliateRevenue?: BalanceSheetLine[]
    totalMRR?: number
    totalARR?: number
    activeSubscribers?: number
    trialUsers?: number
    arenaEconomy?: {
      totalPokecoinsCirculating?: number
      totalWagered?: number
      totalWon?: number
    }
  }
  capitalDream?: {
    annualTarget?: number
    dayOfYear?: number
    dailyTarget?: number
    dailyOperatingCosts?: number
    dailyNetTarget?: number
    ytdTarget?: number
    streams?: Array<{ name: string; annualTarget: number; dailyTarget: number }>
    gapCloserHighlights?: string[]
  }
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

const formatCurrency = (amount: number) =>
  `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatNumber = (n: number) => n.toLocaleString('en-US')

const DailyAuditReportEmail = ({
  overallScore = 0,
  summary = '',
  categories = [],
  auditDate,
  topPriorities = [],
  balanceSheet,
  capitalDream,
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

        {/* ── BALANCE SHEET ── */}
        {balanceSheet && (
          <Section style={balanceSheetSection}>
            <Text style={sectionTitle}>POKE-PULSE PRODUCT BALANCE SHEET</Text>

            {/* KPI row */}
            <Section style={kpiRow}>
              <Text style={kpiItem}>
                <span style={kpiLabel}>MRR</span>{'\n'}
                <span style={kpiValue}>{formatCurrency(balanceSheet.totalMRR ?? 0)}</span>
              </Text>
              <Text style={kpiItem}>
                <span style={kpiLabel}>ARR</span>{'\n'}
                <span style={kpiValue}>{formatCurrency(balanceSheet.totalARR ?? 0)}</span>
              </Text>
              <Text style={kpiItem}>
                <span style={kpiLabel}>Active Subs</span>{'\n'}
                <span style={kpiValue}>{balanceSheet.activeSubscribers ?? 0}</span>
              </Text>
              <Text style={kpiItem}>
                <span style={kpiLabel}>Trial Users</span>{'\n'}
                <span style={kpiValue}>{balanceSheet.trialUsers ?? 0}</span>
              </Text>
            </Section>

            {/* Subscription Revenue */}
            {balanceSheet.subscriptionRevenue && balanceSheet.subscriptionRevenue.length > 0 && (
              <Section style={bsGroup}>
                <Text style={bsGroupTitle}>SUBSCRIPTION REVENUE</Text>
                {balanceSheet.subscriptionRevenue.map((line, i) => (
                  <Section key={i} style={bsLineRow}>
                    <Text style={bsLineLabel}>{line.label}{line.detail ? ` (${line.detail})` : ''}</Text>
                    <Text style={bsLineAmount}>{formatCurrency(line.amount)}</Text>
                  </Section>
                ))}
              </Section>
            )}

            {/* Product Revenue */}
            {balanceSheet.productRevenue && balanceSheet.productRevenue.length > 0 && (
              <Section style={bsGroup}>
                <Text style={bsGroupTitle}>PRODUCT REVENUE (PokéCoin Store)</Text>
                {balanceSheet.productRevenue.map((line, i) => (
                  <Section key={i} style={bsLineRow}>
                    <Text style={bsLineLabel}>{line.label}{line.detail ? ` (${line.detail})` : ''}</Text>
                    <Text style={bsLineAmount}>{formatCurrency(line.amount)}</Text>
                  </Section>
                ))}
              </Section>
            )}

            {/* Affiliate Revenue */}
            {balanceSheet.affiliateRevenue && balanceSheet.affiliateRevenue.length > 0 && (
              <Section style={bsGroup}>
                <Text style={bsGroupTitle}>AFFILIATE REVENUE</Text>
                {balanceSheet.affiliateRevenue.map((line, i) => (
                  <Section key={i} style={bsLineRow}>
                    <Text style={bsLineLabel}>{line.label}{line.detail ? ` (${line.detail})` : ''}</Text>
                    <Text style={bsLineAmount}>{formatCurrency(line.amount)}</Text>
                  </Section>
                ))}
              </Section>
            )}

            {/* Arena Economy */}
            {balanceSheet.arenaEconomy && (
              <Section style={bsGroup}>
                <Text style={bsGroupTitle}>ARENA ECONOMY</Text>
                <Section style={bsLineRow}>
                  <Text style={bsLineLabel}>PokéCoins Circulating</Text>
                  <Text style={bsLineAmount}>{formatNumber(balanceSheet.arenaEconomy.totalPokecoinsCirculating ?? 0)} PC</Text>
                </Section>
                <Section style={bsLineRow}>
                  <Text style={bsLineLabel}>Total Wagered (Lifetime)</Text>
                  <Text style={bsLineAmount}>{formatNumber(balanceSheet.arenaEconomy.totalWagered ?? 0)} PC</Text>
                </Section>
                <Section style={bsLineRow}>
                  <Text style={bsLineLabel}>Total Won (Lifetime)</Text>
                  <Text style={bsLineAmount}>{formatNumber(balanceSheet.arenaEconomy.totalWon ?? 0)} PC</Text>
                </Section>
              </Section>
            )}

            <Hr style={bsDivider} />
            <Section style={bsLineRow}>
              <Text style={{ ...bsLineLabel, fontWeight: 'bold', fontSize: '14px' }}>TOTAL GROSS REVENUE</Text>
              <Text style={{ ...bsLineAmount, fontWeight: 'bold', fontSize: '14px', color: '#16a34a' }}>
                {formatCurrency(
                  (balanceSheet.subscriptionRevenue?.reduce((s, l) => s + l.amount, 0) ?? 0) +
                  (balanceSheet.productRevenue?.reduce((s, l) => s + l.amount, 0) ?? 0) +
                  (balanceSheet.affiliateRevenue?.reduce((s, l) => s + l.amount, 0) ?? 0)
                )}
              </Text>
            </Section>
          </Section>
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
          counts and AI quality assessment. Balance sheet data sourced from Stripe. Not a substitute for professional review.
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
    `Daily Audit: ${data.overallScore || 0}/100 + Balance Sheet — ${SITE_NAME}`,
  displayName: 'Daily audit report + balance sheet',
  previewData: {
    overallScore: 98,
    summary: 'Platform maintains strong performance across all 11 categories with a 98/100 overall score.',
    auditDate: 'Tuesday, April 1, 2026',
    categories: [
      { name: 'aesthetics', score: 98, status: 'strong', recommendations: ['Consider micro-animations on hover states'] },
      { name: 'efficiency', score: 98, status: 'strong', recommendations: [] },
      { name: 'security', score: 98, status: 'strong', recommendations: ['Add CSP report-uri endpoint'] },
    ],
    topPriorities: [
      { title: 'Add PSA grading API integration', category: 'competitive_edge', impact: 'high', description: 'Direct PSA population data would strengthen grading arbitrage signals.' },
    ],
    balanceSheet: {
      totalMRR: 249.50,
      totalARR: 2994.00,
      activeSubscribers: 12,
      trialUsers: 5,
      subscriptionRevenue: [
        { label: 'Pro ($4.99/mo)', amount: 49.90, detail: '10 subscribers' },
        { label: 'Premium ($9.99/mo)', amount: 19.98, detail: '2 subscribers' },
      ],
      productRevenue: [
        { label: 'PokéCoin Bundles', amount: 14.97, detail: '3 purchases' },
      ],
      affiliateRevenue: [
        { label: 'TCGPlayer Affiliate', amount: 32.40, detail: 'est. clicks' },
        { label: 'eBay Partner Network', amount: 18.60, detail: 'est. clicks' },
      ],
      arenaEconomy: {
        totalPokecoinsCirculating: 150000,
        totalWagered: 45000,
        totalWon: 38500,
      },
    },
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

// Balance Sheet styles
const balanceSheetSection = {
  backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
  padding: '16px', marginBottom: '24px',
}
const kpiRow = { display: 'flex' as const, marginBottom: '12px' }
const kpiItem = { flex: '1' as const, textAlign: 'center' as const, margin: '0 4px' }
const kpiLabel = { fontSize: '9px', color: '#94a3b8', letterSpacing: '0.08em', fontWeight: 'bold', display: 'block' as const }
const kpiValue = { fontSize: '16px', fontWeight: 'bold', color: '#0f172a', display: 'block' as const, marginTop: '2px' }
const bsGroup = { marginBottom: '10px' }
const bsGroupTitle = { fontSize: '10px', color: '#64748b', letterSpacing: '0.08em', fontWeight: 'bold', margin: '8px 0 4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }
const bsLineRow = { display: 'flex' as const, justifyContent: 'space-between' as const, padding: '2px 0' }
const bsLineLabel = { fontSize: '12px', color: '#475569', margin: '0' }
const bsLineAmount = { fontSize: '12px', color: '#0f172a', fontWeight: '600', margin: '0', textAlign: 'right' as const }
const bsDivider = { borderColor: '#cbd5e1', margin: '8px 0' }

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
