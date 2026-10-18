<script lang="ts">
	import { t, locale, setLocale } from '$lib/i18n';
</script>

<h1 class="text-2xl bold text-primary mb-4">{$t('settings.language')}</h1>
<div class="flex gap-2">
	<button class="btn btn-sm capitalize" class:btn-primary={$locale === 'en'} on:click={() => setLocale('en')}>
		{$t('settings.languageEnglish')}
	</button>
	<button class="btn btn-sm" class:btn-primary={$locale === 'zh'} on:click={() => setLocale('zh')}>
		{$t('settings.languageChinese')}
	</button>
</div>
