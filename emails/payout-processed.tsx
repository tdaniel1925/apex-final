import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface PayoutProcessedEmailProps {
  firstName: string
  amount: string
  batchNumber: string
  commissionCount: number
  dashboardUrl: string
}

export const PayoutProcessedEmail = ({
  firstName = 'Distributor',
  amount = '$0.00',
  batchNumber = 'BATCH-000',
  commissionCount = 0,
  dashboardUrl = 'https://apexmlm.com/dashboard/payouts',
}: PayoutProcessedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your payout of {amount} has been processed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>💰 Payout Processed!</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            Excellent news! Your payout has been successfully processed and is on its way to your
            bank account.
          </Text>

          <Section style={highlightBox}>
            <Text style={amountText}>{amount}</Text>
            <Text style={detailText}>
              Batch: {batchNumber}
              <br />
              {commissionCount} commission{commissionCount !== 1 ? 's' : ''} included
            </Text>
          </Section>

          <Text style={text}>
            The funds should appear in your bank account within 2-3 business days, depending on
            your bank's processing time.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Payout History
            </Button>
          </Section>

          <Text style={infoBox}>
            <strong>Important:</strong> Please review your payout statement in your dashboard. If
            you notice any discrepancies, contact our support team immediately.
          </Text>

          <Text style={footer}>
            Thank you for being a valued member of Apex MLM!
            <br />
            The Apex MLM Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PayoutProcessedEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
}

const highlightBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  margin: '24px 48px',
  padding: '24px',
  textAlign: 'center' as const,
}

const amountText = {
  color: '#10b981',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.2',
}

const detailText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '12px 0 0',
  lineHeight: '20px',
}

const buttonContainer = {
  padding: '27px 0 27px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
}

const infoBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '12px 16px',
  margin: '24px 48px',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 48px',
  marginTop: '24px',
}
