<script lang="ts">
  import { t, locale, json } from 'svelte-i18n';
  import { writable, get } from 'svelte/store';
  import reloadIconUrl from './assets/icon_reload.svg';
  import copyIconUrl from './assets/icon_copy.svg';
  import logoUrl from './assets/logo.webp';

  const gtag = (window as any).gtag;

  const defaultLocale = 'en';
  const localeFlags = {
    en: 'US',
    pt: 'BR',
    es: 'ES',
    fr: 'FR',
    zh: 'CN',
  };

  const backgroundColors = [
    '#F0F8FF',
    '#FAEBD7',
    '#F5F5DC',
    '#FFE4C4',
    '#FFF8DC',
    '#FFFACD',
    '#FAFAD2',
    '#FFEFD5',
    '#FFDAB9',
    '#EEE8AA',
    '#F5FFFA',
    '#F0FFF0',
    '#F0FFFF',
    '#E6E6FA',
    '#FFF0F5',
    '#FFE4E1',
    '#FFFFF0',
    '#FDF5E6',
    '#FAF0E6',
    '#FFF5EE',
    '#F8F8FF',
    '#FFFAF0',
    '#F5F5F5',
    '#E0FFFF',
    '#ADD8E6',
    '#B0E0E6',
    '#AFEEEE',
    '#87CEFA',
    '#B0C4DE',
    '#FFB6C1',
    '#FFA07A',
    '#EEDD82',
    '#98FB98',
    '#90EE90',
    '#F0E68C',
    '#D8BFD8',
    '#DDA0DD',
    '#C0C0C0',
    '#D3D3D3',
    '#E9967A',
    '#F4A460',
    '#FFDEAD',
    '#FFEBCD',
    '#DEB887',
    '#BC8F8F',
    '#F5DEB3',
    '#FFFFE0',
    '#FFFDD0',
    '#F3FFF3',
    '#F3F3FF',
    '#F0E6FF',
    '#FFF5F8',
    '#FFF0F0',
    '#EEFFEE',
    '#F8F0E0',
    '#F5EBE0',
    '#F5EDE5',
    '#F0F0F8',
    '#F8F5E8',
    '#E8E8E8',
    '#D0FFFF',
    '#BDE0F0',
    '#C0E8EE',
    '#BFFEFF',
  ];

  let currentPhrase = writable('');
  let showCopyConfirmation = writable(false);
  let reloadClicked = false;

  function trackAnalytics(event: string) {
    if (typeof gtag === 'function') {
      try {
        gtag('event', event);
      } catch (error) {
        console.error(`Error tracking event: ${event}`, error);
      }
    }
  }

  function changeLocale(newLocale: string) {
    locale.set(newLocale);
    trackAnalytics(`click_locale_${newLocale}`);
  }

  function initializeLocale() {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.split('-')[0];
      if (Object.keys(localeFlags).includes(browserLang)) {
        changeLocale(browserLang);
      } else {
        changeLocale(defaultLocale);
      }
    } else {
      changeLocale(defaultLocale);
    }
  }

  function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async function updateContent() {
    const phrases = $t('phrases') as unknown as string[];
    let newPhrase = getRandomElement(phrases);
    currentPhrase.set(newPhrase);

    document.body.style.backgroundColor = getRandomElement(backgroundColors);

    trackAnalytics('click_load_new_excuse');

    reloadClicked = true;
    setTimeout(() => (reloadClicked = false), 300);
  }

  async function copyToClipboard() {
    const textToCopy = get(currentPhrase);
    if (!textToCopy) return;

    let success = false;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } catch (err) {}
    }

    if (!success) {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.style.opacity = '0';

      document.body.appendChild(textArea);

      textArea.select();
      try {
        textArea.setSelectionRange(0, 999999);
      } catch (e) {}

      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.error("Failed to run document.execCommand('copy'):", err);
      } finally {
        document.body.removeChild(textArea);
      }
    }

    if (success) {
      trackAnalytics('click_copy_excuse');
    }

    showCopyConfirmation.set(true);
    setTimeout(() => showCopyConfirmation.set(false), 2000);
  }

  initializeLocale();

  locale.subscribe((newLocale) => {
    if (newLocale) {
      updateContent();
    }
  });
</script>

<main class="main-container" role="document" aria-live="polite">
  <div class="flags">
    {#each Object.entries(localeFlags) as [locale, flag]}
      <img
        src="https://flagsapi.com/{flag}/shiny/64.png"
        alt="{flag} flag"
        class="flag-img"
        role="button"
        tabindex="0"
        on:click|stopPropagation={() => changeLocale(locale)}
      />
    {/each}
  </div>

  <div class="content-container">
    <div class="title-container">
      <img class="logo" alt="Logo" src={logoUrl} />
      <p class="sorry-text">{$t('sorry')}</p>
    </div>
    <p class="phrase-text">{$currentPhrase}</p>
    <div class="button-container">
      <button
        class="icon-button"
        class:clicked={reloadClicked}
        on:click={updateContent}
        aria-label="Load new excuse"
      >
        <img src={reloadIconUrl} alt="Reload" class="icon-svg" />
      </button>
      <div class="copy-button-wrapper">
        <button
          class="icon-button"
          on:click={copyToClipboard}
          aria-label="Copy excuse to clipboard"
        >
          <img src={copyIconUrl} alt="Copy" class="icon-svg" />
        </button>
        {#if $showCopyConfirmation}
          <span class="copy-confirmation">{$t('copied')}</span>
        {/if}
      </div>
    </div>
  </div>
</main>
