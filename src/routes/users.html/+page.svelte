<!-- typescript -->
<script lang="ts">
	import { base } from '$app/paths';
	import { getUsers } from '$lib/common/apiFunctions.svelte';
	import { apiTestStore, userFilterStore, userStore } from '$lib/common/stores';
	import CreateUser from '$lib/users/CreateUser.svelte';
	import SearchUsers from '$lib/users/SearchUsers.svelte';
	import SortUsers from '$lib/users/SortUsers.svelte';
	import UserCard from '$lib/users/UserCard.svelte';
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
		{#if $apiTestStore === 'succeeded'}
			<!-- instantiate user based components -->
			<table>
				<tr
					><td
						><!-- device creation visibility button -->
						<div class="p-4">
							{#if newUserCardVisible == false}
								<button on:click={() => (newUserCardVisible = true)} class="btn btn-primary btn-xs capitalize" type="button">{$t('users.newUser')}</button>
							{:else}
								<button on:click={() => (newUserCardVisible = false)} class="btn btn-secondary btn-xs capitalize" type="button">{$t('users.hideNewUser')}</button>
							{/if}
						</div></td
					><td><SortUsers /></td><td><SearchUsers /></td></tr
				>
			</table>
			<CreateUser bind:newUserCardVisible />

			<div class="flex flex-col gap-2">
				{#each $userStore as user (user.id)}
					{#if $userFilterStore.includes(user)}
						<UserCard {user} />
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
