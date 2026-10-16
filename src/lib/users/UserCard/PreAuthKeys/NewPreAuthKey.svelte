<script>
	import { newPreAuthKey, getPreauthKeys } from '$lib/common/apiFunctions.svelte';
	import { PreAuthKey, User } from '$lib/common/classes';
	import { fade } from 'svelte/transition';
  import { alertStore } from '$lib/common/stores';
	let currentTime = new Date();
	let minDate = new Date(currentTime.setMinutes(currentTime.getMinutes() + 60 - currentTime.getTimezoneOffset())).toISOString().slice(0, 16);

	export let newPreAuthKeyShow = false;
	export let user = new User();
  export let keyList = [new PreAuthKey];
	let expiry = minDate;
	let reusable = false;
	let ephemeral = false;
	// acl tags, added one at a time
	let newTag = '';
	/** @type {string[]} */
	let tagList = [];
	// the freshly created key, shown once in plaintext
	let createdKey = '';
	let copied = false;

	function copyKey() {
		if (!navigator.clipboard) {
			$alertStore = 'Copy is not available - select the key and copy it manually';
			return;
		}
		navigator.clipboard
			.writeText(createdKey)
			.then(() => {
				copied = true;
				setTimeout(() => {
					copied = false;
				}, 2000);
			})
			.catch(() => {
				$alertStore = 'Copy failed - select the key and copy it manually';
			});
	}

	function closePanel() {
		createdKey = '';
		copied = false;
		newPreAuthKeyShow = false;
	}

	function addTag() {
		let normalised = `tag:${newTag.trim().toLowerCase().replace(/^tag:/, '')}`;
		if (normalised == 'tag:') {
			$alertStore = 'Tag must not be empty';
			return;
		}
		if (normalised.includes(' ')) {
			$alertStore = 'Tags must not contain spaces';
			return;
		}
		// remove duplicates
		if (tagList.includes(normalised)) {
			newTag = '';
			return;
		}
		tagList.push(normalised);
		newTag = '';
	}

	/**
	 * @param {string} tag
	 */
	function removeTag(tag) {
		tagList = tagList.filter((t) => t !== tag);
	}

	function NewPreAuthKeyAction() {
		let formattedDate = new Date(expiry).toISOString();
		newPreAuthKey(user.id, formattedDate, reusable, ephemeral, tagList)
			.then((key) => {
				createdKey = key;
				tagList = [];
				newTag = '';
				getPreauthKeysAction();
			})
			.catch((error) => {
				$alertStore = error;
			});
	}

  function getPreauthKeysAction() {
		getPreauthKeys(user.id)
			.then((keys) => {
				keyList = keys;
			})
			.catch((error) => {
				$alertStore = error;
			});
	}
</script>

<div in:fade|global class="card-pending">
	{#if createdKey}
		<div class="p-3">
			<p class="text-sm text-warning mb-1">Copy this key now — it will not be shown again.</p>
			<div class="flex gap-1 items-center">
				<code class="block border rounded px-2 py-1 text-xs overflow-auto max-w-full">{createdKey}</code>
				<button type="button" on:click={copyKey} class="btn btn-xs btn-primary shrink-0">{copied ? 'Copied' : 'Copy'}</button>
			</div>
			<button class="btn btn-sm m-3 btn-secondary capitalize" type="button" on:click={closePanel}>Done</button>
		</div>
	{:else}
		<form on:submit|preventDefault={NewPreAuthKeyAction}>
		<table class="table table-compact w-full">
			<tbody>
				<tr>
					<th>Expiry:</th>
					<td><input bind:value={expiry} class="border rounded px-2" type="datetime-local" required min={minDate} /><br /></td>
				</tr>
				<tr>
					<th>Reusable:</th>
					<td>
						<input type="checkbox" bind:checked={reusable} class="checkbox checkbox-sm text-base-content" />
					</td>
				</tr>
				<tr>
					<th>Ephemeral:</th>
					<td>
						<input type="checkbox" bind:checked={ephemeral} class="checkbox checkbox-sm text-base-content" />
					</td>
				</tr>
				<tr>
					<th>Tags:</th>
					<td>
						<div class="flex items-center gap-1">
							<input
								bind:value={newTag}
								on:keydown={(e) => {
									if (e.key === 'Enter') {
										addTag();
									}
								}}
								class="border rounded px-2 w-32"
								placeholder="tag"
							/>
							<button type="button" on:click={addTag} class="btn btn-xs btn-primary">+ Add</button>
						</div>
						<div class="flex flex-wrap gap-1 mt-1">
							{#each tagList as tag}
								<span class="badge badge-xs bg-base-300">
									{tag}
									<button type="button" on:click={() => removeTag(tag)}>
										<!-- Cancel symbol -->
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</button>
								</span>
							{/each}
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<button class="btn btn-sm m-3 btn-primary capitalize">Create Preauth Key</button>
		<button
			on:click={() => {
				newPreAuthKeyShow = false;
			}}
			type="button"
			class="btn btn-sm m-1 btn-secondary capitalize">Cancel</button
		>
	</form>
	{/if}
</div>
