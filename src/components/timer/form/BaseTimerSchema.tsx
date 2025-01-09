import { z } from 'zod';
import { TIMER_TYPE } from '../../../config/timer/type';

export const baseTimerSchema = z.object({
    title: z.string().optional(),
    time: z.number().min(1).max(60),
    isMinutes: z.boolean(),
    pointColorIndex: z.number().min(0).max(7),
    type: z.literal(TIMER_TYPE.BASE),
});

export type BaseTimerFormData = z.infer<typeof baseTimerSchema>;
