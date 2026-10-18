<script lang="ts">
	import { getAPIKeys, expireAPIKey, deleteAPIKey } from '$lib/common/apiFunctions.svelte';
	import { APIKey } from '$lib/common/classes';
	import { alertStore } from '$lib/common/stores';
	import { onMount } from 'svelte';
	import { t, translate } from '$lib/i18n';

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
		if (!confirm(translate('settings.deleteConfirm'))) return;
		deleteAPIKey(prefix)
			.then(() => {
				loadKeys();
			})
			.catch((error) => {
				$alertStore = error;
			});
	}

	function formatDate(date: string): string {
		if (!date) return translate('common.never');
		const parsed = new Date(date);
		// Keys created without an expiration are zero-stamped by the backend,
		// which treats the zero instant as already expired.
		if (parsed.getFullYear() <= 1) return translate('common.expired');
		return parsed.toLocaleString();
	}

	onMount(loadKeys);
</script>

<div class="mt-4">
	<h2 class="text-xl font-bold text-primary mb-2">{$t('settings.apiKeys')}</h2>
	{#if loading}
		<p class="text-secondary">{$t('settings.loading')}</p>
	{:else if keyList.length === 0}
		<p class="text-secondary">{$t('settings.noKeys')}</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-compact w-full">
				<thead>
					<tr>
						<th>{$t('settings.prefix')}</th>
						<th>{$t('settings.created')}</th>
						<th>{$t('settings.expires')}</th>
						<th>{$t('common.lastSeen')}</th>
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
								<button class="btn btn-xs btn-warning" on:click={() => expireKey(key.prefix)}>{$t('settings.expire')}</button>
								<button class="btn btn-xs btn-error" on:click={() => deleteKey(key.prefix)}>{$t('common.delete')}</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
	<button class="btn btn-sm btn-primary mt-2" on:click={loadKeys}>{$t('common.refresh')}</button>
</div>
