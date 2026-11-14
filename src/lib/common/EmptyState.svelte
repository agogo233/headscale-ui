<script lang="ts">
	export let title = '';
	export let description = '';
</script>

<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
	<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
		<path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
	</svg>
	<h3 class="text-lg font-semibold text-base-content/80">{title}</h3>
	{#if description}
		<p class="text-sm text-base-content/60 mt-1">{description}</p>
	{/if}
	{#if $$slots.default}
		<div class="mt-4"><slot /></div>
	{/if}
</div>
