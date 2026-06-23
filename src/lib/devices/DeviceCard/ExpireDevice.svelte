<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getDevices, expireDevice } from '$lib/common/apiFunctions.svelte';
	import { deviceStore, alertStore } from '$lib/common/stores.js';
	import { Device } from '$lib/common/classes';

	export let device = new Device();
	let cardExpiring = false;

	function expireDeviceAction() {
		expireDevice(device.id, true)
			.then(() => {
				cardExpiring = false;
				getDevices();
			})
			.catch((error) => {
				$alertStore = error;
			});
	}
</script>

{#if !cardExpiring}
	<button on:click|stopPropagation={() => (cardExpiring = true)} class="mr-4" title="Expire Device">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	</button>
{:else}
	<span in:fade|global class="font-bold text-red-400">Expire {device.name}? Confirm </span>
	<button in:fade|global on:click|stopPropagation={() => expireDeviceAction()}>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	</button>
	<span in:fade|global class="font-bold text-red-400">or Cancel </span>
	<button in:fade|global on:click|stopPropagation={() => (cardExpiring = false)} class="mr-4">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	</button>
{/if}
