// Critical theme initialization (should be inlined in HTML head)
(function() {
    const storedTheme = localStorage.getItem('theme-preference') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', storedTheme);
})();

// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Theme system implementation
    const themeSystem = () => {
        const storageKey = 'theme-preference';
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const getColorPreference = () => {
            const stored = localStorage.getItem(storageKey);
            return stored || (mediaQuery.matches ? 'dark' : 'light');
        };

        const setPreference = (value) => {
            localStorage.setItem(storageKey, value);
            document.documentElement.setAttribute('data-theme', value);
        };

        const onClick = () => {
            const newTheme = theme.value === 'light' ? 'dark' : 'light';
            theme.value = newTheme;
            setPreference(newTheme);
        };

        const theme = {
            value: getColorPreference(),
        };

        // Initialize
        setPreference(theme.value);
        
        return {
            init: (toggleButton) => {
                if(toggleButton) {
                    toggleButton.addEventListener('click', onClick);
                }
                mediaQuery.addEventListener('change', ({matches: isDark}) => {
                    theme.value = isDark ? 'dark' : 'light';
                    setPreference(theme.value);
                });
            }
        };
    };

    // Initialize theme system first
    const themeToggle = document.querySelector('#theme-toggle');
    const theme = themeSystem();
    theme.init(themeToggle);

    // File upload handler
    const fileUpload = document.getElementById('fileUpload');
    if(fileUpload) {
        fileUpload.addEventListener('change', function(e) {
            const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
            this.parentElement.setAttribute('data-file', fileName);
        });
    }

    // Blog content paste handler
    const blogContent = document.querySelector('.blog-content');
    if(blogContent) {
        blogContent.addEventListener('paste', function(e) {
            e.preventDefault();
            const clipboardData = e.clipboardData || window.clipboardData;
            
            // Process images
            if (clipboardData.files && clipboardData.files.length > 0) {
                Array.from(clipboardData.files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const img = document.createElement('img');
                            img.src = event.target.result;
                            this.appendChild(img);
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // Process text
            const text = clipboardData.getData('text/plain');
            const cleanText = document.createTextNode(text);
            this.appendChild(cleanText);

            // Force redraw to apply CSS
            setTimeout(() => {
                this.innerHTML = this.innerHTML.replace(/style="[^"]*"/gi, '');
            }, 0);
        });
    }

    // Profile image popup system
    if (!document.getElementById('popupOverlay')) {
        const popupHTML = `
            <div class="popup-overlay" id="popupOverlay">
                <div class="popup-image-wrapper">
                    <img src="" alt="Popup Profile" id="popupImage">
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }

    // Click handler for all profile images
    document.querySelectorAll('.profile-pic').forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const popupOverlay = document.getElementById('popupOverlay');
            const popupImage = document.getElementById('popupImage');
            if(popupOverlay && popupImage) {
                popupImage.src = this.src;
                popupOverlay.style.display = 'flex';
            }
        });
    });

    // Close popup
    document.getElementById('popupOverlay')?.addEventListener('click', function(e) {
        if(e.target === this) {
            this.style.display = 'none';
        }
    });
});