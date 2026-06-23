<script lang="ts">
	import { showACLPagesStore } from '$lib/common/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getPolicy, updatePolicy } from '$lib/common/apiFunctions.svelte';
	import { alertStore } from '$lib/common/stores';

	let componentLoaded = false;
	let policy = '';
	let saving = false;
	let loading = false;

	onMount(async () => {
		componentLoaded = true;
		loadPolicy();
	});

	function loadPolicy() {
		loading = true;
		getPolicy()
			.then((data) => {
				policy = data;
			})
			.catch((error) => {
				$alertStore = error;
			})
			.finally(() => {
				loading = false;
			});
	}

	function savePolicy() {
		saving = true;
		updatePolicy(policy)
			.then((data) => {
				policy = data;
				$alertStore = 'Policy updated successfully';
			})
			.catch((error) => {
				$alertStore = error;
			})
			.finally(() => {
				saving = false;
			});
	}
</script>

<body>
	{#if showACLPagesStore}
		<div hidden={!componentLoaded} in:fade|global class="px-4 py-4 w-4/5 max-w-screen-lg">
			<h1 class="text-2xl bold text-primary mb-4">ACL Policy</h1>
			{#if loading}
				<p class="text-secondary">Loading policy...</p>
			{:else}
				<textarea
					bind:value={policy}
					class="w-full h-96 font-mono text-sm p-4 bg-base-300 rounded-lg"
					placeholder="Enter ACL policy in HuJSON format..."
				></textarea>
				<div class="flex gap-2 mt-4">
					<button class="btn btn-primary" disabled={saving} on:click={savePolicy}>
						{#if saving}Saving...{:else}Save Policy{/if}
					</button>
					<button class="btn btn-secondary" on:click={loadPolicy}>Reload</button>
				</div>
			{/if}
		</div>
	{/if}
</body>
