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
		newDeviceKey = $page.url.searchParams.get('nodekey') ?? ''
		newDeviceCardVisible = newDeviceKey.length > 0 ? true : false

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
		{#if $apiTestStore === 'succeeded'}
			<!-- pending login requests (device approvals) -->
			<PendingAuthRequests />

			<!-- instantiate device based components -->
			<table>
				<tr
					><td
						><!-- device creation visibility button -->
						<div class="p-4">
							{#if newDeviceCardVisible == false}
								<button on:click={() => (newDeviceCardVisible = true)} class="btn btn-primary btn-xs capitalize" type="button">{$t('devices.newDevice')}</button>
							{:else}
								<button on:click={() => (newDeviceCardVisible = false)} class="btn btn-secondary btn-xs capitalize" type="button">{$t('devices.hideNewDevice')}</button>
							{/if}
						</div></td
					><td><SortDevices /></td><td><SearchDevices /></td></tr
				>
			</table>

			<CreateDevice bind:newDeviceCardVisible bind:newDeviceKey />

			<div class="flex flex-col gap-2">
				{#each $deviceStore as device (device.id)}
					{#if $deviceFilterStore.includes(device)}
						<DeviceCard {device} />
					{/if}
				{/each}
			</div>
		{/if}
		{#if $apiTestStore === 'failed'}
			<div in:fade|global class="max-w-lg  mx-auto p-4 border-4 text-sm text-base-content shadow-lg text-center">
				<p>{$t('common.apiFailedTitle')}<br />{$t('common.apiFailedDetail')}<br />{$t('common.apiFailedHint')}<a href="{base}/settings.html" class="link link-primary">{$t('common.settingsPage')}</a>{$t('common.apiFailedHintEnd')}</p>
			</div>
		{/if}
	</div>
{/if}
