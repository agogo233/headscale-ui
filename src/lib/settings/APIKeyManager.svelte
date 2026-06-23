<script lang="ts">
	import { getAPIKeys, expireAPIKey, deleteAPIKey } from '$lib/common/apiFunctions.svelte';
	import { APIKey } from '$lib/common/classes';
	import { alertStore } from '$lib/common/stores';

	let keyList = [new APIKey()];
	let loading = false;

	function loadKeys() {
		loading = true;
		getAPIKeys()
			.then((keys) => {
				keyList = keys;
			})
			.catch((error) => {
				$alertStore = error;
			})
			.finally(() => {
				loading = false;
			});
	}

	function expireKey(prefix: string) {
		expireAPIKey(prefix)
			.then(() => {
				loadKeys();
			})
			.catch((error) => {
				$alertStore = error;
			});
	}

	function deleteKey(prefix: string) {
		if (!confirm('Delete this API key? This cannot be undone.')) return;
		deleteAPIKey(prefix)
			.then(() => {
				loadKeys();
			})
			.catch((error) => {
				$alertStore = error;
			});
	}

	function formatDate(date: string): string {
		if (!date) return 'Never';
		return new Date(date).toLocaleString();
	}

	loadKeys();
</script>

<div class="mt-4">
	<h2 class="text-xl font-bold text-primary mb-2">API Keys</h2>
	{#if loading}
		<p class="text-secondary">Loading...</p>
	{:else if keyList.length === 0}
		<p class="text-secondary">No API keys found.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-compact w-full">
				<thead>
					<tr>
						<th>Prefix</th>
						<th>Created</th>
						<th>Expires</th>
						<th>Last Seen</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each keyList as key}
						<tr>
							<td class="font-mono">{key.prefix}</td>
							<td>{formatDate(key.createdAt)}</td>
							<td>{formatDate(key.expiration)}</td>
							<td>{formatDate(key.lastSeen)}</td>
							<td class="flex gap-2">
								<button class="btn btn-xs btn-warning" on:click={() => expireKey(key.prefix)}>Expire</button>
								<button class="btn btn-xs btn-error" on:click={() => deleteKey(key.prefix)}>Delete</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
	<button class="btn btn-sm btn-primary mt-2" on:click={loadKeys}>Refresh</button>
</div>
