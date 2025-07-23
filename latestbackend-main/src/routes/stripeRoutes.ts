// src/routes/stripeRoutes.ts
import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { wrapAsync } from '../utils/wrapAsync'
import bodyParser from 'body-parser'

const router = Router()

// Required for webhook: raw body parser
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Lazy load stripe to avoid initialization errors
      const { stripe } = await import('../lib/stripe')
      
      const sig = req.headers['stripe-signature']
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

      let event

      try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret)
      } catch (err) {
        if (err instanceof Error) {
          res.status(400).send(`Webhook Error: ${err.message}`)
        } else {
          res.status(400).send('Webhook Error: Unknown error')
        }
        return
      }

      if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object as any
        const metadata = intent.metadata || {}
        const creatorId = metadata.creatorId
        const campaignId = metadata.campaignId

        await prisma.transaction.create({
    data: {
      amount: Math.round(intent.amount_received / 100),
      status: 'succeeded',
      creatorId: creatorId || '',
      created_at: new Date(),
    },
  })

      }

      res.status(200).send('Webhook received')
    } catch (error) {
      console.error('Stripe webhook error:', error)
      res.status(500).send('Internal server error')
    }
  }
)

// Create a PaymentIntent
router.post(
  '/payment-intent',
  wrapAsync(async (req: Request, res: Response) => {
    try {
      // Lazy load stripe to avoid initialization errors
      const { stripe } = await import('../lib/stripe')
      
      const { amount, currency = 'usd', creatorId, campaignId } = req.body

      if (!amount || !creatorId || !campaignId) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata: {
          creatorId,
          campaignId,
        },
      })

      res.json({ clientSecret: intent.client_secret })
    } catch (error) {
      console.error('Payment intent creation error:', error)
      res.status(500).json({ error: 'Failed to create payment intent' })
    }
  })
)

export default router