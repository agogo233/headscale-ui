<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/i18n';

	export let open = false;
	export let title = '';
	export let message = '';
	export let confirmLabel = '';
	export let cancelLabel = '';
	export let dangerous = true;

	const dispatch = createEventDispatcher();

	function confirmAction() {
		open = false;
		dispatch('confirm');
	}

	function cancelAction() {
		open = false;
		dispatch('cancel');
	}

	function keydownHandler(event: KeyboardEvent) {
		if (open && event.key === 'Escape') {
			cancelAction();
		}
	}
</script>

<svelte:window on:keydown={keydownHandler} />

{#if open}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
	<div class="modal modal-open" role="dialog" aria-modal="true" on:click|stopPropagation|self={cancelAction}>
		<div class="modal-box max-w-sm">
			<h3 class="font-bold text-lg">{title}</h3>
			<p class="py-4 text-sm {dangerous ? 'text-error' : 'text-base-content'}">{message}</p>
			<div class="modal-action">
				<button type="button" class="btn btn-sm" on:click={cancelAction}>{cancelLabel || $t('common.cancel')}</button>
				<button type="button" class="btn btn-sm {dangerous ? 'btn-error' : 'btn-primary'}" on:click={confirmAction}>
					{confirmLabel || $t('common.confirm')}
				</button>
			</div>
		</div>
	</div>
{/if}
