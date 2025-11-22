import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter sensitive data on server
  beforeSend(event, _hint) {
    // Remove sensitive data from request
    if (event.request?.data) {
      const data = event.request.data as Record<string, unknown>
      delete data.password
      delete data.ssn
      delete data.tax_id
      delete data.stripe_secret
      delete data.supabase_key
    }

    // Remove PII from extra data
    if (event.extra) {
      delete event.extra.password
      delete event.extra.ssn
      delete event.extra.tax_id
      delete event.extra.supabase_key
    }

    // Remove sensitive environment variables
    if (event.contexts?.runtime?.env) {
      const env = event.contexts.runtime.env as Record<string, unknown>
      delete env.SUPABASE_SERVICE_ROLE_KEY
      delete env.STRIPE_SECRET_KEY
      delete env.RESEND_API_KEY
    }

    return event
  },
})
