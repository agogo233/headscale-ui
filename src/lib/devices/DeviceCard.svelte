<script lang="ts">
	import { Device } from '$lib/common/classes';
	import { slide } from 'svelte/transition';
	import DeviceRoutes from './DeviceCard/DeviceRoutes.svelte';
	import DeviceTags from './DeviceCard/DeviceTags.svelte';
	import MoveDevice from './DeviceCard/MoveDevice.svelte';
	import RemoveDevice from './DeviceCard/RemoveDevice.svelte';
	import RenameDevice from './DeviceCard/RenameDevice.svelte';
	import SetIPDevice from './DeviceCard/SetIPDevice.svelte';
	import ExpireDevice from './DeviceCard/ExpireDevice.svelte';
	import { t, translate } from '$lib/i18n';
	import { alertStore } from '$lib/common/stores';
	import { toast } from '$lib/common/toast';

	export let device = new Device();
	let cardExpanded = false;
	let cardEditing = false;

	function copyText(text: string) {
		if (!navigator.clipboard) {
			$alertStore = translate('common.copyUnavailable');
			return;
		}
		navigator.clipboard
			.writeText(text)
			.then(() => toast(translate('common.copied'), 'success'))
			.catch(() => {
				$alertStore = translate('common.copyFailed');
			});
	}

	// maps the backend's register method enum to display text
	function registerMethodLabel(method: string) {
		if (!method || method === 'REGISTER_METHOD_UNSPECIFIED') {
			return translate('devices.regUnknown');
		}
		if (method === 'REGISTER_METHOD_AUTH_KEY') {
			return translate('devices.regAuthKey');
		}
		if (method === 'REGISTER_METHOD_OIDC') {
			return translate('devices.regOidc');
		}
		if (method === 'REGISTER_METHOD_CLI') {
			return translate('devices.regCli');
		}
		return method;
	}

	// returns time last seen in human readable format
	function timeSince(date: Date) {
		let currentTime = new Date();
		// gets time difference in seconds
		let timeDifference = Math.round((currentTime.getTime() - date.getTime()) / 1000);
		let timeUnit = '';

		if (timeDifference < 60) {
			timeUnit = translate('common.seconds');
		} else if (timeDifference < 3600) {
			timeDifference = Math.floor(timeDifference / 60);
			if (timeDifference == 1) {
				timeUnit = translate('common.minute');
			} else {
				timeUnit = translate('common.minutes');
			}
		} else if (timeDifference < 86400) {
			timeDifference = Math.floor(timeDifference / (60 * 60));
			if (timeDifference == 1) {
				timeUnit = translate('common.hour');
			} else {
				timeUnit = translate('common.hours');
			}
		} else {
			timeDifference = Math.floor(timeDifference / (60 * 60 * 24));
			if (timeDifference == 1) {
				timeUnit = translate('common.day');
			} else {
				timeUnit = translate('common.days');
			}
		}
		return translate('devices.lastSeenAgo', { n: timeDifference, unit: timeUnit });
	}
</script>

<div class="card-primary bg-base-200">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:keypress on:click={() => (cardExpanded = !cardExpanded)} class="flex items-center">
		<span class="min-w-64 w-1/2 font-bold">
			{#if cardEditing == false}
				{#if device.online}
					<span class="tooltip" data-tip={$t('common.online')}>
						<span class="relative flex h-3 w-3 align-middle">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"></span>
							<span class="relative inline-flex h-3 w-3 rounded-full bg-success"></span>
						</span>
					</span>
				{:else}
					<span class="tooltip" data-tip={device.lastSeen ? timeSince(new Date(device.lastSeen)) : $t('common.neverSeen')}>
						<span class="inline-flex h-3 w-3 rounded-full bg-error align-middle"></span>
					</span>
				{/if}
				{device.id}: {device.givenName}
			{/if}
			<RenameDevice bind:cardEditing {device} />
		</span>
		<div class="grow w-full"><DeviceTags {device} /></div>
		<div class="grow min-w-fit">
			<RemoveDevice {device} />
			<ExpireDevice {device} />
			<button type="button">
				{#if !cardExpanded}
					<!-- Icon: chevron down -->
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				{:else}
					<!-- Icon: chevron up -->
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
					</svg>
				{/if}
			</button>
		</div>
	</div>
	{#if cardExpanded}
		<!-- we put a conditional on the outro transition so page changes do not trigger the animation -->
		<div in:slide|global out:slide|global={{ duration: cardExpanded ? 0 : 500 }} class="mt-2 pt-2 pl-2">
			<div class="overflow-x-auto">
				<table class="table table-compact w-full">
					<tbody>
						<tr>
							<th>{$t('devices.lastSeen')}</th>
							<td>{device.lastSeen ? new Date(device.lastSeen) : $t('common.never')}</td>
						</tr>
						<tr>
							<th>{$t('devices.ipAddresses')}</th>
							<td>
								<ul class="list-disc list-inside">
									{#each device.ipAddresses as address}
										<li>
											{address}
											<button type="button" class="btn btn-ghost btn-xs px-1 align-middle" on:click={() => copyText(address)} aria-label={$t('common.copy')}>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
												</svg>
											</button>
										</li>
									{/each}
								</ul>
								<SetIPDevice {device} />
							</td>
						</tr>
						<tr>
							<th>{$t('devices.assignedUser')}</th>
							<MoveDevice {device} />
						</tr>
						<tr>
							<th>{$t('common.device')}</th>
							<td>{device.name}</td>
						</tr>
						<tr>
							<th>{$t('devices.expiry')}</th>
							<td>{device.expiry ? new Date(device.expiry).toLocaleString() : $t('common.never')}</td>
						</tr>
						<tr>
							<th>{$t('devices.registerMethod')}</th>
							<td>{registerMethodLabel(device.registerMethod)}</td>
						</tr>
						<tr>
							<DeviceRoutes {device} />
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
