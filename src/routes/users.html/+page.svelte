<!-- typescript -->
<script lang="ts">
	import { base } from '$app/paths';
	import { getUsers } from '$lib/common/apiFunctions.svelte';
	import { apiTestStore, userFilterStore, userStore } from '$lib/common/stores';
	import CreateUser from '$lib/users/CreateUser.svelte';
	import SearchUsers from '$lib/users/SearchUsers.svelte';
	import SortUsers from '$lib/users/SortUsers.svelte';
	import UserCard from '$lib/users/UserCard.svelte';
	import EmptyState from '$lib/common/EmptyState.svelte';
	import SkeletonCard from '$lib/common/SkeletonCard.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from '$lib/i18n';

	//
	// Component Variables
	//
	// whether the new card html element is visible
	let newUserCardVisible = false;

	// let's the page know if it's ready to load
	let componentLoaded = false;

	// We define the meat of our script in onMount as doing so forces client side rendering.
	// Doing so also does not perform any actions until components are initialized
	onMount(async () => {
		// update user list
		getUsers().then(
			() => apiTestStore.set('succeeded'),
			() => apiTestStore.set('failed')
		);
		// load the page
		componentLoaded = true;
	});
</script>

<!-- html -->
{#if componentLoaded}
	<div in:fade|global>
		<div class="px-4 pt-4">
			<h1 class="text-2xl bold text-primary">{$t('users.view')}</h1>
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
			<!-- toolbar -->
			<div class="px-4 py-3 flex flex-wrap items-center gap-2">
				<button on:click={() => (newUserCardVisible = true)} class="btn btn-primary btn-sm capitalize" type="button">{$t('users.newUser')}</button>
				<div class="grow"></div>
				<SortUsers />
				<SearchUsers />
			</div>
			<CreateUser bind:newUserCardVisible />
			{#if $userStore.length === 0}
				<EmptyState title={$t('users.emptyTitle')} description={$t('users.emptyDescription')}>
					<button type="button" class="btn btn-primary btn-sm capitalize" on:click={() => (newUserCardVisible = true)}>{$t('users.newUser')}</button>
				</EmptyState>
			{:else if $userFilterStore.length === 0}
				<EmptyState title={$t('common.noMatches')} />
			{:else}
				<!-- instantiate user based components -->
				<div class="flex flex-col gap-2">
					{#each $userStore as user (user.id)}
						{#if $userFilterStore.includes(user)}
							<UserCard {user} />
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
