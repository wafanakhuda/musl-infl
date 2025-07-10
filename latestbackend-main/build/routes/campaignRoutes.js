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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const campaignSchema_1 = require("../validators/campaignSchema");
const campaignService_1 = require("../services/campaignService");
const router = (0, express_1.Router)();
// GET /campaigns
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { creator_id, limit } = req.query;
        const campaigns = yield (0, campaignService_1.getAllCampaigns)(creator_id === null || creator_id === void 0 ? void 0 : creator_id.toString(), limit ? parseInt(limit.toString()) : undefined);
        res.json(campaigns);
    }
    catch (err) {
        console.error('Error fetching campaigns:', err);
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
}));
// GET /campaigns/:id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield (0, campaignService_1.getCampaignById)(req.params.id);
        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }
        res.json(campaign);
    }
    catch (err) {
        console.error('Error retrieving campaign:', err);
        res.status(500).json({ error: 'Error retrieving campaign' });
    }
}));
// POST /campaigns (brand only)
router.post('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user || user.user_type !== 'brand') {
        res.status(403).json({ error: 'Only brands can create campaigns' });
        return;
    }
    const parsed = campaignSchema_1.campaignSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            error: 'Invalid campaign data',
            details: parsed.error.flatten(),
        });
        return;
    }
    try {
        const campaign = yield (0, campaignService_1.createCampaign)(user.id, parsed.data);
        res.status(201).json(campaign);
    }
    catch (err) {
        console.error('Error creating campaign:', err);
        res.status(500).json({ error: 'Failed to create campaign' });
    }
}));
// PUT /campaigns/:id
router.put('/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield (0, campaignService_1.updateCampaign)(req.params.id, req.body);
        res.json(campaign);
    }
    catch (err) {
        console.error('Error updating campaign:', err);
        res.status(400).json({ error: err.message });
    }
}));
// DELETE /campaigns/:id
router.delete('/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, campaignService_1.deleteCampaign)(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting campaign:', err);
        res.status(400).json({ error: err.message });
    }
}));
// POST /campaigns/:id/apply (creator only)
router.post('/:id/apply', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user || user.user_type !== 'creator') {
        res.status(403).json({ error: 'Only creators can apply to campaigns' });
        return;
    }
    try {
        const application = yield (0, campaignService_1.applyToCampaign)(req.params.id, user.id, user.id);
        res.json({ message: 'Applied successfully', application });
    }
    catch (err) {
        console.error('Error applying to campaign:', err);
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;
