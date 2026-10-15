<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getPendingAuthRequests, approveAuth, rejectAuth, getDevices } from '$lib/common/apiFunctions.svelte';
	import { PendingAuthRequest } from '$lib/common/classes';
	import { alertStore } from '$lib/common/stores.js';

	let pendingRequests: PendingAuthRequest[] = [];
	let loading = true;
	let loadFailed = false;
	let busyId = '';

	// returns the request creation time in local time
	function formatTime(date: string) {
		if (!date) {
			return '';
		}

		return new Date(date).toLocaleString();
	}

	function loadPending() {
		loading = true;
		getPendingAuthRequests()
			.then((requests) => {
				pendingRequests = requests ?? [];
				loadFailed = false;
			})
			.catch((error) => {
				loadFailed = true;
				$alertStore = error;
			})
			.finally(() => {
				loading = false;
			});
	}

	function approveRequest(authId: string) {
		if (busyId != '') {
			return;
		}

		busyId = authId;
		approveAuth(authId)
			.then(() => {
				// refresh the pending list and the device list (the approved node shows up)
				getDevices();
				loadPending();
			})
			.catch((error) => {
				$alertStore = error;
			})
			.finally(() => {
				busyId = '';
			});
	}

	function rejectRequest(authId: string) {
		if (busyId != '') {
			return;
		}

		busyId = authId;
		rejectAuth(authId)
			.then(() => {
				loadPending();
			})
			.catch((error) => {
				$alertStore = error;
			})
			.finally(() => {
				busyId = '';
			});
	}

	onMount(() => {
		loadPending();
	});
</script>

<div in:fade|global class="mb-4">
	<h2 class="text-xl font-bold text-primary mb-2">
		Pending Login Requests {pendingRequests.length > 0 ? `(${pendingRequests.length})` : ''}
	</h2>
	{#if loading}
		<p class="text-sm text-secondary">Loading pending requests...</p>
	{:else if loadFailed}
		<p class="text-sm text-secondary">Could not load pending login requests.</p>
	{:else if pendingRequests.length === 0}
		<p class="text-sm text-secondary">No pending login requests.</p>
	{:else}
		<div class="flex flex-col gap-2">
			{#each pendingRequests as req (req.authId)}
				<div class="card-primary bg-base-200 p-3">
					<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
						<span class="font-bold">{req.hostname || 'unknown host'}</span>
						{#if req.os}
							<span class="text-secondary">{req.os}{req.osVersion ? ` ${req.osVersion}` : ''}</span>
						{/if}
						{#if req.user}
							<span class="text-secondary">user: {req.user}</span>
						{/if}
						{#if req.routableIPs.length > 0}
							<span class="text-secondary">routes: {req.routableIPs.join(', ')}</span>
						{/if}
						{#if req.createdAt}
							<span class="text-secondary">{formatTime(req.createdAt)}</span>
						{/if}
					</div>
					<div class="flex gap-2 mt-2">
						<button type="button" class="btn btn-xs btn-primary" class:disabled={busyId != ''} on:click={() => approveRequest(req.authId)}>
							{#if busyId === req.authId}
								Working...
							{:else}
								Approve
							{/if}
						</button>
						<button type="button" class="btn btn-xs btn-error" class:disabled={busyId != ''} on:click={() => rejectRequest(req.authId)}>
							{#if busyId === req.authId}
								Working...
							{:else}
								Reject
							{/if}
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
