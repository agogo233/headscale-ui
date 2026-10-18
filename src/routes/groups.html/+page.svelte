<script lang="ts">
	import { showACLPagesStore } from '$lib/common/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
  	import { getPolicy, updatePolicy, checkPolicy } from '$lib/common/apiFunctions.svelte';
	import { alertStore } from '$lib/common/stores';
	import { t, translate } from '$lib/i18n';

	let componentLoaded = false;
	let policy = '';
	let saving = false;
	let loading = false;
	$: saveLabel = saving ? $t('groups.saving') : $t('groups.savePolicy');

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

	function validatePolicy() {
		checkPolicy(policy)
			.then(() => {
				$alertStore = translate('groups.syntaxValid');
			})
			.catch((error) => {
				$alertStore = translate('groups.validationFailed', { error });
			});
	}

	function savePolicy() {
		saving = true;
		checkPolicy(policy)
			.then(() => {
				return updatePolicy(policy);
			})
			.then((data) => {
				policy = data;
				$alertStore = translate('groups.updatedSuccessfully');
			})
			.catch((error) => {
				$alertStore = error;
			})
			.finally(() => {
				saving = false;
			});
	}
</script>

{#if $showACLPagesStore}
		<div hidden={!componentLoaded} in:fade|global class="px-4 py-4 w-4/5 max-w-screen-lg">
			<h1 class="text-2xl bold text-primary mb-4">{$t('groups.title')}</h1>
			{#if loading}
				<p class="text-secondary">{$t('groups.loading')}</p>
			{:else}
				<textarea
					bind:value={policy}
					class="w-full h-96 font-mono text-sm p-4 bg-base-300 rounded-lg"
					placeholder={$t('groups.policyPlaceholder')}
				></textarea>
			<div class="flex gap-2 mt-4">
				<button class="btn btn-primary" disabled={saving} on:click={savePolicy}>
					{saveLabel}
				</button>
				<button class="btn btn-secondary" on:click={validatePolicy}>{$t('groups.validate')}</button>
				<button class="btn btn-secondary" on:click={loadPolicy}>{$t('groups.reload')}</button>
			</div>
			{/if}
		</div>
	{/if}
