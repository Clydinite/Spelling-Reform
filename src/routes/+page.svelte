<script lang="ts">
	import { IPAMapping } from '$lib/reform/reform';

	import { Textarea } from '$lib/components/ui/textarea';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form/index.js';
	import { formSchema, type FormSchema } from '$lib/schema';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import * as Table from "$lib/components/ui/table/index.js"

	let sentence = $state('');
	let reformed = $state('');

	let { data, form } = $props();

	const superform = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = superform; // object destructuring then renaming

	$effect(() => {
		console.log('form', form, 'data', data);
		reformed = form?.result || '';
	});	
</script>

<form class="grid h-full w-full place-items-center font-bold" method="POST" use:enhance>
	<Card.Root class="container max-w-lg">
		<Card.Header class="text-lg">English Spelling Reform</Card.Header>

		<Card.Content>
			<!-- form -->
			<Form.Field form={superform} name="text">
				<Form.Control>
					{#snippet children({ props })}
						<Textarea
							{...props}
							class="h-40"
							placeholder="According to all laws of aviation, there is no way a bee should be able to fly."
							bind:value={$formData.text}
						></Textarea>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>

		<Card.Content><Form.Button class="w-full" type="submit">Reform</Form.Button></Card.Content>

		<Card.Content
			><Textarea name="reformed" class="h-40" bind:value={reformed}></Textarea></Card.Content
		>

		<Accordion.Root>
			<Accordion.Item value="item-1">
				<Accordion.Trigger>IPA Mapping</Accordion.Trigger>
				<Accordion.Content>
					
						

			
					{#each Object.entries(IPAMapping) as [symbol, letter]}
						<p>{symbol}: {letter}</p>
					{/each}
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>

		<!-- {#if browser}
			<SuperDebug data={$formData} />
		{/if} -->
	</Card.Root>
</form>
