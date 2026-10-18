<script lang="ts">
	import { fade } from 'svelte/transition';
	import { userStore } from '$lib/common/stores';
	import { getDevices, newDevice } from '$lib/common/apiFunctions.svelte';
	import { alertStore } from '$lib/common/stores.js';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { goto } from "$app/navigation";
	import { t, translate } from '$lib/i18n';

	// whether the new card html element is visible
	export let newDeviceCardVisible = false;
	export let newDeviceKey = '';
	let newDeviceForm: HTMLFormElement;
	let selectedUser = '';

	const tabs = ['devices.tabDefault', 'devices.tabPreauth', 'devices.tabOidc'] as const;
	let activeTab = 0;

	function newDeviceAction() {
		if (newDeviceForm.reportValidity()) {
			newDevice(newDeviceKey, selectedUser)
				.then((response) => {
					newDeviceCardVisible = false;
					newDeviceKey = '';

					// refresh devices after editing
					getDevices();

					// Clear device key in url
					if ($page.url.searchParams.get('nodekey')) {
						$page.url.searchParams.delete('nodekey');
						goto(`?${$page.url.searchParams.toString()}`);
					}
				})
				.catch((error) => {
					$alertStore = error;
				});
		} else {
			$alertStore = translate('devices.provideValidKey');
		}
	}
</script>

<!-- html -->

{#if newDeviceCardVisible == true}
	<div in:fade|global out:fade|global={{ duration: newDeviceCardVisible ? 0 : 500 }} class="p-2 max-w-screen-lg border border-dashed border-base-content mx-4 rounded-md text-sm text-base-content shadow mb-10">
		<div class="tabs">
			{#each tabs as tab, index}
				<button class="tab tab-bordered h-fit w-1/3" class:tab-active={activeTab == index} on:click={() => (activeTab = index)}>{$t(tab)}</button>
			{/each}
		</div>
		<!-- Default Configuration -->
		{#if activeTab == 0}
			<div in:fade|global class="m-2">
				<p>{$t('devices.tabDefaultIntro1')}<a target="_blank" rel="noreferrer" class="link link-primary" href="https://github.com/juanfont/headscale/tree/main/docs">{$t('devices.tabDefaultLink1')}</a>{$t('devices.tabDefaultIntro2')}</p>
				<div class="m-2"><code>headscale auth register --auth-id &lt;your device key&gt; --user USERNAME</code></div>
				<div class="my-2"><p>{$t('devices.copyKeyBelow')}</p></div>
				<form class="flex flex-wrap" bind:this={newDeviceForm} on:submit|preventDefault={newDeviceAction}>
					<div class="flex-none mr-4">
						<label class="block text-secondary text-sm font-bold mb-2" for="text">{$t('devices.deviceKey')}</label>
						<input bind:value={newDeviceKey} class="card-input" type="text" required placeholder="******************" />
					</div>
					<div class="flex-none">
						<label class="block text-secondary text-sm font-bold mb-2" for="select">{$t('devices.selectUser')}</label>
						<select class="card-select mr-3" required bind:value={selectedUser}>
							{#each $userStore as user}
								<option value={user.id}>{user.name.length > 1 ? user.name : user.email}</option>
							{/each}
						</select>
					</div>
					<div class="flex-none pt-6">
						<button
							><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-1 inline rounded-full hover:bg-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg></button
						>
						<button
							on:click={() => {
								newDeviceCardVisible = false;
								newDeviceKey = '';
							}}
							type="button"
							><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-1 inline rounded-full hover:bg-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg></button
						>
					</div>
				</form>
			</div>
		{/if}
		<!-- With Preauth Keys -->
		{#if activeTab == 1}
			<div in:fade|global class="m-2">
				<p>{$t('devices.tabPreauthP1a')}<code class="bg-base-200 px-2 rounded">--authkey</code>{$t('devices.tabPreauthP1b')}<a target="_blank" rel="noreferrer" class="link link-primary" href="https://tailscale.com/kb/1080/cli/">{$t('devices.tabPreauthLink1')}</a>{$t('devices.tabPreauthP1c')}</p>
				<p>{$t('devices.tabPreauthP2a')}<code class="bg-base-200 px-2 rounded">TS_UNATTENDEDMODE</code>{$t('devices.tabPreauthP2b')}<a target="_blank" rel="noreferrer" class="link link-primary" href="https://tailscale.com/kb/1189/install-windows-msi/">{$t('devices.tabPreauthLink2')}</a>{$t('devices.tabPreauthP2c')}</p>
				<div class="bg-base-200 p-4 m-2 rounded-xl">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span class="pl-2">{$t('devices.tabPreauthManageA')}<a href="{base}/" class="link link-primary">{$t('devices.tabPreauthLink3')}</a>{$t('devices.tabPreauthManageB')}</span>
				</div>
			</div>
		{/if}
		<!-- With OIDC -->
		{#if activeTab == 2}
			<div in:fade|global class="m-2">
				<p>{$t('devices.tabOidcP1a')}<a target="_blank" rel="noreferrer" class="link link-primary" href="https://www.keycloak.org/">{$t('devices.tabOidcLink1')}</a>{$t('devices.tabOidcP1b')}</p>
				<br />
				<p>{$t('devices.tabOidcP2a')}<a target="_blank" rel="noreferrer" class="link link-primary" href="https://github.com/juanfont/headscale/blob/main/config-example.yaml">{$t('devices.tabOidcLink2')}</a>{$t('devices.tabOidcP2b')}</p>
			</div>
		{/if}
	</div>
{/if}
