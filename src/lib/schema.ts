import { z } from 'zod';

export const formSchema = z.object({
	text: z
		.string()
		.min(1, { message: 'At least one character is required. What can you do without one?' })
		.max(1000, { message: "Ain't reforming the whole world with a single request, are we?" }),
	ipa: z.array(
		z
			.string()
			.min(0)
			.max(10, {
				message: 'That is way too long. People would be dead when they finish writing that. '
			})
	).max(50)
});

export type FormSchema = typeof formSchema;
