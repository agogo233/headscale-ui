<script lang="ts">
	import { alertStore } from '$lib/common/stores.js';
	import { getUsers, newUser } from '$lib/common/apiFunctions.svelte';
	import { t, translate } from '$lib/i18n';

	// name for user creation
	let newUserName = '';
	// whether the new card html element is visible
	export let newUserCardVisible = false;
	// The Form used for validating input
	let newUserForm: HTMLFormElement;

	function close() {
		newUserCardVisible = false;
		newUserName = '';
	}

	function keydownHandler(event: KeyboardEvent) {
		if (newUserCardVisible && event.key === 'Escape') {
			close();
		}
	}

	function newUserAction(): void {
		if (newUserForm.reportValidity()) {
			newUser(newUserName)
				.then((response) => {
					close();
					// refresh users after editing
					getUsers();
				})
				.catch((error) => {
					$alertStore = error;
				});
		} else {
			$alertStore = translate('common.invalidName');
		}
	}
</script>

<!-- html -->
<svelte:window on:keydown={keydownHandler} />
{#if newUserCardVisible}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
	<div class="modal modal-open" role="dialog" aria-modal="true" on:click|stopPropagation|self={close}>
		<div class="modal-box max-w-sm">
			<h3 class="font-bold text-lg mb-4">{$t('users.newUser')}</h3>
			<form on:submit|preventDefault={newUserAction} class="relative" bind:this={newUserForm}>
				<!-- Input has to be lower case, but we will force lower case on submit -->
				<input bind:value={newUserName} class="input input-bordered w-full lowercase" required pattern="[a-zA-Z0-9\-\.]+" placeholder={$t('common.name')} />
			</form>
			<div class="modal-action">
				<button type="button" class="btn btn-sm" on:click={close}>{$t('common.cancel')}</button>
				<button type="button" class="btn btn-sm btn-primary capitalize" on:click={newUserAction}>{$t('users.newUser')}</button>
			</div>
		</div>
	</div>
{/if}
