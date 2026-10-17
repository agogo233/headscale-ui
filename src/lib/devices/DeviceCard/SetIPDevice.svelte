<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { getDevices, setDeviceIP } from '$lib/common/apiFunctions.svelte';
	import { alertStore, deviceStore } from '$lib/common/stores.js';
	import { Device } from '$lib/common/classes';

	let ipForm: HTMLFormElement;
	let editIP = false;
	let newIP = '';
	export let device = new Device();

	// IPv4_PATTERN limits the input to four dotted octets; the server validates the
	// address against the configured prefix, reservations and occupants.
	const IPv4_PATTERN = '^\d{1,3}(\.\d{1,3}){3}$';

	// currentIPv4 picks the device's current IPv4 address, if it has one.
	function currentIPv4() {
		for (const address of device.ipAddresses) {
			if (address.includes('.')) {
				return address;
			}
		}
		return '';
	}

	function openEditor() {
		editIP = true;
		newIP = currentIPv4();
	}

	// occupant finds another device that currently uses the entered address.
	// The API reports bare addresses (no /32 suffix), so a plain equality
	// check is correct.
	function occupant() {
		const ip = newIP.trim();
		if (!ip) {
			return null;
		}
		return $deviceStore.find((other) => other.id !== device.id && other.ipAddresses.includes(ip)) ?? null;
	}

	function saveIP() {
		if (!ipForm.reportValidity()) {
			return;
		}

		const other = occupant();
		if (
			other &&
			!window.confirm(
				`The address is currently assigned to ${other.givenName || other.name || `device ${other.id}`}. Saving will swap the addresses of both devices and both will need to reconnect. Continue?`
			)
		) {
			return;
		}

		setDeviceIP(device.id, newIP.trim())
			.then(() => {
				editIP = false;
				// refresh devices after editing
				getDevices();
			})
			.catch((error) => {
				$alertStore = error;
			});
	}
</script>

{#if !editIP}
	<!-- edit symbol -->
	<button type="button" on:click|stopPropagation={() => openEditor()} class="ml-2"
		><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
		</svg></button
	>
{:else}
	<form bind:this={ipForm} on:submit|preventDefault={saveIP} class="flex items-center gap-1">
		<!-- The server validates the address; the pattern only filters obvious non-IPv4 input -->
		<input
			in:slide|global
			on:click|stopPropagation
			bind:value={newIP}
			class="card-input"
			required
			pattern={IPv4_PATTERN}
			placeholder="IPv4 address"
		/>
		<!-- edit accept symbol -->
		<button in:fade|global on:click|stopPropagation class=""
			><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg></button
		>
		<!-- edit cancel symbol -->
		<button type="button" in:fade|global on:click|stopPropagation={() => (editIP = false)}
			><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg></button
		>
		<span class="text-xs opacity-60">the device may need to reconnect</span>
	</form>
{/if}
