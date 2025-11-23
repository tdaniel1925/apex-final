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

interface CommissionEarnedEmailProps {
  firstName: string
  amount: string
  commissionType: string
  fromUser?: string
  dashboardUrl: string
}

export const CommissionEarnedEmail = ({
  firstName = 'Distributor',
  amount = '$0.00',
  commissionType = 'retail',
  fromUser,
  dashboardUrl = 'https://apexmlm.com/dashboard/commissions',
}: CommissionEarnedEmailProps) => {
  const typeLabels: Record<string, string> = {
    retail: 'Retail Commission',
    matrix: 'Matrix Bonus',
    rank_bonus: 'Rank Achievement Bonus',
    matching: 'Matching Bonus',
  }

  return (
    <Html>
      <Head />
      <Preview>You earned {amount} in commissions!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 Commission Earned!</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            Great news! You've just earned a commission.
          </Text>

          <Section style={highlightBox}>
            <Text style={amountText}>{amount}</Text>
            <Text style={typeText}>{typeLabels[commissionType] || commissionType}</Text>
            {fromUser && (
              <Text style={detailText}>From: {fromUser}</Text>
            )}
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Commission Details
            </Button>
          </Section>

          <Text style={text}>
            Your commission will be included in the next payout batch. Make sure your Stripe
            Connect account is set up to receive payments.
          </Text>

          <Text style={footer}>
            Keep up the great work!
            <br />
            The Apex MLM Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default CommissionEarnedEmail

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
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  margin: '24px 48px',
  padding: '24px',
  textAlign: 'center' as const,
}

const amountText = {
  color: '#10b981',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.2',
}

const typeText = {
  color: '#333',
  fontSize: '18px',
  margin: '8px 0',
}

const detailText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '4px 0',
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

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 48px',
  marginTop: '24px',
}
