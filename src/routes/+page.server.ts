// spelling reform
import data from '$lib/reform/data.json';
import { IPAMapping } from '$lib/reform/reform.js';

// forms and validation
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';

const IPARegex = new RegExp(
	Object.keys(IPAMapping)
		.sort((a, b) => b.length - a.length)
		.join('|'),
	'g'
);

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		let sentence: string = '';

		try {
			const body = form.data.text;

			sentence =
				body || 'According to all laws of aviation, there is no way a bee should be able to fly.';

			const reformed = sentence.replace(/\b[A-Za-z]+(?:'[a-z]+)?\b/g, (word) => {
				const isUpperCase = word[0] === word[0].toUpperCase();

				let IPA = (data as Record<string, string>)[word.toLowerCase()];

				if (!IPA) return `[${word}]`;

				IPA = IPA.split(',')[0]; // use the first pronunciation
				IPA = IPA.slice(1, -1); // /a/ -> a
				IPA = IPA.replace(/ˌ/g, ''); // remove secondary stress
				IPA = IPA.replace(/^ˈ/g, ''); // remove primary stress if it is at the start of the word

				let reformedWord = IPA.replace(IPARegex, (match) => IPAMapping[match]);

				if (isUpperCase) {
					reformedWord = reformedWord[0].toUpperCase() + reformedWord.slice(1);
				}

				return reformedWord;
			});

			console.log('reformed', reformed);
			console.log('form', form);

			return { form, result: reformed };

		} catch (error) {
			console.error(error);
		}

		return { form, result: sentence };
	}
} satisfies Actions;
