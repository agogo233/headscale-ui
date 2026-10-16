<script lang="ts">
	//
	// Imports
	//
	import DevSettings from '$lib/settings/DevSettings.svelte';
	import ServerSettings from '$lib/settings/ServerSettings.svelte';
	import ThemeSettings from '$lib/settings/ThemeSettings.svelte';
	import APIKeyManager from '$lib/settings/APIKeyManager.svelte';
	import { getVersion } from '$lib/common/apiFunctions.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	// Set to true once component is initialized
	let componentLoaded = false;
	let serverVersion = '';

	onMount(async () => {
		// Display component frontend
		await new Promise(r => setTimeout(r, 200));
		componentLoaded = true;
	});

	// Fetch the headscale server version (public endpoint, no auth required)
	onMount(() => {
		getVersion()
			.then((v) => {
				serverVersion = v.version;
			})
			.catch(() => {
				// unreachable or misconfigured: leave serverVersion empty
			});
	});
</script>

<!-- html -->
<div hidden={!componentLoaded} in:fade|global class="px-4 py-4 w-4/5 max-w-screen-lg">
		<ServerSettings />
		<div class="p-4" />
		<APIKeyManager />
		<ThemeSettings />
		<div class="p-4" />
		<h1 class="text-2xl bold text-primary mb-4">Version</h1>
		UI: <b>insert-version</b><br />
		Headscale server: <b>{serverVersion || 'unknown'}</b>
		<div class ="p-4"></div>
		<DevSettings></DevSettings>
	</div>
