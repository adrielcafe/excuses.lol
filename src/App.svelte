<script lang="ts">
  import { t, locale, json } from 'svelte-i18n';
  import { writable, get } from 'svelte/store';
  import reloadIconUrl from './assets/icon_reload.svg';
  import copyIconUrl from './assets/icon_copy.svg';

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
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', event);
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
    <p class="sorry-text">{$t('sorry')}</p>
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

<style>
  @import url('https://fonts.googleapis.com/css2?family=Gabriela&display=swap');

  @keyframes fade-in-out {
    0% {
      opacity: 0;
      transform: translateY(-50%) translateX(-5px);
    }
    10% {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
    90% {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-50%) translateX(0);
    }
  }

  @keyframes button-click-animation {
    50% {
      transform: scale(0.9);
    }
  }

  :root {
    --text-color-primary: #424242;
    --text-color-secondary: #616161;
    --text-color-dark: #000000;
    --button-border-color: var(--text-color-dark);
    --button-hover-bg: rgba(0, 0, 0, 0.1);
    --copy-confirm-bg: rgba(0, 0, 0, 0.7);
    --copy-confirm-text: white;
    --flag-opacity: 0.7;
    --flag-opacity-hover: 1;
    --font-family-display: 'Gabriela', cursive;
    --font-size-sorry: 3rem;
    --font-size-phrase: 4rem;
    --font-size-copy-confirm: 0.8rem;
    --icon-button-size: 64px;
    --flag-height: 2rem;
    --spacing-xs: 0.2rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 0.8rem;
    --spacing-lg: 1rem;
    --spacing-xl: 2rem;
    --transition-duration: 0.2s;
    --transition-duration-long: 0.5s;
    --animation-duration-short: 0.3s;
    --animation-duration-copy: 2s;
  }

  .main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    color: var(--text-color-dark);
    text-align: center;
    transition: background-color var(--transition-duration-long);
  }

  .content-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .button-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-lg);
  }

  .copy-button-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .copy-confirmation {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: var(--spacing-sm);
    background-color: var(--copy-confirm-bg);
    color: var(--copy-confirm-text);
    padding: var(--spacing-sm);
    border-radius: 4px;
    font-size: var(--font-size-copy-confirm);
    white-space: nowrap;
    animation: fade-in-out var(--animation-duration-copy) ease-in-out forwards;
    pointer-events: none;
  }

  .icon-button {
    appearance: none;
    background: none;
    border: 1px solid var(--button-border-color);
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-button-size);
    height: var(--icon-button-size);
    border-radius: 50%;
    cursor: pointer;
    transition:
      background-color var(--transition-duration),
      transform var(--transition-duration) ease-out;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    outline: none;
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button:active,
  .icon-button.clicked {
    animation: button-click-animation var(--animation-duration-short) ease-out;
  }

  .icon-button img.icon-svg {
    display: block;
  }

  .sorry-text {
    color: var(--text-color-secondary);
    font-family: var(--font-family-display);
    font-size: var(--font-size-sorry);
    line-height: 1;
    margin-block: 0 var(--spacing-sm);
  }

  .phrase-text {
    color: var(--text-color-primary);
    font-family: var(--font-family-display);
    font-size: var(--font-size-phrase);
    line-height: 1.1;
    font-weight: 700;
    margin-block: 0 var(--spacing-xl);
    max-width: 90vw;
    min-height: 215px;
  }

  .flags {
    padding: var(--spacing-sm) 0;
    gap: var(--spacing-xs);
    display: inline-flex;
  }

  .flag-img {
    height: var(--flag-height);
    width: auto;
    cursor: pointer;
    opacity: var(--flag-opacity);
    transition: opacity var(--transition-duration);
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    outline: none;
  }

  @media (max-width: 768px) {
    /* Tablet and smaller */
    :root {
      --font-size-sorry: 2rem;
      --font-size-phrase: 3rem;
      --flag-height: 1.7rem;
      --icon-button-size: 48px;
      --spacing-md: 0.6rem;
      --spacing-lg: 0.8rem;
      --spacing-xl: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    /* Mobile phones */
    :root {
      --font-size-sorry: 2rem;
      --font-size-phrase: 2.2rem;
      --spacing-sm: 0.4rem;
      --spacing-md: 0.5rem;
      --spacing-lg: 0.7rem;
      --spacing-xl: 1.2rem;
    }

    .phrase-text {
      min-height: 310px;
    }

    .button-container {
      margin-top: var(--spacing-md);
    }

    .copy-confirmation {
      font-size: 0.7rem;
      padding: var(--spacing-xs) var(--spacing-sm);
    }
  }
</style>
