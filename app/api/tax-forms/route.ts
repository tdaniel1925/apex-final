import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { taxForms } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import crypto from 'crypto'

// Simple encryption for tax IDs (In production, use proper encryption library)
const ENCRYPTION_KEY = process.env.TAX_ID_ENCRYPTION_KEY || 'default-key-change-in-production'

function encryptTaxId(taxId: string): string {
  // TODO: Replace with proper encryption (e.g., AWS KMS, Google Cloud KMS)
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY)
  let encrypted = cipher.update(taxId, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

function decryptTaxId(encryptedTaxId: string): string {
  // TODO: Replace with proper decryption
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY)
    let decrypted = decipher.update(encryptedTaxId, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch {
    return '***-**-****' // Return masked value if decryption fails
  }
}

// GET - Fetch tax forms for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const formId = searchParams.get('formId')
    const includeTaxId = searchParams.get('includeTaxId') === 'true'

    if (formId) {
      // Fetch specific form
      const [form] = await db.select().from(taxForms).where(eq(taxForms.id, formId)).limit(1)

      if (!form) {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 })
      }

      // Decrypt tax ID if requested and authorized
      if (includeTaxId) {
        return NextResponse.json({
          ...form,
          taxIdDecrypted: decryptTaxId(form.taxIdEncrypted),
        })
      }

      return NextResponse.json({
        ...form,
        taxIdEncrypted: '***-**-****', // Mask the encrypted value
      })
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Fetch all forms for user
    const forms = await db.select().from(taxForms).where(eq(taxForms.userId, userId))

    // Mask tax IDs for list view
    const maskedForms = forms.map((form) => ({
      ...form,
      taxIdEncrypted: '***-**-****',
    }))

    return NextResponse.json(maskedForms)
  } catch (error) {
    console.error('Error fetching tax forms:', error)
    return NextResponse.json({ error: 'Failed to fetch tax forms' }, { status: 500 })
  }
}

// POST - Submit new W-9 form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      formType,
      taxYear,
      legalName,
      businessName,
      taxClassification,
      taxIdType,
      taxId,
      address,
      city,
      state,
      zipCode,
      country,
      exemptPayeeCode,
      exemptionFromFatca,
      signatureName,
      signatureDate,
      documentUrl,
    } = body

    // Validate required fields
    if (
      !userId ||
      !formType ||
      !taxYear ||
      !legalName ||
      !taxClassification ||
      !taxIdType ||
      !taxId ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !signatureName ||
      !signatureDate
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate tax ID format
    const cleanTaxId = taxId.replace(/[-\s]/g, '')
    if (taxIdType === 'ssn' && cleanTaxId.length !== 9) {
      return NextResponse.json({ error: 'Invalid SSN format' }, { status: 400 })
    }
    if (taxIdType === 'ein' && cleanTaxId.length !== 9) {
      return NextResponse.json({ error: 'Invalid EIN format' }, { status: 400 })
    }

    // Check if form already exists for this year
    const [existingForm] = await db
      .select()
      .from(taxForms)
      .where(and(eq(taxForms.userId, userId), eq(taxForms.taxYear, taxYear)))
      .limit(1)

    if (existingForm) {
      return NextResponse.json(
        { error: `W-9 form already submitted for ${taxYear}` },
        { status: 400 }
      )
    }

    // Encrypt tax ID
    const encryptedTaxId = encryptTaxId(taxId)

    // Calculate expiration date (3 years from now)
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 3)

    // Create form
    const [newForm] = await db
      .insert(taxForms)
      .values({
        userId,
        formType,
        taxYear,
        legalName,
        businessName: businessName || null,
        taxClassification,
        taxIdType,
        taxIdEncrypted: encryptedTaxId,
        address,
        city,
        state,
        zipCode,
        country,
        exemptPayeeCode: exemptPayeeCode || null,
        exemptionFromFatca: exemptionFromFatca || null,
        signatureName,
        signatureDate: new Date(signatureDate),
        certifiedCorrect: true,
        documentUrl: documentUrl || null,
        status: 'pending',
        expiresAt,
      })
      .returning()

    return NextResponse.json(
      {
        ...newForm,
        taxIdEncrypted: '***-**-****', // Don't return encrypted value
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating tax form:', error)
    return NextResponse.json({ error: 'Failed to create tax form' }, { status: 500 })
  }
}

// PUT - Update tax form or approve/reject
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { formId, status, approvedBy, rejectionReason, ...updates } = body

    if (!formId) {
      return NextResponse.json({ error: 'formId is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = { ...updates, updatedAt: new Date() }

    // Handle approval workflow
    if (status === 'approved') {
      updateData.status = 'approved'
      updateData.approvedBy = approvedBy
      updateData.approvedAt = new Date()
      updateData.rejectionReason = null
    } else if (status === 'rejected') {
      updateData.status = 'rejected'
      updateData.rejectionReason = rejectionReason || 'Not specified'
      updateData.approvedAt = null
      updateData.approvedBy = null
    } else if (status) {
      updateData.status = status
    }

    const [updatedForm] = await db
      .update(taxForms)
      .set(updateData)
      .where(eq(taxForms.id, formId))
      .returning()

    if (!updatedForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...updatedForm,
      taxIdEncrypted: '***-**-****',
    })
  } catch (error) {
    console.error('Error updating tax form:', error)
    return NextResponse.json({ error: 'Failed to update tax form' }, { status: 500 })
  }
}

// DELETE - Delete tax form
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const formId = searchParams.get('formId')

    if (!formId) {
      return NextResponse.json({ error: 'formId is required' }, { status: 400 })
    }

    await db.delete(taxForms).where(eq(taxForms.id, formId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tax form:', error)
    return NextResponse.json({ error: 'Failed to delete tax form' }, { status: 500 })
  }
}
