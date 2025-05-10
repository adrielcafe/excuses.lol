import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

import en from '../i18n/en.json';
import pt from '../i18n/pt.json';
import es from '../i18n/es.json';
import fr from '../i18n/fr.json';
import zh from '../i18n/zh.json';

register('en', () => Promise.resolve(en));
register('pt', () => Promise.resolve(pt));
register('es', () => Promise.resolve(es));
register('fr', () => Promise.resolve(fr));
register('zh', () => Promise.resolve(zh));

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});
