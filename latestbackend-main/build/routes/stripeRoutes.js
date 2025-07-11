"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/stripeRoutes.ts
const express_1 = require("express");
const stripe_1 = require("../lib/stripe");
const prisma_1 = __importDefault(require("../lib/prisma"));
const wrapAsync_1 = require("../utils/wrapAsync");
const body_parser_1 = __importDefault(require("body-parser"));
const router = (0, express_1.Router)();
// Required for webhook: raw body parser
router.post('/webhook', body_parser_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield prisma_1.default.transaction.create({
            data: {
                amount: Math.round(intent.amount_received / 100),
                status: 'succeeded',
                creatorId: creatorId || '',
                created_at: new Date(),
            },
        });
    }
    res.status(200).send('Webhook received');
}));
// Create a PaymentIntent
router.post('/payment-intent', (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency = 'usd', creatorId, campaignId } = req.body;
    if (!amount || !creatorId || !campaignId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const intent = yield stripe_1.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata: {
            creatorId,
            campaignId,
        },
    });
    res.json({ clientSecret: intent.client_secret });
})));
exports.default = router;
