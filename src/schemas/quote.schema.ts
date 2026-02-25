import { z } from 'zod';

export const QUOTE_TYPES = ['fixed', 'estimate_range', 'hourly', 'call_for_quote'] as const;

export const SubmitQuoteSchema = z.object({
  quote_type: z.enum(QUOTE_TYPES),
  price_fixed: z.number().int().min(100).optional(),
  price_min: z.number().int().min(100).optional(),
  price_max: z.number().int().min(100).optional(),
  hourly_rate: z.number().int().min(100).optional(),
  is_gst_included: z.boolean().default(false),
  scope_notes: z.string().trim().min(20).max(3000).optional(),
  inclusions: z.string().trim().max(1000).optional(),
  exclusions: z.string().trim().max(1000).optional(),
  timeline_days: z.number().int().min(1).max(730).optional(),
  warranty_months: z.number().int().min(0).max(120).optional(),
}).refine(
  (data) => {
    switch (data.quote_type) {
      case 'fixed':
        return data.price_fixed !== undefined;
      case 'estimate_range':
        return data.price_min !== undefined && data.price_max !== undefined;
      case 'hourly':
        return data.hourly_rate !== undefined;
      case 'call_for_quote':
        return true;
    }
  },
  { message: 'Price fields do not match quote type', path: ['quote_type'] }
);

export type SubmitQuoteInput = z.infer<typeof SubmitQuoteSchema>;
