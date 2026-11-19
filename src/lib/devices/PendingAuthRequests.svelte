<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getPendingAuthRequests, rejectAuth, getDevices, newDevice } from '$lib/common/apiFunctions.svelte';
	import { PendingAuthRequest } from '$lib/common/classes';
	import { alertStore, userStore } from '$lib/common/stores.js';
	import { t, translate } from '$lib/i18n';

	let pendingRequests: PendingAuthRequest[] = [];
	let loading = true;
	let loadFailed = false;
	let busyId = '';
	// selected owner per pending request (authId -> user id); approving a
	// registration must name the user the node is registered to
	let selectedUsers: Record<string, string> = {};

	// returns the request creation time in local time
	function formatTime(date: string) {
		if (!date) {
			return '';
		}

		return new Date(date).toLocaleString();
	}

	// suppressAlert keeps an already-shown error (e.g. from a failed approval)
	// from being overwritten when the refresh itself fails
	function loadPending(suppressAlert = false) {
		loading = true;
		getPendingAuthRequests()
			.then((requests) => {
				pendingRequests = requests ?? [];
				loadFailed = false;
				prefillSelectedUsers();
			})
			.catch((error) => {
				loadFailed = true;
				if (!suppressAlert) {
					$alertStore = error;
				}
			})
			.finally(() => {
				loading = false;
			});
	}

	// prefill the user select when the backend already resolved an identity
	// via OIDC (req.user is a username); web-auth requests stay empty and
	// require an explicit choice
	function prefillSelectedUsers() {
		for (const req of pendingRequests) {
			if (selectedUsers[req.authId] || !req.user) {
				continue;
			}

			const match = $userStore.find((u) => u.name === req.user);
			if (match) {
				selectedUsers[req.authId] = match.id;
			}
		}
	}

	function approveRequest(req: PendingAuthRequest) {
		const userId = selectedUsers[req.authId];
		if (!userId) {
			$alertStore = translate('devices.selectUserFirst');
			return;
		}

		if (busyId != '') {
			return;
		}

		busyId = req.authId;
		// register the pending node to the chosen user; a plain auth verdict
		// would only make the client restart its registration
		newDevice(req.authId, userId)
			.then(() => {
				// refresh the pending list and the device list (the approved node shows up)
				getDevices();
				loadPending();
			})
			.catch((error) => {
				$alertStore = error;
				// refresh to drop entries that expired and can no longer be approved
				loadPending(true);
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
		{$t('devices.pendingRequests')} {pendingRequests.length > 0 ? $t('devices.pendingCount', { count: pendingRequests.length }) : ''}
	</h2>
	{#if loading}
		<p class="text-sm text-secondary">{$t('devices.loadingRequests')}</p>
	{:else if loadFailed}
		<p class="text-sm text-secondary">{$t('devices.loadFailed')}</p>
	{:else if pendingRequests.length === 0}
		<p class="text-sm text-secondary">{$t('devices.noRequests')}</p>
	{:else}
		<div class="flex flex-col gap-2">
			{#each pendingRequests as req (req.authId)}
				<div class="card-primary bg-base-200 p-3">
					<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
						<span class="font-bold">{req.hostname || $t('devices.unknownHost')}</span>
						{#if req.os}
							<span class="text-secondary">{req.os}{req.osVersion ? ` ${req.osVersion}` : ''}</span>
						{/if}
						{#if req.user}
							<span class="text-secondary">{$t('devices.authUser', { name: req.user })}</span>
						{/if}
						{#if req.routableIPs.length > 0}
							<span class="text-secondary">{$t('devices.authRoutes', { routes: req.routableIPs.join(', ') })}</span>
						{/if}
						{#if req.createdAt}
							<span class="text-secondary">{formatTime(req.createdAt)}</span>
						{/if}
					</div>
					<div class="flex flex-wrap items-center gap-2 mt-2">
						<label class="text-sm text-secondary" for="pending-user-{req.authId}">{$t('devices.selectUser')}</label>
						<select id="pending-user-{req.authId}" class="card-select" required bind:value={selectedUsers[req.authId]}>
							{#each $userStore.filter((u) => u.id !== '') as user (user.id)}
								<option value={user.id}>{user.name.length > 1 ? user.name : user.email}</option>
							{/each}
						</select>
						<button type="button" class="btn btn-xs btn-primary" class:disabled={busyId != ''} on:click={() => approveRequest(req)}>
							{#if busyId === req.authId}
								{$t('common.working')}
							{:else}
								{$t('devices.approve')}
							{/if}
						</button>
						<button type="button" class="btn btn-xs btn-error" class:disabled={busyId != ''} on:click={() => rejectRequest(req.authId)}>
							{#if busyId === req.authId}
								{$t('common.working')}
							{:else}
								{$t('devices.reject')}
							{/if}
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
