document.addEventListener('DOMContentLoaded', function() {
    // Simple initialization without waiting for fonts - to ensure content displays
    initializeCore();
    
    function initializeCore() {
        console.log("Initializing core functionality");
        
        // Simplified AOS settings that won't interfere with text display
        if (typeof AOS === 'undefined') {
            console.warn('AOS is not properly initialized. Ensure AOS library is included.');
            AOS = {
                init: function() {} // Dummy function to prevent errors
            };
        }

        // Use simpler AOS settings that prioritize content visibility
        AOS.init({
            duration: 600,
            easing: 'ease',
            once: true, // Changed to true so elements stay visible after animation
            offset: 100,
            delay: 0,
            disable: window.innerWidth < 768 // Disable on mobile devices
        });

        // Ensure all elements become visible regardless of animation state
        setTimeout(function() {
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }, 1500);

        // Mobile menu toggle
        const menuBtn = document.querySelector('.menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuBtn) {
            menuBtn.addEventListener('click', function() {
                this.classList.toggle('open');
                navLinks.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking a nav link
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (menuBtn && menuBtn.classList.contains('open')) {
                    menuBtn.classList.remove('open');
                    navLinks.classList.remove('active');
                }
            });
        });

        // Header scroll effect - simplified
        const header = document.querySelector('header');
        if (header) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }

        // Theme toggle functionality
        initThemeToggle();

        // Initialize Text Analyzer functionality
        initTextAnalyzer();
    }
});

// Initialize theme toggle and load saved preference
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        // Save preference to localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Also check system preference if no saved preference
    if (!savedTheme) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDarkScheme.matches) {
            document.body.classList.add('dark-theme');
        }
    }
}

// Hide the scroll indicator and ensure all content is visible
document.addEventListener('DOMContentLoaded', function() {
    // Hide the scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.display = 'none';
    }
    
    // Force all content to be visible after a delay as a failsafe
    setTimeout(function() {
        document.body.querySelectorAll('*').forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
                el.style.opacity = '1';
            }
        });
        
        // Ensure theme is properly applied after animations complete
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }, 2000);
});

// Text Analyzer Logic - Fixed implementation
function initTextAnalyzer() {
    console.log("Initializing Text Analyzer");
    
    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const charCount = document.getElementById('char-count');
    const basicStats = document.getElementById('basic-stats');
    const pronounsStats = document.getElementById('pronouns-stats');
    const prepositionsStats = document.getElementById('prepositions-stats');
    const articlesStats = document.getElementById('articles-stats');

    // Check if all elements exist
    if (!textInput || !analyzeBtn || !charCount || !basicStats || !pronounsStats || !prepositionsStats || !articlesStats) {
        console.warn('Text analyzer missing required DOM elements');
        return; // Exit if any element is missing
    }

    // Update character count as user types
    textInput.addEventListener('input', function() {
        const count = textInput.value.length;
        charCount.textContent = `${count} characters`;
    });

    // Set initial character count
    charCount.textContent = `0 characters`;

    // Analyze text when button is clicked
    analyzeBtn.addEventListener('click', function() {
        console.log("Analyze button clicked");
        const text = textInput.value.trim();
        
        if (text.length === 0) {
            alert('Please enter some text to analyze.');
            return;
        }
        
        // Analyze text
        analyzeText(text);
    });

    function analyzeText(text) {
        console.log("Analyzing text of length: " + text.length);
        
        // Basic statistics with the requested counts
        const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
        const wordCount = (text.match(/\b\w+\b/g) || []).length;
        const spaceCount = (text.match(/\s/g) || []).length;
        const newlineCount = (text.match(/\n/g) || []).length;
        const specialSymbolCount = (text.match(/[^\w\s]/g) || []).length;
        
        // Display basic statistics
        basicStats.innerHTML = `
            <div class="result-item"><span>Letters:</span> <span class="count">${letterCount}</span></div>
            <div class="result-item"><span>Words:</span> <span class="count">${wordCount}</span></div>
            <div class="result-item"><span>Spaces:</span> <span class="count">${spaceCount}</span></div>
            <div class="result-item"><span>Newlines:</span> <span class="count">${newlineCount}</span></div>
            <div class="result-item"><span>Special Symbols:</span> <span class="count">${specialSymbolCount}</span></div>
        `;
        
        // Analyze pronouns
        const pronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'who', 'whom', 'whose', 'this', 'that', 'these', 'those', 'what', 'which', 'whoever', 'whomever', 'whichever', 'whatever'];
        const pronounCounts = countWordsFromList(text, pronouns);
        displayWordCounts(pronounsStats, pronounCounts);
        
        // Analyze prepositions
        const prepositions = ['in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'of', 'off', 'out', 'over', 'under', 'around', 'across', 'along', 'against', 'among', 'behind', 'beyond', 'during', 'except', 'inside', 'outside', 'past', 'since', 'until'];
        const prepositionCounts = countWordsFromList(text, prepositions);
        displayWordCounts(prepositionsStats, prepositionCounts);
        
        // Analyze articles
        const articles = ['a', 'an'];
        const articleCounts = countWordsFromList(text, articles);
        displayWordCounts(articlesStats, articleCounts);
    }

    function countWordsFromList(text, wordList) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const counts = {};
        
        wordList.forEach(word => {
            counts[word] = 0;
        });
        
        words.forEach(word => {
            if (wordList.includes(word.toLowerCase())) {
                counts[word.toLowerCase()]++;
            }
        });
        
        return counts;
    }

    function displayWordCounts(element, counts) {
        element.innerHTML = '';
        
        // Sort by count (descending)
        const sortedWords = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        
        // Only display words that appear at least once
        const wordsFound = sortedWords.filter(word => counts[word] > 0);
        
        if (wordsFound.length === 0) {
            element.innerHTML = '<p>None found in text.</p>';
            return;
        }
        
        wordsFound.forEach(word => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `<span>${word}:</span> <span class="count">${counts[word]}</span>`;
            element.appendChild(div);
        });
    }
}