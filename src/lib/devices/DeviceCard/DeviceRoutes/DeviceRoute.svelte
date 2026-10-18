<script>
	import { getDevices, approveRoutes } from '$lib/common/apiFunctions.svelte';
	import { Device } from '$lib/common/classes';
	import { alertStore } from '$lib/common/stores';
	import { t } from '$lib/i18n';

	export let route = '';
	export let device = new Device();

	let routeDisabled = false;
	function approveRouteAction() {
		approveRoutes(device.id, [...device.approvedRoutes, route])
			.then(() => {
				// refresh users after editing
				getDevices();
			})
			.catch((error) => {
				$alertStore = error;
			});
	}

	function removeRouteAction() {
		// The backend expands an exit route to both families, so removing one
		// must strip both or it re-expands and the route stays approved.
		const exitRoutes = ['0.0.0.0/0', '::/0'];
		const isExitRoute = exitRoutes.includes(route);
		const remainingRoutes = device.approvedRoutes.filter(
			(r) => r !== route && !(isExitRoute && exitRoutes.includes(r))
		);
		approveRoutes(device.id, remainingRoutes)
			.then(() => {
				// refresh users after editing
				getDevices();
			})
			.catch((error) => {
				$alertStore = error;
			});
	}
</script>

{route}
{#if device.approvedRoutes.includes(route)}
	<button
		on:click={() => {
			routeDisabled = true;
			removeRouteAction();
			routeDisabled = false;
		}}
		type="button"
		class="btn btn-xs tooltip capitalize bg-success text-success-content mx-1">{$t('common.active')}</button
	>
{:else}
	<button
		on:click={() => {
			routeDisabled = true;
			approveRouteAction();
			routeDisabled = false;
		}}
		type="button"
		class="btn btn-xs tooltip capitalize bg-secondary text-secondary-content mx-1"
		class:disabled={routeDisabled}
		data-tip={$t('devices.clickToEnable')}>{$t('common.pending')}</button
	>
{/if}
{#if device.subnetRoutes.includes(route)}
	<button type="button" class="btn btn-xs tooltip capitalize bg-secondary text-secondary-content mx-1">{$t('common.subnet')}</button>
{/if}
