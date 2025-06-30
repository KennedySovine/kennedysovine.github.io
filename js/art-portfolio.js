// Art portfolio display logic
import { artworks } from '../user-data/art-data.js';

// Load and display artworks
function loadArtPortfolio() {
    const gallery = document.getElementById('gallery-grid');
    
    if (!gallery) {
        console.error('Gallery grid element not found');
        return;
    }
    
    if (artworks.length === 0) {
        gallery.innerHTML = '<p>No artworks yet. Check back soon!</p>';
        return;
    }
    
    // Clear loading message
    gallery.innerHTML = '';
    
    // Create artwork cards
    artworks.forEach(artwork => {
        const artCard = createArtCard(artwork);
        gallery.appendChild(artCard);
    });
}

// Create individual artwork card
function createArtCard(artwork) {
    const card = document.createElement('div');
    card.className = 'art-card';
    
    card.innerHTML = `
        <img src="${artwork.imageUrl}" alt="${artwork.title}" loading="lazy">
        <div class="art-info">
            <h3>${artwork.title}</h3>
            <p class="art-description">${artwork.description}</p>
            <div class="art-meta">
                <span class="medium">${artwork.category}</span>
                <span class="year">${artwork.formattedDate || 'Unknown'}</span>
            </div>
        </div>
    `;
    
    // Add click event to expand/shrink the card
    card.addEventListener('click', function(e) {
        e.stopPropagation();
        card.classList.toggle('expanded');
        
        // Add/remove body scroll lock
        if (card.classList.contains('expanded')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    return card;
}

// Close expanded cards when clicking outside or pressing Escape
document.addEventListener('click', function() {
    const expandedCards = document.querySelectorAll('.art-card.expanded');
    expandedCards.forEach(card => {
        card.classList.remove('expanded');
        document.body.style.overflow = '';
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const expandedCards = document.querySelectorAll('.art-card.expanded');
        expandedCards.forEach(card => {
            card.classList.remove('expanded');
            document.body.style.overflow = '';
        });
    }
});

// Initialize portfolio when page loads
document.addEventListener('DOMContentLoaded', loadArtPortfolio);
