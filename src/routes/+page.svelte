<script lang="ts">
	import { IPAMapping } from '$lib/reform/reform';
	import { Root, Textarea } from '$lib/components/ui/textarea';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Card from '$lib/components/ui/card';

	let sentence = $state('');

	let reformed = $state('');

	async function reform(sentence: string) {
		const response = await fetch('/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				sentence
			})
		});
		return response.json();
	}
</script>

<div class="grid h-full w-full place-items-center font-bold">
	<Card.Root class="container max-w-lg">
		<Card.Header class="text-lg">English Spelling Reform</Card.Header>

		<Card.Content>
			<Textarea
				name="sentence"
				class="h-40"
				placeholder="According to all laws of aviation, there is no way a bee should be able to fly."
				bind:value={sentence}
				onkeydown={async (e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						e.stopPropagation();
						reformed = await reform(sentence);
					}
				}}
			></Textarea>
		</Card.Content>

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
	</Card.Root>
</div>
