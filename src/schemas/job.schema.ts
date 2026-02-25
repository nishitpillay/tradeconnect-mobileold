import { z } from 'zod';

export const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;
export const JOB_URGENCY = ['emergency', 'within_48h', 'this_week', 'this_month', 'flexible'] as const;
export const PROPERTY_TYPES = ['house', 'apartment', 'townhouse', 'commercial', 'land', 'other'] as const;

const CreateJobBaseObject = z.object({
  category_id: z.string().uuid('Invalid category ID'),
  subcategory_id: z.string().uuid('Invalid subcategory ID').optional(),
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(5000),
  urgency: z.enum(JOB_URGENCY).default('flexible'),
  property_type: z.enum(PROPERTY_TYPES).optional(),
  suburb: z.string().trim().min(2).max(100),
  postcode: z.string().trim().regex(/^\d{4}$/, 'Postcode must be a 4-digit Australian postcode'),
  state: z.enum(AU_STATES),
  exact_address: z.string().trim().min(5).max(300).optional(),
  budget_min: z.number().int().min(100).max(10_000_000).optional(),
  budget_max: z.number().int().min(100).max(10_000_000).optional(),
  budget_is_gst: z.boolean().default(false),
  preferred_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  preferred_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time_window_notes: z.string().trim().max(500).optional(),
  publish: z.boolean().default(false),
});

export const CreateJobSchema = CreateJobBaseObject.refine(
  (data) => {
    if (data.budget_min !== undefined && data.budget_max !== undefined) {
      return data.budget_min <= data.budget_max;
    }
    return true;
  },
  { message: 'Minimum budget must be less than or equal to maximum budget', path: ['budget_min'] }
).refine(
  (data) => {
    if (data.publish && !data.exact_address) return false;
    return true;
  },
  { message: 'Exact address is required when publishing a job', path: ['exact_address'] }
);

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
