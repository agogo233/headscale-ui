import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import en from './en';
import zh from './zh';

export type Locale = 'en' | 'zh';
export type Key = keyof typeof en;
export type Vars = Record<string, string | number>;

const dicts: Record<Locale, Record<Key, string>> = { en, zh };

function detectLocale(): Locale {
	if (!browser) return 'en';
	try {
		const saved = localStorage.getItem('hsui.locale');
		if (saved === 'en' || saved === 'zh') return saved;
	} catch {
		// localStorage unavailable
	}
	return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export const locale = writable<Locale>(detectLocale());

locale.subscribe((l) => {
	if (browser) {
		document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
	}
});

function render(key: Key, $locale: Locale, vars?: Vars): string {
	const dict = dicts[$locale];
	let s = dict[key] ?? dicts.en[key] ?? key;
	if (vars) {
		for (const [k, v] of Object.entries(vars)) {
			s = s.replaceAll(`{${k}}`, () => String(v));
		}
	}
	return s;
}

export const t = derived(
	locale,
	($locale) =>
		(key: Key, vars?: Vars): string =>
			render(key, $locale, vars)
);

export function translate(key: Key, vars?: Vars): string {
	return render(key, get(locale), vars);
}

export function setLocale(l: Locale): void {
	locale.set(l);
	if (browser) {
		try {
			localStorage.setItem('hsui.locale', l);
		} catch {
			// localStorage unavailable
		}
	}
}
