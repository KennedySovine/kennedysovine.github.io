// Art portfolio display logic
import { artworks } from '../user-data/art-data.js';

// Load and display artworks
function loadArtPortfolio() {
    const gallery = document.getElementById('art-gallery');
    
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
                <span class="medium">${artwork.medium}</span>
                <span class="year">${artwork.year}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Initialize portfolio when page loads
document.addEventListener('DOMContentLoaded', loadArtPortfolio);
