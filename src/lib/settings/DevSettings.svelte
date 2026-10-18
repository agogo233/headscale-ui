<script lang="ts">
	import { showACLPagesStore } from '$lib/common/stores';
	import { fade } from 'svelte/transition';
	import { t } from '$lib/i18n';

	let showDevSettings = false;
</script>

<div class="inline-block"><h1 class="text-2xl bold text-primary mb-4">{$t('settings.developerFlags')}<input type="checkbox" class="toggle toggle-sm tooltip ml-2 align-middle" data-tip={$t('settings.devFlagsTip')} bind:checked={showDevSettings} /></h1></div>
{#if showDevSettings}
	<div in:fade|global>
    <h2 class="text-xl bold text-secondary mb-2 ml-2">{$t('settings.aclPages')} <input bind:checked={$showACLPagesStore} type="checkbox" class="toggle toggle-sm ml-2 align-middle" /></h2>
  </div>
{/if}
