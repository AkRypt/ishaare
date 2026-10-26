import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { addPurchasedTopic } from '@/utils/firebase/users'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')

  try {
    const event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret)

    if (event.type === 'checkout.session.completed') {
      try {
        const session = event.data.object as Stripe.Checkout.Session
        const topicId = parseInt(session.metadata?.topic_id ?? '', 10)
        const custEmail = session.customer_details?.email

        if (!custEmail || Number.isNaN(topicId)) {
          console.error('Missing email or topic_id on checkout session')
          return NextResponse.json({ status: 'Failed', error: 'Missing metadata' })
        }

        await addPurchasedTopic(custEmail, topicId)
      } catch (error) {
        console.error(error)
        return NextResponse.json({ status: 'Failed', error })
      }
    }

    return NextResponse.json({
      status: 'Success',
      eventType: event.type,
    })
  } catch (err: unknown) {
    console.log('err:', err)
    return NextResponse.json({ status: 'Failed', err })
  }
}
