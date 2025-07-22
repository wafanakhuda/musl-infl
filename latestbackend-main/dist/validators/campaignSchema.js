"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignSchema = void 0;
const zod_1 = require("zod");
exports.campaignSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    category: zod_1.z.string().optional(),
    campaign_type: zod_1.z.string(),
    deliverables: zod_1.z.string(),
    budget_min: zod_1.z.number().nonnegative(),
    budget_max: zod_1.z.number().nonnegative(),
    deadline: zod_1.z.string(),
    start_date: zod_1.z.string().optional(),
    end_date: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    age_range: zod_1.z.string().optional(),
    language: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    niche: zod_1.z.string().optional(),
    platform: zod_1.z.string().optional(),
    followers_min: zod_1.z.number().optional(),
    followers_max: zod_1.z.number().optional(),
    influencers_needed: zod_1.z.number().optional(),
    requirements: zod_1.z.string().optional(),
    target_audience: zod_1.z.array(zod_1.z.string()).optional(),
});
