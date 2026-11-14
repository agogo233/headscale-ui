import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
	id: number;
	message: string;
	type: ToastType;
}

export const toastStore = writable<ToastItem[]>([]);

let nextId = 0;

export function toast(message: string, type: ToastType = 'info', ms = 3000): number {
	const id = ++nextId;
	toastStore.update((list) => [...list, { id, message, type }]);
	if (ms > 0) {
		setTimeout(() => dismissToast(id), ms);
	}
	return id;
}

export function dismissToast(id: number): void {
	toastStore.update((list) => list.filter((item) => item.id !== id));
}
