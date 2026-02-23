// DOM Element Selection 
const lightBtn = document.querySelector('#light-btn');
const darkBtn = document.querySelector('#dark-btn');
const systemBtn = document.querySelector('#system-btn');
const themeText = document.querySelector('#current-theme-text');
const buttons = document.querySelectorAll('.theme-btn');

// 1. Function to apply the theme
function applyTheme(theme) {
    let themeToSet = theme;

    // Handle System Default Mode
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeToSet = prefersDark ? 'dark' : 'light';
    }

    // Update UI state using classList/Attributes 
    document.documentElement.setAttribute('data-theme', themeToSet);
    themeText.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    
    // Highlight active button
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#${theme}-btn`).classList.add('active');

    // Persist user preference
    localStorage.setItem('user-theme', theme);
}

// 2. Event Listeners for buttons
lightBtn.addEventListener('click', () => applyTheme('light'));
darkBtn.addEventListener('click', () => applyTheme('dark'));
systemBtn.addEventListener('click', () => applyTheme('system'));

// 3. System Theme Change Listener
// Automatically updates if system settings change while in 'system' mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('user-theme') === 'system') {
        applyTheme('system');
    }
});

// 4. Initialize on Page Load
const savedTheme = localStorage.getItem('user-theme') || 'system';
applyTheme(savedTheme);