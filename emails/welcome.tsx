import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  firstName: string
  loginUrl: string
  sponsorName?: string
}

export const WelcomeEmail = ({
  firstName = 'Distributor',
  loginUrl = 'https://apexmlm.com/login',
  sponsorName,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Apex MLM - Your journey begins now!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Apex MLM!</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            Congratulations on joining Apex MLM! We're thrilled to have you as part of our growing community.
            {sponsorName && ` Your sponsor, ${sponsorName}, is here to support you every step of the way.`}
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Access Your Dashboard
            </Button>
          </Section>

          <Text style={text}>
            Here's what you can do next:
          </Text>

          <ul style={list}>
            <li>Complete your profile setup</li>
            <li>Explore our product catalog</li>
            <li>Set up your replicated website</li>
            <li>Connect your Stripe account for payouts</li>
            <li>Start building your team</li>
          </ul>

          <Text style={text}>
            If you have any questions, our support team is here to help at{' '}
            <Link href="mailto:support@apexmlm.com" style={link}>
              support@apexmlm.com
            </Link>
          </Text>

          <Text style={footer}>
            Best regards,
            <br />
            The Apex MLM Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

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

const list = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  paddingLeft: '68px',
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

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 48px',
  marginTop: '24px',
}
