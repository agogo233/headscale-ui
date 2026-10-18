<script lang="ts">
	import { expireAPIKey, getAPIKeys, newAPIKey } from '$lib/common/apiFunctions.svelte';
	import { APIKey } from '$lib/common/classes';
	import { alertStore, APIKeyStore } from '$lib/common/stores';
	import { t } from '$lib/i18n';
	let keyList = [new APIKey()];
	let currentKey = new APIKey();
  export let apiStatus = '';

	// get current API keys
	// Match to current key
	function getAPIKeysAction(): void {
		// The stored key is hskey-api-{id12}-{secret64} while the listed prefix
		// is the masked hskey-api-{id12}-***, so match on the 12-char id.
		function keyIdentifier(keyStr: string): string {
			let index = keyStr.indexOf('hskey-api-');
			return index >= 0 ? keyStr.slice(index + 10, index + 22) : keyStr;
		}

		getAPIKeys()
			.then((keys) => {
				keyList = keys;
				// match up the current apikey to the keylist
				keyList.forEach((key) => {
					if (keyIdentifier($APIKeyStore) === keyIdentifier(key.prefix)) {
						currentKey = key;
						// create the new key
						newAPIKeyAction()
							.then((data) => {
								$APIKeyStore = data;
								// expire the old key
								expireAPIKey(currentKey.prefix);
							})
							.catch((error) => {
								$alertStore = error;
							});
					}
				});
			})
			.catch((error) => {
				$alertStore = error;
			});
	}

	// create new API key
	function newAPIKeyAction() {
		let event = new Date();
		event.setDate(event.getDate() + 90);
		return newAPIKey(event.toISOString());
	}
</script>

<button
	on:click={() => {
		getAPIKeysAction();
	}}
	class="btn btn-sm btn-secondary capitalize ml-4"
	type="button" disabled="{apiStatus != 'succeeded'}">{$t('settings.rolloverApiKey')}</button
>
