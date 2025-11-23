import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { taxForms } from '@/lib/db/schema/replicated-sites'
import { eq } from 'drizzle-orm'

export async function PUT(request: NextRequest) {
  try {
    const { formId, status, rejectionReason } = await request.json()

    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Validate input
    if (!formId || !status) {
      return NextResponse.json(
        { error: 'Form ID and status are required' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update the tax form
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (status === 'approved') {
      updateData.approvedAt = new Date()
      // updateData.approvedBy = session.user.id
    }

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    const [updatedForm] = await db
      .update(taxForms)
      .set(updateData)
      .where(eq(taxForms.id, formId))
      .returning()

    if (!updatedForm) {
      return NextResponse.json({ error: 'Tax form not found' }, { status: 404 })
    }

    // TODO: Send notification to distributor
    // await sendTaxFormStatusNotification(updatedForm.userId, status, rejectionReason)

    return NextResponse.json({
      message: `Tax form ${status} successfully`,
      form: updatedForm,
    })
  } catch (error) {
    console.error('Error updating tax form:', error)
    return NextResponse.json(
      { error: 'Failed to update tax form' },
      { status: 500 }
    )
  }
}
