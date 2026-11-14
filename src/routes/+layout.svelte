<script lang="ts">
	import '../app.css';
	import Nav from '$lib/common/nav.svelte';
	import Alert from '$lib/common/Alert.svelte';
	import Stores from '$lib/common/Stores.svelte';
	import { page } from '$app/stores';
	import { apiTestStore, themeStore } from '$lib/common/stores.js';
	import { t } from '$lib/i18n';

	$: pathname = $page.url.pathname;
	$: pageTitle = pathname.endsWith('/users.html') ? $t('nav.users') : pathname.endsWith('/devices.html') ? $t('nav.devices') : pathname.endsWith('/groups.html') ? $t('nav.groups') : pathname.endsWith('/settings.html') ? $t('nav.settings') : 'Headscale';

	function toggleTheme() {
		$themeStore = $themeStore === 'hsui' ? 'night' : 'hsui';
	}

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
</script>

<main data-theme={$themeStore} class="flex flex-col">
	<!-- initialize localStorage -->
	<Stores></Stores>
	<div class="flex">
		<!-- sidebar -->
		<Nav />
		<!-- main window -->
		<div class="flex flex-1 min-w-0 flex-col bg-base-100">
			<!-- header -->
			<header class="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-base-300 bg-base-100 px-4">
				<h1 class="text-sm font-semibold text-base-content/80">{pageTitle}</h1>
				<div class="flex items-center gap-3">
					{#if $apiTestStore === 'succeeded'}
						<span class="flex items-center gap-1.5 text-xs text-base-content/60">
							<span class="relative flex h-2.5 w-2.5">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"></span>
								<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-success"></span>
							</span>
							API
						</span>
					{:else if $apiTestStore === 'failed'}
						<span class="flex items-center gap-1.5 text-xs text-error">
							<span class="inline-block h-2.5 w-2.5 rounded-full bg-error"></span>
							API
						</span>
					{/if}
					<button type="button" class="btn btn-ghost btn-sm" on:click={toggleTheme} aria-label={$t('common.toggleTheme')}>
						{#if $themeStore === 'hsui'}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						{/if}
					</button>
				</div>
			</header>
			<Alert />
			<!-- content -->
			<div class="flex-1">
				<slot />
			</div>
		</div>
	</div>
</main>
