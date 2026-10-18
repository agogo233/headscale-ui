<script lang="ts">
	import { getAPIKeys } from '$lib/common/apiFunctions.svelte';
	import { APIKey } from '$lib/common/classes';
	import { alertStore, APIKeyStore } from '$lib/common/stores';
	import { onMount } from 'svelte';
	import { translate } from '$lib/i18n';
	let keyList = [new APIKey()];
   let timeLeftWarning = false;
   let timeLeftTip = '';

	function getAPIKeysAction(): void {
		getAPIKeys()
			.then((keys) => {
				keyList = keys;
        // The stored key is hskey-api-{id12}-{secret64} while the listed prefix
        // is the masked hskey-api-{id12}-***, so match on the 12-char id.
        function keyIdentifier(keyStr: string): string {
          let index = keyStr.indexOf('hskey-api-');
          return index >= 0 ? keyStr.slice(index + 10, index + 22) : keyStr;
        }
        keyList.forEach(key => {
          if(keyIdentifier($APIKeyStore) === keyIdentifier(key.prefix)) {
            const expiry = key.expiration ? new Date(key.expiration) : null;
            // A null expiration never expires; a zero-stamped one is already
            // expired and must not trip the rolling warning.
            if(expiry && expiry.getFullYear() > 1) {
              timeLeft(expiry);
            }
          }
        });
			})
			.catch((error) => {
				$alertStore = error;
			});
	}

	// sets time expiry in human readable format
	function timeLeft(date: Date): void {
		let currentTime = new Date();
		// gets time difference in seconds
		let timeDifferenceDays = Math.round((date.getTime() - currentTime.getTime()) / 1000 / 60 / 60 / 24);
		if(timeDifferenceDays < 30) {
      $alertStore = translate('settings.keyExpiryWarning', { days: timeDifferenceDays })
      timeLeftWarning = true;
    }
    timeLeftTip = translate('settings.keyExpiryTip', { days: timeDifferenceDays });
	}

	onMount(() => {
		getAPIKeysAction();
	});
</script>

<button type="button" class="tooltip" data-tip={timeLeftTip}>
	<!-- clock -->
	<svg xmlns="http://www.w3.org/2000/svg" class:stroke-error="{timeLeftWarning}" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
</button>
