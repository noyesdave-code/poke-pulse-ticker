/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as portfolioPriceAlert } from './portfolio-price-alert.tsx'
import { template as weeklyPortfolioSummary } from './weekly-portfolio-summary.tsx'
import { template as dailyAuditReport } from './daily-audit-report.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'portfolio-price-alert': portfolioPriceAlert,
  'weekly-portfolio-summary': weeklyPortfolioSummary,
  'daily-audit-report': dailyAuditReport,
}
