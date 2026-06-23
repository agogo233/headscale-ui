<script context="module" lang="ts">
	import { APIKey, Device, PreAuthKey, User } from '$lib/common/classes';
	import { deviceStore, userStore, apiTestStore} from '$lib/common/stores.js';
	import { sortDevices, sortUsers } from '$lib/common/sorting.svelte';
	import { filterDevices, filterUsers } from './searching.svelte';

	export async function getUsers() {
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for getting users
		let endpointURL = '/api/v1/user';

		//returning variables
		let headscaleUsers = [new User()];
		let headscaleUsersResponse: Response = new Response();

		await fetch(headscaleURL + endpointURL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					// return the api data
					headscaleUsersResponse = response;
				} else {
					return response.text().then((text) => {
						apiTestStore.set('failed');
						throw text;
					});
				}
			})
			.catch((error) => {
				apiTestStore.set('failed');
				throw error;
			});

		await headscaleUsersResponse.json().then((data) => {
			headscaleUsers = data.users;
			// sort the users
			headscaleUsers = sortUsers(headscaleUsers);
		});
		// Set the store
		apiTestStore.set('succeeded');
		userStore.set(headscaleUsers);
		// Filter the store
		filterUsers();
	}

	export async function editUser(currentUserId: string, newUsername: string): Promise<any> {
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		let endpointURL = '/api/v1/user/' + currentUserId + '/rename/' + newUsername;

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function newAPIKey(APIKeyExpiration: string): Promise<string> {
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for editing users
		let endpointURL = '/api/v1/apikey';

		let APIKeyResponse = new Response();
		let APIKeyString = '';

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			},
			body: JSON.stringify({
				expiration: APIKeyExpiration
			})
		})
			.then((response) => {
				if (response.ok) {
					APIKeyResponse = response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
		await APIKeyResponse.json().then((data) => {
			APIKeyString = data.apiKey;
		});

		return APIKeyString;
	}

	export async function expireAPIKey(APIKeyPrefix: string) {
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for editing users
		let endpointURL = '/api/v1/apikey/expire';

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			},
			body: JSON.stringify({
				prefix: APIKeyPrefix
			})
		})
			.then((response) => {
				if (response.ok) {
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function updateTags(deviceID: string, tags: string[]): Promise<any> {

		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for editing users
		let endpointURL = `/api/v1/node/${deviceID}/tags`;

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			},
			body: JSON.stringify({
				tags: tags
			})
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function removeUser(currentUserId: string): Promise<any> {
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for editing users
		let endpointURL = '/api/v1/user/' + currentUserId;

		await fetch(headscaleURL + endpointURL, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function newUser(newUsername: string): Promise<any> {
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for editing users
		let endpointURL = '/api/v1/user';

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			},
			body: JSON.stringify({
				name: newUsername.toLowerCase()
			})
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function getDevices(): Promise<any> {

		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for getting devices
		let endpointURL = `/api/v1/node`;

		//returning variables
		let headscaleDevices = [new Device()];
		let headscaleDeviceResponse: Response = new Response();

		// attempt to get the user data
		await fetch(headscaleURL + endpointURL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					// return the api data
					headscaleDeviceResponse = response;
				} else {
					return response.text().then((text) => {
						apiTestStore.set('failed');
						throw text;
					});
				}
			})
			.catch((error) => {
				apiTestStore.set('failed');
				throw error;
			});

		await headscaleDeviceResponse.json().then((data) => {
			headscaleDevices = data[`nodes`];
			headscaleDevices = sortDevices(headscaleDevices);
		});
		// set the stores
		apiTestStore.set('succeeded');
		deviceStore.set(headscaleDevices);
		// filter the store
		filterDevices();
	}

	export async function getAPIKeys(): Promise<APIKey[]> {
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for editing users
		let endpointURL = '/api/v1/apikey';
		let apiKeysResponse = new Response();
		let apiKeys = [new APIKey()];

		await fetch(headscaleURL + endpointURL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					apiKeysResponse = response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});

		await apiKeysResponse.json().then((data) => {
			apiKeys = data.apiKeys;
		});
		return apiKeys;
	}

 	export async function getPreauthKeys(userID: string): Promise<PreAuthKey[]> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = '/api/v1/preauthkey';

 		let headscalePreAuthKey = [new PreAuthKey()];
 		let headscalePreAuthKeyResponse: Response = new Response();

 		await fetch(headscaleURL + endpointURL, {
 			method: 'GET',
 			headers: {
 				Accept: 'application/json',
 				Authorization: `Bearer ${headscaleAPIKey}`
 			}
 		})
 			.then((response) => {
 				if (response.ok) {
 					headscalePreAuthKeyResponse = response;
 				} else {
 					return response.text().then((text) => {
 						throw JSON.parse(text).detail ?? JSON.parse(text).title;
 					});
 				}
 			})
 			.catch((error) => {
 				throw error;
 			});

 		await headscalePreAuthKeyResponse.json().then((data) => {
 			headscalePreAuthKey = data.preAuthKeys;
 			if (userID) {
  				headscalePreAuthKey = headscalePreAuthKey.filter((k) => k.user?.id === userID);
 			}
 		});
 		return headscalePreAuthKey;
 	}

	export async function newPreAuthKey(userID: string, expiry: string, reusable: boolean, ephemeral: boolean): Promise<any> {
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';
		// endpoint url for editing users
		let endpointURL = '/api/v1/preauthkey';

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			},
			body: JSON.stringify({
				user: userID,
				expiration: expiry,
				reusable: reusable,
				ephemeral: ephemeral
			})
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function expirePreAuthKey(preAuthKeyID: string): Promise<any> {
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for removing devices
		let endpointURL = '/api/v1/preauthkey/expire';

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			},
			body: JSON.stringify({
				id: preAuthKeyID
			})
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function newDevice(key: string, userId: string): Promise<any> {

		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for editing users
		let endpointURL = `/api/v1/node/register`;

		let params = new URLSearchParams({ user: userId, key });
		await fetch(headscaleURL + endpointURL + '?' + params, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function moveDevice(deviceID: string, userID: string): Promise<any> {

		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for editing users
		let endpointURL = `/api/v1/node/${deviceID}/user`;

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			},
			body: JSON.stringify({
				user: userID
			})
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function renameDevice(deviceID: string, name: string): Promise<any> {

		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for editing users
		let endpointURL = `/api/v1/node/${deviceID}/rename/${name}`;

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function removeDevice(deviceID: string): Promise<any> {
		
		// variables in local storage
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		// endpoint url for removing devices
		let endpointURL = `/api/v1/node/${deviceID}`;

		await fetch(headscaleURL + endpointURL, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function expireDevice(deviceID: string, disableExpiry: boolean): Promise<any> {
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		let endpointURL = `/api/v1/node/${deviceID}/expire`;

		await fetch(headscaleURL + endpointURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			},
			body: JSON.stringify({
				disableExpiry: disableExpiry
			})
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function deleteAPIKey(prefix: string): Promise<any> {
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		let endpointURL = `/api/v1/apikey/${prefix}`;

		await fetch(headscaleURL + endpointURL, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

 	export async function deletePreAuthKey(id: string): Promise<any> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = '/api/v1/preauthkey';

		await fetch(headscaleURL + endpointURL + '?id=' + id, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					return response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	export async function getPolicy(): Promise<string> {
		let headscaleURL = localStorage.getItem('headscaleURL') || '';
		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

		let endpointURL = '/api/v1/policy';
		let policyResponse = new Response();
		let policy = '';

		await fetch(headscaleURL + endpointURL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${headscaleAPIKey}`
			}
		})
			.then((response) => {
				if (response.ok) {
					policyResponse = response;
				} else {
					return response.text().then((text) => {
						throw JSON.parse(text).detail ?? JSON.parse(text).title;
					});
				}
			})
			.catch((error) => {
				throw error;
			});

		await policyResponse.json().then((data) => {
			policy = data.policy;
		});
		return policy;
	}

 	export async function updatePolicy(policy: string): Promise<string> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = '/api/v1/policy';
 		let policyResponse = new Response();
 		let updatedPolicy = '';

 		await fetch(headscaleURL + endpointURL, {
 			method: 'PUT',
 			headers: {
 				Accept: 'application/json',
 				Authorization: `Bearer ${headscaleAPIKey}`
 			},
 			body: JSON.stringify({
 				policy: policy
 			})
 		})
 			.then((response) => {
 				if (response.ok) {
 					policyResponse = response;
 				} else {
 					return response.text().then((text) => {
 						throw JSON.parse(text).detail ?? JSON.parse(text).title;
 					});
 				}
 			})
 			.catch((error) => {
 				throw error;
 			});

 		await policyResponse.json().then((data) => {
 			updatedPolicy = data.policy;
 		});
 		return updatedPolicy;
 	}

 	export async function checkPolicy(policy: string): Promise<any> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = '/api/v1/policy/check';

 		await fetch(headscaleURL + endpointURL, {
 			method: 'POST',
 			headers: {
 				Accept: 'application/json',
 				Authorization: `Bearer ${headscaleAPIKey}`
 			},
 			body: JSON.stringify({
 				policy: policy
 			})
 		})
 			.then((response) => {
 				if (response.ok) {
 					return response;
 				} else {
 					return response.text().then((text) => {
 						throw JSON.parse(text).detail ?? JSON.parse(text).title;
 					});
 				}
 			})
 			.catch((error) => {
 				throw error;
 			});
 	}

 	export async function getDevice(deviceID: string): Promise<Device> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = `/api/v1/node/${deviceID}`;
 		let deviceResponse: Response = new Response();

 		await fetch(headscaleURL + endpointURL, {
 			method: 'GET',
 			headers: {
 				Accept: 'application/json',
 				Authorization: `Bearer ${headscaleAPIKey}`
 			}
 		})
 			.then((response) => {
 				if (response.ok) {
 					deviceResponse = response;
 				} else {
 					return response.text().then((text) => {
 						throw JSON.parse(text).detail ?? JSON.parse(text).title;
 					});
 				}
 			})
 			.catch((error) => {
 				throw error;
 			});

 		return await deviceResponse.json();
 	}

 	export async function approveRoutes(deviceID: string, routes: string[]): Promise<any> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = `/api/v1/node/${deviceID}/approve_routes`;

 		await fetch(headscaleURL + endpointURL, {
 			method: 'POST',
 			headers: {
 				Accept: 'application/json',
 				Authorization: `Bearer ${headscaleAPIKey}`
 			},
 			body: JSON.stringify({
 				routes: routes
 			})
 		})
 			.then((response) => {
 				if (response.ok) {
 					return response;
 				} else {
 					return response.text().then((text) => {
 						throw JSON.parse(text).detail ?? JSON.parse(text).title;
 					});
 				}
 			})
 			.catch((error) => {
 				throw error;
 			});
 	}

 	export async function getHealth(): Promise<any> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = '/api/v1/health';

 		let healthResponse: Response = new Response();

 		await fetch(headscaleURL + endpointURL, {
 			method: 'GET',
 			headers: {
 				Accept: 'application/json',
 				Authorization: `Bearer ${headscaleAPIKey}`
 			}
 		})
 			.then((response) => {
 				if (response.ok) {
 					healthResponse = response;
 				} else {
 					return response.text().then((text) => {
 						throw JSON.parse(text).detail ?? JSON.parse(text).title;
 					});
 				}
 			})
 			.catch((error) => {
 				throw error;
 			});

 		return await healthResponse.json();
 	}

 	export async function registerAuth(data: { user: string; key?: string }): Promise<any> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = '/api/v1/auth/register';

 		await fetch(headscaleURL + endpointURL, {
 			method: 'POST',
 			headers: {
 				Accept: 'application/json',
 				Authorization: `Bearer ${headscaleAPIKey}`
 			},
 			body: JSON.stringify(data)
 		})
 			.then((response) => {
 				if (response.ok) {
 					return response;
 				} else {
 					return response.text().then((text) => {
 						throw JSON.parse(text).detail ?? JSON.parse(text).title;
 					});
 				}
 			})
 			.catch((error) => {
 				throw error;
 			});
 	}

 	export async function approveAuth(authID: string): Promise<any> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = '/api/v1/auth/approve';

 		await fetch(headscaleURL + endpointURL, {
 			method: 'POST',
 			headers: {
 				Accept: 'application/json',
 				Authorization: `Bearer ${headscaleAPIKey}`
 			},
 			body: JSON.stringify({
 				auth_id: authID
 			})
 		})
 			.then((response) => {
 				if (response.ok) {
 					return response;
 				} else {
 					return response.text().then((text) => {
 						throw JSON.parse(text).detail ?? JSON.parse(text).title;
 					});
 				}
 			})
 			.catch((error) => {
 				throw error;
 			});
 	}

 	export async function rejectAuth(authID: string): Promise<any> {
 		let headscaleURL = localStorage.getItem('headscaleURL') || '';
 		let headscaleAPIKey = localStorage.getItem('headscaleAPIKey') || '';

 		let endpointURL = '/api/v1/auth/reject';

 		await fetch(headscaleURL + endpointURL, {
 			method: 'POST',
 			headers: {
 				Accept: 'application/json',
 				Authorization: `Bearer ${headscaleAPIKey}`
 			},
 			body: JSON.stringify({
 				auth_id: authID
 			})
 		})
 			.then((response) => {
 				if (response.ok) {
 					return response;
 				} else {
 					return response.text().then((text) => {
 						throw JSON.parse(text).detail ?? JSON.parse(text).title;
 					});
 				}
 			})
 			.catch((error) => {
 				throw error;
 			});
 	}
</script>
