
// Art portfolio data - structure for your artwork
export const artworks = [
    {
        id: "placeholder-001",
        title: "Untitled Artwork 1",
        description: "A placeholder artwork entry. Upload your first piece through the admin panel to replace this.",
        category: "Digital Art",
        medium: "Digital",
        imageUrl: "https://via.placeholder.com/400x300/667eea/ffffff?text=Artwork+1",
        thumbnailUrl: "https://via.placeholder.com/400x300/667eea/ffffff?text=Artwork+1",
        tags: ["placeholder", "demo"],
        createdDate: "2024-01-01",
        uploadDate: "2024-01-01T00:00:00Z",
        dimensions: "400x300",
        fileSize: "placeholder",
        projectUrl: null,
        repository: null,
        metadata: {
            camera: null,
            software: "Placeholder",
            timeSpent: null,
            inspiration: "This is a placeholder artwork to demonstrate the gallery layout."
        }
    },
    {
        id: "placeholder-002", 
        title: "Untitled Artwork 2",
        description: "Another placeholder artwork entry. Use the admin panel to upload your actual artwork.",
        category: "Traditional Art",
        medium: "Pencil",
        imageUrl: "https://via.placeholder.com/400x300/764ba2/ffffff?text=Artwork+2", 
        thumbnailUrl: "https://via.placeholder.com/400x300/764ba2/ffffff?text=Artwork+2",
        tags: ["placeholder", "demo", "traditional"],
        createdDate: "2024-01-02",
        uploadDate: "2024-01-02T00:00:00Z",
        dimensions: "400x300",
        fileSize: "placeholder",
        projectUrl: null,
        repository: null,
        metadata: {
            camera: null,
            software: null,
            timeSpent: "2 hours",
            inspiration: "A traditional art placeholder to show variety in your gallery."
        }
    },
    {
        id: "placeholder-003",
        title: "Untitled Artwork 3", 
        description: "The third placeholder artwork. Replace with your own creations using the admin panel.",
        category: "Concept Art",
        medium: "Mixed Media",
        imageUrl: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Artwork+3",
        thumbnailUrl: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Artwork+3", 
        tags: ["placeholder", "demo", "concept"],
        createdDate: "2024-01-03",
        uploadDate: "2024-01-03T00:00:00Z",
        dimensions: "400x300",
        fileSize: "placeholder",
        projectUrl: null,
        repository: null,
        metadata: {
            camera: null,
            software: "Mixed Traditional & Digital",
            timeSpent: "4 hours",
            inspiration: "A concept art placeholder showing the potential of your gallery."
        }
    }
];

// You can add more art-related data exports here
export const artCategories = [
    "Digital Art",
    "Traditional Art", 
    "Sketches",
    "Paintings",
    "Character Design",
    "Concept Art"
];

export const artMediums = [
    "Digital",
    "Pencil",
    "Ink",
    "Watercolor",
    "Oil Paint",
    "Acrylic",
    "Mixed Media"
];
