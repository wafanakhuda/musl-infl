"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = require("../lib/stripe");
const prisma_1 = __importDefault(require("../lib/prisma"));
const wrapAsync_1 = require("../utils/wrapAsync");
const body_parser_1 = __importDefault(require("body-parser"));
const router = (0, express_1.Router)();
router.post('/webhook', body_parser_1.default.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
        else {
            res.status(400).send('Webhook Error: Unknown error');
        }
        return;
    }
    if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object;
        const metadata = intent.metadata || {};
        const creatorId = metadata.creatorId;
        const campaignId = metadata.campaignId;
        await prisma_1.default.transaction.create({
            data: {
                amount: Math.round(intent.amount_received / 100),
                status: 'succeeded',
                creatorId: creatorId || '',
                created_at: new Date(),
            },
        });
    }
    res.status(200).send('Webhook received');
});
router.post('/payment-intent', (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    const { amount, currency = 'usd', creatorId, campaignId } = req.body;
    if (!amount || !creatorId || !campaignId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const intent = await stripe_1.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata: {
            creatorId,
            campaignId,
        },
    });
    res.json({ clientSecret: intent.client_secret });
}));
exports.default = router;
