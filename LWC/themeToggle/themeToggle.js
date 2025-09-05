import { LightningElement, track } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import THEME from '@salesforce/resourceUrl/theme';

let stylesLoaded = false;

export default class ThemeToggle extends LightningElement {
  @track darkMode = false;

  connectedCallback() {
    // Load saved preference
    const saved = localStorage.getItem('internship_theme');
    this.darkMode = saved === 'dark';

    // Apply immediately
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    }

    // Load CSS once
    if (!stylesLoaded) {
      loadStyle(this, THEME + '/theme.css');
      stylesLoaded = true;
    }
  }

  get label() {
    return this.darkMode ? '🌙 Dark' : '☀️ Light';
  }

  handleToggle() {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('internship_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('internship_theme', 'light');
    }
  }
}
