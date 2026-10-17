<script context="module" lang="ts">
	import { APIKey, Device, PendingAuthRequest, PreAuthKey, User } from '$lib/common/classes';
	import { deviceStore, userStore } from '$lib/common/stores.js';
	import { sortDevices, sortUsers } from '$lib/common/sorting.svelte';
	import { filterDevices, filterUsers } from './searching.svelte';

	// parseApiError extracts a human-readable message from the backend error
	// body. Huma validation errors (415/422) carry a generic detail
	// ("validation failed") with the real reason in errors[0].message, so that
	// sentinel is unwrapped. Non-JSON bodies (proxy error pages) fall back to
	// the raw text instead of throwing a SyntaxError.
	function parseApiError(text: string): string {
		try {
			const parsed = JSON.parse(text);
			let detail = parsed?.detail || parsed?.title;
			if (detail === 'validation failed') {
				detail = parsed?.errors?.[0]?.message || detail;
			}
			return detail || text || 'Request failed';
		} catch {
			return text || 'Request failed';
		}
	}

	// apiFetch is the single HTTP entry point for the v1 API. It centralises
	// the bearer header, the JSON content type (required by the backend for any
	// request body) and error parsing so every call behaves identically.
	async function apiFetch<T = unknown>(method: string, path: string, body?: object): Promise<T> {
		const headscaleURL = localStorage.getItem('headscaleURL') || '';
		const headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		const headers: Record<string, string> = {
			Accept: 'application/json',
			Authorization: `Bearer ${headscaleAPIKey}`
		};
		let bodyText: string | undefined;
		if (body !== undefined) {
			headers['Content-Type'] = 'application/json';
			bodyText = JSON.stringify(body);
		}

		const response = await fetch(headscaleURL + path, {
			method,
			headers,
			body: bodyText
		});

		if (!response.ok) {
			const text = await response.text();
			throw parseApiError(text);
		}

		try {
			return (await response.json()) as T;
		} catch {
			throw 'Received an unexpected response from the server';
		}
	}

	export async function getUsers() {
		const data = await apiFetch<{ users: User[] }>('GET', '/api/v1/user');
		const headscaleUsers = sortUsers(data.users ?? []);
		userStore.set(headscaleUsers);
		filterUsers();
	}

	export async function editUser(currentUserId: string, newUsername: string): Promise<any> {
		const endpointURL = '/api/v1/user/' + currentUserId + '/rename/' + encodeURIComponent(newUsername.toLowerCase());
		return apiFetch('POST', endpointURL);
	}

	export async function newAPIKey(APIKeyExpiration: string): Promise<string> {
		const data = await apiFetch<{ apiKey: string }>('POST', '/api/v1/apikey', {
			expiration: APIKeyExpiration
		});
		return data.apiKey;
	}

	export async function expireAPIKey(APIKeyPrefix: string) {
		await apiFetch('POST', '/api/v1/apikey/expire', {
			prefix: APIKeyPrefix
		});
	}

	export async function updateTags(deviceID: string, tags: string[]): Promise<any> {
		return apiFetch('POST', `/api/v1/node/${deviceID}/tags`, {
			tags: tags
		});
	}

	export async function removeUser(currentUserId: string): Promise<any> {
		return apiFetch('DELETE', '/api/v1/user/' + currentUserId);
	}

	export async function newUser(newUsername: string): Promise<any> {
		return apiFetch('POST', '/api/v1/user', {
			name: newUsername.toLowerCase()
		});
	}

	export async function getDevices(): Promise<void> {
		const data = await apiFetch<{ nodes: Device[] }>('GET', `/api/v1/node`);
		const headscaleDevices = sortDevices(data.nodes ?? []);
		deviceStore.set(headscaleDevices);
		filterDevices();
	}

	export async function getAPIKeys(): Promise<APIKey[]> {
		const data = await apiFetch<{ apiKeys: APIKey[] }>('GET', '/api/v1/apikey');
		return data.apiKeys;
	}

	export async function getPreauthKeys(userID: string): Promise<PreAuthKey[]> {
		const data = await apiFetch<{ preAuthKeys: PreAuthKey[] }>('GET', '/api/v1/preauthkey');
		let headscalePreAuthKey = data.preAuthKeys ?? [];
		if (userID) {
			headscalePreAuthKey = headscalePreAuthKey.filter((k) => k.user?.id === userID);
		}
		return headscalePreAuthKey;
	}

	export async function newPreAuthKey(userID: string, expiry: string, reusable: boolean, ephemeral: boolean, aclTags: string[]): Promise<string> {
		const data = await apiFetch<{ preAuthKey: { key: string } }>('POST', '/api/v1/preauthkey', {
			user: userID,
			expiration: expiry,
			reusable: reusable,
			ephemeral: ephemeral,
			aclTags: aclTags
		});
		return data.preAuthKey?.key ?? '';
	}

	export async function expirePreAuthKey(preAuthKeyID: string): Promise<any> {
		return apiFetch('POST', '/api/v1/preauthkey/expire', {
			id: preAuthKeyID
		});
	}

	export async function newDevice(key: string, userId: string): Promise<any> {
		const params = new URLSearchParams({ user: userId, key });
		return apiFetch('POST', `/api/v1/node/register?` + params);
	}

	export async function moveDevice(deviceID: string, userID: string): Promise<any> {
		return apiFetch('POST', `/api/v1/node/${deviceID}/user`, {
			user: userID
		});
	}

	export async function renameDevice(deviceID: string, name: string): Promise<any> {
		return apiFetch('POST', `/api/v1/node/${deviceID}/rename/${encodeURIComponent(name)}`);
	}

	export async function setDeviceIP(deviceID: string, ipv4: string): Promise<any> {
		return apiFetch('POST', `/api/v1/node/${deviceID}/ip`, {
			ipv4: ipv4
		});
	}

	export async function removeDevice(deviceID: string): Promise<any> {
		return apiFetch('DELETE', `/api/v1/node/${deviceID}`);
	}

	export async function expireDevice(deviceID: string, disableExpiry: boolean): Promise<any> {
		return apiFetch('POST', `/api/v1/node/${deviceID}/expire`, {
			disableExpiry: disableExpiry
		});
	}

	export async function deleteAPIKey(prefix: string): Promise<any> {
		return apiFetch('DELETE', `/api/v1/apikey/${prefix}`);
	}

	export async function deletePreAuthKey(id: string): Promise<any> {
		return apiFetch('DELETE', '/api/v1/preauthkey?id=' + encodeURIComponent(id));
	}

	export async function getPolicy(): Promise<string> {
		const data = await apiFetch<{ policy: string }>('GET', '/api/v1/policy');
		return data.policy;
	}

	export async function updatePolicy(policy: string): Promise<string> {
		const data = await apiFetch<{ policy: string }>('PUT', '/api/v1/policy', {
			policy: policy
		});
		return data.policy;
	}

	export async function checkPolicy(policy: string): Promise<any> {
		return apiFetch('POST', '/api/v1/policy/check', {
			policy: policy
		});
	}

	export async function approveRoutes(deviceID: string, routes: string[]): Promise<any> {
		return apiFetch('POST', `/api/v1/node/${deviceID}/approve_routes`, {
			routes: routes
		});
	}

	export async function getHealth(): Promise<any> {
		return apiFetch('GET', '/api/v1/health');
	}

	// getVersion queries the public /version endpoint (no auth required) and
	// returns the headscale server version.
	export async function getVersion(): Promise<{ version: string; commit: string }> {
		return apiFetch('GET', '/version');
	}

	export async function approveAuth(authID: string): Promise<any> {
		return apiFetch('POST', '/api/v1/auth/approve', {
			authId: authID
		});
	}

	export async function rejectAuth(authID: string): Promise<any> {
		return apiFetch('POST', '/api/v1/auth/reject', {
			authId: authID
		});
	}

	export async function getPendingAuthRequests(): Promise<PendingAuthRequest[]> {
		const data = await apiFetch<{ authRequests: PendingAuthRequest[] }>('GET', '/api/v1/auth/pending');
		return data.authRequests ?? [];
	}
</script>
