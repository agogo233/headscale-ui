<script lang="ts">
	import { Device } from '$lib/common/classes';
	import DeviceRoute from './DeviceRoutes/DeviceRoute.svelte';

	export let device = new Device();


</script>

<th>Device Routes</th>
<td
	><ul class="list-disc list-inside">
		{#each [...new Set([...device.availableRoutes, ...device.approvedRoutes])] as route (route)}
			<li>
				<DeviceRoute {route} {device}></DeviceRoute>
			</li>
		{/each}
	</ul></td
>
