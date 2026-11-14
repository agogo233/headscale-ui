<!-- typescript -->
<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { getDevices, getUsers, getHealth } from '$lib/common/apiFunctions.svelte';
	import { apiTestStore, deviceFilterStore, deviceStore } from '$lib/common/stores.js';
	import CreateDevice from '$lib/devices/CreateDevice.svelte';
	import DeviceCard from '$lib/devices/DeviceCard.svelte';
	import PendingAuthRequests from '$lib/devices/PendingAuthRequests.svelte';
	import SearchDevices from '$lib/devices/SearchDevices.svelte';
	import SortDevices from '$lib/devices/SortDevices.svelte';
	import EmptyState from '$lib/common/EmptyState.svelte';
	import SkeletonCard from '$lib/common/SkeletonCard.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t, translate } from '$lib/i18n';

	let newDeviceKey = '';

	let newDeviceCardVisible = false;

	//
	// Component Variables
	//

	// let's the page know if it's ready to load
	let componentLoaded = false;
	let healthStatus = '';

	// We define the meat of our script in onMount as doing so forces client side rendering.
	// Doing so also does not perform any actions until components are initialized
	onMount(async () => {
		// Handle nodekey
		newDeviceKey = $page.url.searchParams.get('nodekey') ?? '';
		newDeviceCardVisible = newDeviceKey.length > 0 ? true : false;

		// aggregate the parallel loads: either failing means the page is not usable
		Promise.allSettled([getUsers(), getDevices()]).then((results) => {
			const allOk = results.every((r) => r.status === 'fulfilled');
			apiTestStore.set(allOk ? 'succeeded' : 'failed');
		});
		// check health status
		getHealth()
			.then((data) => {
				healthStatus = data.databaseConnectivity ? translate('common.healthy') : translate('common.unknown');
			})
			.catch(() => {
				healthStatus = translate('common.unreachable');
			});
		// load the page
		componentLoaded = true;
	});
</script>

<!-- html -->
{#if componentLoaded}
	<div in:fade|global>
		<div in:fade|global class="px-4 pt-4">
			<h1 class="text-2xl bold text-primary">{$t('devices.view')}</h1>
			{#if healthStatus !== ''}
				<p class="text-sm text-secondary">{$t('devices.server', { status: healthStatus })}</p>
			{/if}
		</div>
		{#if $apiTestStore === ''}
			<!-- loading skeletons -->
			<div class="flex flex-col gap-2 py-2">
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
			</div>
		{/if}
		{#if $apiTestStore === 'succeeded'}
			<!-- pending login requests (device approvals) -->
			<PendingAuthRequests />

			<!-- toolbar -->
			<div class="px-4 py-3 flex flex-wrap items-center gap-2">
				<button on:click={() => (newDeviceCardVisible = true)} class="btn btn-primary btn-sm capitalize" type="button">{$t('devices.newDevice')}</button>
				<div class="grow"></div>
				<SortDevices />
				<SearchDevices />
			</div>

			<CreateDevice bind:newDeviceCardVisible bind:newDeviceKey />

			{#if $deviceStore.length === 0}
				<EmptyState title={$t('devices.emptyTitle')} description={$t('devices.emptyDescription')}>
					<button type="button" class="btn btn-primary btn-sm capitalize" on:click={() => (newDeviceCardVisible = true)}>{$t('devices.newDevice')}</button>
				</EmptyState>
			{:else if $deviceFilterStore.length === 0}
				<EmptyState title={$t('common.noMatches')} />
			{:else}
				<!-- instantiate device based components -->
				<div class="flex flex-col gap-2">
					{#each $deviceStore as device (device.id)}
						{#if $deviceFilterStore.includes(device)}
							<DeviceCard {device} />
						{/if}
					{/each}
				</div>
			{/if}
		{/if}
		{#if $apiTestStore === 'failed'}
			<div in:fade|global class="max-w-lg mx-auto mt-8 px-4">
				<div class="alert alert-error shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<span>{$t('common.apiFailedTitle')}</span>
				</div>
				<p class="mt-3 text-center text-sm text-base-content/70">
					{$t('common.apiFailedDetail')}<br />{$t('common.apiFailedHint')}<a href="{base}/settings.html" class="link link-primary">{$t('common.settingsPage')}</a>{$t('common.apiFailedHintEnd')}
				</p>
			</div>
		{/if}
	</div>
{/if}
