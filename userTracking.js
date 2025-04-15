/**
 * User Interaction Tracking Script
 * Logs clicks and views of page elements with timestamps
 */

// Initialize tracking once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing user interaction tracking...");
    // Small delay to ensure all elements are properly loaded
    setTimeout(function() {
        initializeTracking();
    }, 1000);
});

function initializeTracking() {
    // Track clicks on all elements
    trackClicks();
    
    // Track element views using Intersection Observer
    trackElementViews();
    
    console.log("Tracking initialized successfully");
}

// Function to track clicks on all elements
function trackClicks() {
    document.addEventListener('click', function(event) {
        // Get the clicked element
        const target = event.target;
        
        // Get event timestamp
        const timestamp = new Date().toISOString();
        
        // Determine the element type and context
        const elementInfo = getElementInfo(target);
        
        // Log the interaction
        console.log(`${timestamp}, click, ${elementInfo}`);
    });
}

// Function to track when elements come into view
function trackElementViews() {
    console.log("Setting up view tracking...");
    
    // Elements to track views for - with more specific selectors
    const elementsToTrack = [
        { selector: '.about-text p:first-child', description: 'About paragraph' },
        { selector: '#profile-picture', description: 'Profile picture' },
        { selector: '.gallery-img', description: 'Birthplace image' },
        { selector: '.timeline-content', description: 'Education item' },
        { selector: '.achievement-card', description: 'Achievement' },
        { selector: '.skill-item', description: 'Technical skill' },
        { selector: 'a[href="./assets/cv.pdf"]', description: 'CV link' }
    ];
    
    // Create options for intersection observer
    const options = {
        root: null, // use viewport
        rootMargin: '0px',
        threshold: 0.5 // element is considered viewed when 50% visible
    };
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const timestamp = new Date().toISOString();
                const element = entry.target;
                
                // Get custom description if available
                let description = element.dataset.trackDescription;
                
                if (!description) {
                    description = getElementInfo(element);
                }
                
                console.log(`${timestamp}, view, ${description}`);
                
                // Unobserve after first view to prevent duplicate logs
                observer.unobserve(element);
            }
        });
    }, options);
    
    // Track each element type
    elementsToTrack.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        
        if (elements.length === 0) {
            console.log(`No elements found for selector: ${item.selector}`);
        } else {
            console.log(`Found ${elements.length} elements for: ${item.selector}`);
        }
        
        elements.forEach(element => {
            // Add a custom description attribute for more meaningful logging
            element.dataset.trackDescription = item.description;
            observer.observe(element);
        });
    });
    
    // Additional debug info about what's being observed
    console.log("View tracking setup complete");
}

// Helper function to determine element type and context
function getElementInfo(element) {
    // Default element description
    let elementType = element.tagName.toLowerCase();
    let description = "unknown element";
    
    // Check for specific elements by ID
    if (element.id === 'profile-picture') {
        return "image (profile picture)";
    }
    
    // Check element classes and parents for context
    if (element.classList.contains('gallery-img') || element.closest('.gallery-img-container')) {
        const caption = element.closest('.gallery-img-container')?.getAttribute('data-caption');
        return `image (birthplace: ${caption || 'gallery image'})`;
    }
    
    if (element.classList.contains('nav-item') || element.closest('.nav-item')) {
        const text = element.textContent || element.closest('.nav-item')?.textContent;
        return `navigation link (${text?.trim()})`;
    }
    
    // About section paragraphs
    if (element.closest('.about-text')) {
        return "text (about section paragraph)";
    }
    
    // Timeline/education content
    if (element.closest('.timeline-content')) {
        const heading = element.closest('.timeline-content').querySelector('h3');
        return `education (${heading ? heading.textContent.trim() : 'education item'})`;
    }
    
    // Achievement cards
    if (element.closest('.achievement-card')) {
        const heading = element.closest('.achievement-card').querySelector('h4');
        return `achievement (${heading ? heading.textContent.trim() : 'achievement item'})`;
    }
    
    // Skills
    if (element.closest('.skill-item')) {
        const skillName = element.closest('.skill-item').querySelector('.skill-info span:first-child');
        return `skill (${skillName ? skillName.textContent.trim() : 'technical skill'})`;
    }
    
    // CV download link
    if (element.getAttribute('href') === './assets/cv.pdf' || element.closest('a[href="./assets/cv.pdf"]')) {
        return "link (CV download)";
    }
    
    // Check for common elements
    switch (elementType) {
        case 'button':
            return `button (${element.textContent.trim() || element.className})`;
        case 'a':
            return `link (${element.textContent.trim() || element.href})`;
        case 'img':
            return `image (${element.alt || element.src.split('/').pop()})`;
        case 'input':
            return `input (${element.type})`;
        case 'textarea':
            return `textarea (${element.id || element.name || 'text input'})`;
        case 'p':
            if (element.textContent && element.textContent.trim().length > 0) {
                const text = element.textContent.trim();
                return `text (${text.length > 30 ? text.substring(0, 30) + '...' : text})`;
            }
            break;
    }
    
    // Try to provide some context for other elements
    if (element.textContent && element.textContent.trim().length > 0) {
        const text = element.textContent.trim();
        description = `${elementType} (${text.length > 30 ? text.substring(0, 30) + '...' : text})`;
    } else {
        description = `${elementType} (${element.className || 'unnamed'})`;
    }
    
    return description;
}
