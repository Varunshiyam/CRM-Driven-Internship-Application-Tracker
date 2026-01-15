import { LightningElement, track } from 'lwc';

export default class ThemeToggle extends LightningElement {
    @track isDark = false;

    get buttonLabel() {
        return this.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        document.body.classList.toggle('dark-mode', this.isDark);
        localStorage.setItem('darkMode', this.isDark);
    }

    connectedCallback() {
        this.isDark = localStorage.getItem('darkMode') === 'true';
        document.body.classList.toggle('dark-mode', this.isDark);
    }
}
