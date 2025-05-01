import { mount } from 'svelte'
import './app.css'
import './lib/i18n'; // Import and initialize svelte-i18n
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
