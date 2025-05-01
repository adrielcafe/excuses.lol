<script lang="ts">
  import { t, locale } from 'svelte-i18n';
  import { writable, get } from 'svelte/store';
  import flagUsUrl from './assets/flag_us.svg';
  import flagBrUrl from './assets/flag_br.svg';
  import flagEsUrl from './assets/flag_es.svg';
  import flagFrUrl from './assets/flag_fr.svg';
  import flagZhUrl from './assets/flag_zh.svg';
  import reloadIconUrl from './assets/icon_reload.svg';
  import copyIconUrl from './assets/icon_copy.svg';

  const supportedLocales = ['en', 'pt', 'es', 'fr', 'zh'];

  const colors = [
      '#F5DEB3', // Wheat
      '#FFB6C1', // LightPink
      '#FFDAB9', // PeachPuff
      '#E6E6FA', // Lavender
      '#FFFACD', // LemonChiffon
      '#ADD8E6', // LightBlue
      '#F0E68C', // Khaki
      '#90EE90', // LightGreen
      '#D3D3D3', // LightGray
      '#FFDEAD', // NavajoWhite
      '#FAEBD7', // AntiqueWhite
      '#AFEEEE', // PaleTurquoise
      '#FFE4E1', // MistyRose
      '#FFF0F5', // LavenderBlush
      '#F0FFF0', // Honeydew
      '#F5F5DC', // Beige
      '#FFF5EE', // SeaShell
      '#F5FFFA', // MintCream
      '#E0FFFF', // LightCyan
      '#F0FFFF', // Azure
      '#FFEFD5', // PapayaWhip
      '#FFEBCD', // BlanchedAlmond
      '#FAF0E6', // Linen
      '#FFF8DC', // Cornsilk
      '#B0E0E6', // PowderBlue
      '#C0C0C0', // Silver
      '#D8BFD8', // Thistle
      '#BDB76B'  // DarkKhaki
    ];

  let currentPhrase = writable('');
  let currentBgColor = writable('#E6E6FA');
  let reloadClicked = false;
  let showCopyConfirmation = writable(false);

  function initializeLocale() {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.split('-')[0];
      if (supportedLocales.includes(browserLang)) {
        locale.set(browserLang);
      } else {
        locale.set('en');
      }
    } else {
      locale.set('en');
    }
  }

  function changeLocale(newLocale: string) {
    locale.set(newLocale);
  }

  function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async function updateContent() {
    let lang = get(locale);
    if (!lang || !supportedLocales.includes(lang)) {
      lang = 'en';
      if (get(locale) !== 'en') locale.set('en');
    }

    try {
      const langModule = await import(`./i18n/${lang}.json`);
      const phrasesForLang = langModule.phrases;

      if (phrasesForLang && phrasesForLang.length > 0) {
          currentPhrase.set(getRandomElement(phrasesForLang));
      } else {
          const fallbackModule = await import('./i18n/en.json');
          currentPhrase.set(getRandomElement(fallbackModule.phrases));
      }
    } catch (error) {
      console.error(`Failed to load language file for ${lang}:`, error);
      try {
        const fallbackModule = await import('./i18n/en.json');
        currentPhrase.set(getRandomElement(fallbackModule.phrases));
      } catch (fallbackError) {
        console.error('Failed to load fallback English language file:', fallbackError);
        currentPhrase.set("Oops, something went wrong loading excuses!");
      }
    }

    const newBgColor = getRandomElement(colors);
    currentBgColor.set(newBgColor);

    reloadClicked = true;
    setTimeout(() => reloadClicked = false, 300);
  }
  
  initializeLocale();

  locale.subscribe((newLocale) => {
    if (newLocale) {
        updateContent();
    }
  });

  async function copyToClipboard() {
    const textToCopy = get(currentPhrase);
    if (textToCopy && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        showCopyConfirmation.set(true);
        setTimeout(() => showCopyConfirmation.set(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }
</script>

<main
  style="background-color: {$currentBgColor};"
  class="main-container"
  role="document"
  aria-live="polite"
>
  <div class="flags-container">
    <div class="flags-inner-container">
      <img
        src={flagUsUrl}
        alt="US Flag"
        class="flag-img"
        aria-label="Change language to English"
        role="button"
        tabindex="0"
        on:click|stopPropagation={() => changeLocale('en')}
      />
      <img
        src={flagBrUrl}
        alt="Brazil Flag"
        class="flag-img"
        aria-label="Change language to Portuguese"
        role="button"
        tabindex="0"
        on:click|stopPropagation={() => changeLocale('pt')}
      />
      <img
        src={flagEsUrl}
        alt="Spain Flag"
        class="flag-img"
        aria-label="Change language to Spanish"
        role="button"
        tabindex="0"
        on:click|stopPropagation={() => changeLocale('es')}
      />
      <img
        src={flagFrUrl}
        alt="France Flag"
        class="flag-img"
        aria-label="Change language to French"
        role="button"
        tabindex="0"
        on:click|stopPropagation={() => changeLocale('fr')}
      />
      <img
        src={flagZhUrl}
        alt="China Flag"
        class="flag-img"
        aria-label="Change language to Chinese"
        role="button"
        tabindex="0"
        on:click|stopPropagation={() => changeLocale('zh')}
      />
    </div>
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
        <img src={reloadIconUrl} alt="Reload" class="icon-svg" width="24" height="24" />
      </button>
      {#if $currentPhrase}
        <div class="copy-button-wrapper">
          <button
            class="icon-button"
            on:click={copyToClipboard}
            aria-label="Copy excuse to clipboard"
          >
            <img src={copyIconUrl} alt="Copy" class="icon-svg" width="20" height="20" />
          </button>
          {#if $showCopyConfirmation}
            <span class="copy-confirmation">{$t('copied')}</span>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Gabriela&display=swap');

  @keyframes fade-in-out {
    0% { opacity: 0; transform: translateY(-50%) translateX(-5px); }
    10% { opacity: 1; transform: translateY(-50%) translateX(0); }
    90% { opacity: 1; transform: translateY(-50%) translateX(0); }
    100% { opacity: 0; transform: translateY(-50%) translateX(0); }
  }

  @keyframes button-click-animation {
    50% { transform: scale(0.9); }
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
    --icon-button-size: 40px;
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
    padding: var(--spacing-lg);
    transition: background-color var(--transition-duration-long);
  }

  .flags-container {
    width: 100%;
  }

  .flags-inner-container {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
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
    gap: var(--spacing-md);
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
    padding: var(--spacing-xs) var(--spacing-md);
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
    transition: background-color var(--transition-duration), transform var(--transition-duration) ease-out;
  }

  .icon-button:hover {
    background-color: var(--button-hover-bg);
  }

  .icon-button:active,
  .icon-button.clicked {
    animation: button-click-animation var(--animation-duration-short) ease-out;
  }

  .icon-button svg,
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
  }

  .flag-img {
    height: var(--flag-height);
    width: auto;
    cursor: pointer;
    opacity: var(--flag-opacity);
    transition: opacity var(--transition-duration);
    vertical-align: middle;
  }

  .flag-img:hover {
    opacity: var(--flag-opacity-hover);
  }

  @media (max-width: 768px) { /* Tablet and smaller */
    :root {
      --font-size-sorry: 1.5rem;
      --font-size-phrase: 2rem;
      --flag-height: 1rem;
      --spacing-md: 0.6rem;
      --spacing-lg: 0.8rem;
      --spacing-xl: 1.5rem;
    }

    .flags-inner-container {
      gap: var(--spacing-sm);
    }
  }

  @media (max-width: 480px) { /* Mobile phones */
    :root {
      --font-size-sorry: 2rem;
      --font-size-phrase: 2.2rem;
      --flag-height: 1.5rem;
      --icon-button-size: 36px;
      --spacing-sm: 0.4rem;
      --spacing-md: 0.5rem;
      --spacing-lg: 0.7rem;
      --spacing-xl: 1.2rem;
    }

    .main-container {
        padding: var(--spacing-md);
    }

    .flags-inner-container {
      gap: var(--spacing-xs);
      flex-wrap: wrap;
      justify-content: center;
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
