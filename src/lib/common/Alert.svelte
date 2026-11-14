<script lang="ts">
	import { onMount } from 'svelte';
	import { alertStore } from '$lib/common/stores.js';
	import { dismissToast, toast, toastStore, type ToastType } from '$lib/common/toast';

	const typeClass: Record<ToastType, string> = {
		success: 'alert-success',
		error: 'alert-error',
		info: 'alert-info',
		warning: 'alert-warning'
	};

	onMount(async () => {
		window.addEventListener('unhandledrejection', function (promiseRejectionEvent) {
			toast(String(promiseRejectionEvent.reason), 'error');
		});
	});

	// Legacy bridge: existing components publish messages via alertStore;
	// surface them as error toasts and clear the store so a repeated
	// identical message re-triggers.
	$: if ($alertStore) {
		toast(String($alertStore), 'error');
		alertStore.set('');
	}
</script>

<div class="toast toast-top toast-end z-[1000] max-w-md">
	{#each $toastStore as item (item.id)}
		<div class="alert {typeClass[item.type]} shadow-lg">
			<span class="text-sm break-all">{item.message}</span>
			<button type="button" class="btn btn-ghost btn-xs" on:click={() => dismissToast(item.id)}>✕</button>
		</div>
	{/each}
</div>
