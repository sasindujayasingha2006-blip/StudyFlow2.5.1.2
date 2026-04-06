import { z } from 'zod';

export const studyLogSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  topicId: z.string().min(1, "Topic is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  focusLevel: z.number().min(1).max(5),
  notes: z.string().optional(),
});

export type StudyLogInput = z.infer<typeof studyLogSchema>;

export const subjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  image: z.string().url("Invalid image URL").optional().or(z.literal('')),
});

export type SubjectInput = z.infer<typeof subjectSchema>;
