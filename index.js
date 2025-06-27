import {
  bio,
  skills,
  education,
  experience,
  footer,
  certifications,
  projects,
} from "./user-data/data.js";

import { URLs } from "./user-data/urls.js";
import { config } from "./user-data/config.js";
import LinkedInIntegration, {
  initializeLinkedInIntegration,
  updateBioFromLinkedIn,
  updateBioManually,
} from "./js/linkedin-integration.js";

const { medium, gitConnected, gitRepo } = URLs;

// Projects carousel functionality - Global variables
let currentProjectIndex = 0;
let projectsPerPage = 3;

async function fetchGitConnectedData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitConnected API error: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.basics) {
      mapBasicResponse(data.basics);
    } else {
      console.warn("GitConnected API response missing basics data");
    }
  } catch (error) {
    console.error("Error in fetching data from git connected:", error);
  }
}

function mapBasicResponse(basics) {
  if (!basics) {
    console.warn("Basics data is undefined");
    return;
  }

  const {
    name,
    label,
    image,
    email,
    phone,
    url,
    summary,
    profiles,
    headline,
    yearsOfExperience,
    username,
    locationAsString,
    region,
    karma,
    id,
    followers,
    following,
    picture,
    website,
  } = basics;

  if (name) {
    window.parent.document.title = name;
  }
}

function populateBio(items, id) {
  const bioTag = document.getElementById(id);
  items.forEach((bioItem) => {
    const p = getElement("p", null);
    p.innerHTML = bioItem;
    bioTag.append(p);
  });
}

function populateSkills(items, id) {
  const skillsTag = document.getElementById(id);
  items.forEach((item) => {
    const h3 = getElement("li", null);
    h3.innerHTML = item;

    const divProgressWrap = getElement("div", "progress-wrap");
    divProgressWrap.append(h3);

    const divAnimateBox = getElement("div", "col-md-12 animate-box");
    divAnimateBox.append(divProgressWrap);

    skillsTag.append(divAnimateBox);
  });
}



// OLD CAROUSEL CODE REMOVED - USING NEW SIMPLE IMPLEMENTATION BELOW

// Helper to create a card
function createCard(repo, pos) {
  const div = document.createElement("div");
  div.className = `repo-card repo-card-${pos}`;
  div.dataset.repoUrl = `https://github.com/${repo.author}/${repo.name}`;

  // Base styles for all cards
  div.style.cssText = `
    position: absolute;
    width: 280px;
    height: 180px;
    padding: 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #b19cd9, #6a5acd);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    top: 50%;
    will-change: transform, opacity, left, right;
  `;

  // Position-specific styles
  if (pos === "left") {
    div.style.cssText += `
      left: 50px;
      transform: translateY(-50%) scale(0.85);
      opacity: 0.7;
      z-index: 1;
    `;
  } else if (pos === "center") {
    div.style.cssText += `
      left: 50%;
      transform: translateX(-50%) translateY(-50%) scale(1);
      opacity: 1;
      z-index: 3;
      cursor: pointer;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
    `;
  } else if (pos === "right") {
    div.style.cssText += `
      right: 50px;
      left: auto;
      transform: translateY(-50%) scale(0.85);
      opacity: 0.7;
      z-index: 1;
    `;
  }

  div.innerHTML = `
    <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${repo.name}</div>
    <div style="font-size: 13px; color: #666; margin-bottom: 16px; height: 40px; overflow: hidden; line-height: 1.4;">${repo.description || "No description available"}</div>
    <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; color: #555;">
      <span style="display: flex; align-items: center; gap: 4px;">
        <span style="width: 8px; height: 8px; background: #4169e1; border-radius: 50%;"></span>
        ${repo.language || "N/A"}
      </span>
      <span style="display: flex; align-items: center; gap: 4px;">
        ⭐ ${repo.stars || 0}
      </span>
      <span style="display: flex; align-items: center; gap: 4px;">
        🍴 ${repo.forks || 0}
      </span>
    </div>
  `;

  return div;
}

// Update click handlers for center card
function updateClickHandlers() {
  const cards = document.querySelectorAll('.repo-card');
  cards.forEach(card => {
    card.onclick = null; // Remove existing handlers
    if (card.style.zIndex === '3') { // Center card
      card.style.cursor = 'pointer';
      card.onclick = () => window.open(card.dataset.repoUrl, "_blank");
    } else {
      card.style.cursor = 'default';
    }
  });
}

// Cache for GitHub repos to reduce API calls
const CACHE_KEY = 'github_repos_cache';

function getCachedRepos() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < config.CACHE_DURATION) {
        if (config.DEBUG) console.log("Using cached repository data");
        return data;
      }
    }
  } catch (error) {
    console.warn("Error reading cache:", error);
  }
  return null;
}

function setCachedRepos(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn("Error setting cache:", error);
  }
}

function clearRepoCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log("Repository cache cleared");
  } catch (error) {
    console.warn("Error clearing cache:", error);
  }
}

function populateRepo(items, id) {
  // Updated to handle up to 6 repositories instead of 10
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.warn("No repo items to populate");
    return;
  }

  const projectdesign = document.getElementById(id);
  if (!projectdesign) {
    console.warn(`Element with id '${id}' not found`);
    return;
  }

  const count = Math.min(6, items.length);

  const rowWrapper = document.createElement("div");
  rowWrapper.style = "display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between;";
  projectdesign.appendChild(rowWrapper);

  for (let i = 0; i < count; i++) {
    const item = items[i];
    if (!item) continue;    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";
    repoCard.style = `
          flex: 1 0 48%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 12px;
          padding: 14px;
          font-size: 13px;
          background: linear-gradient(135deg, #b19cd9, #6a5acd);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease-in-out;
          cursor: pointer;
      `;

    const repoLink = document.createElement("a");
    repoLink.href = `https://github.com/${item.author || 'unknown'}/${item.name || 'unknown'}`;
    repoLink.target = "_blank";
    repoLink.style = "text-decoration: none; color: black; display: block; height: 100%;";

    repoCard.appendChild(repoLink);    const repoName = document.createElement("h4");
    repoName.className = "repo-heading";
    repoName.innerHTML = item.name || 'Unknown Repository';
    repoName.style = "margin: 0; font-size: 16px; font-weight: bold;";
    repoLink.appendChild(repoName);    const repoDescription = document.createElement("p");
    repoDescription.className = "repo-description";
    repoDescription.innerHTML = item.description || 'No description available';
    repoDescription.style = "margin-top: 6px; font-size: 11px; color: #555;";
    repoLink.appendChild(repoDescription);

    const statsRow = document.createElement("div");
    statsRow.style = `
          display: flex; 
          align-items: center; 
          gap: 16px; 
          margin-top: 12px; 
          font-size: 12px; 
          color: #666;
      `;

    const languageDiv = document.createElement("div");
    languageDiv.style = "display: flex; align-items: center; gap: 4px;";
    languageDiv.innerHTML = `
          <span style="width: 8px; height: 8px; background-color: #666; border-radius: 50%; display: inline-block;"></span>
          ${item.language || 'Unknown'}
      `;
    statsRow.appendChild(languageDiv);

    const starsDiv = document.createElement("div");
    starsDiv.style = "display: flex; align-items: center; gap: 4px;";
    starsDiv.innerHTML = `
          <img src="https://img.icons8.com/ios-filled/16/666666/star--v1.png" alt="Stars">
          ${item.stars || 0}
      `;
    statsRow.appendChild(starsDiv);

    const forksDiv = document.createElement("div");
    forksDiv.style = "display: flex; align-items: center; gap: 4px;";
    forksDiv.innerHTML = `
          <img src="https://img.icons8.com/ios-filled/16/666666/code-fork.png" alt="Forks">
          ${item.forks || 0}
      `;
    statsRow.appendChild(forksDiv);

    repoLink.appendChild(statsRow);
    rowWrapper.appendChild(repoCard);
  }
}

function populateExp_Edu(items, id) {
  let mainContainer = document.getElementById(id);

  for (let i = 0; i < items.length; i++) {
    let spanTimelineSublabel = document.createElement("span");
    spanTimelineSublabel.className = "timeline-sublabel";
    spanTimelineSublabel.innerHTML = items[i].subtitle;

    // Add location if it exists
    if (items[i].location) {
      let spanTimelineLocation = document.createElement("span");
      spanTimelineLocation.className = "timeline-location";
      spanTimelineLocation.innerHTML = " • " + items[i].location;
      spanTimelineLocation.style.fontStyle = "italic";
      spanTimelineLocation.style.color = "#C8A2C8";
      // ADD OUTLINE FOR TEXT #C8A2C8
      spanTimelineLocation.style.textShadow = `
        -1px -1px 0 white,
        1px -1px 0 white,
        -1px 1px 0 white,
        1px 1px 0 white
      `;
      spanTimelineSublabel.append(spanTimelineLocation);
    }

    let spanh2 = document.createElement("span");
    spanh2.innerHTML = items[i].duration;

    let h2TimelineLabel = document.createElement("h2");
    h2TimelineLabel.innerHTML = items[i].title;
    h2TimelineLabel.append(spanh2);

    let divTimelineLabel = document.createElement("div");
    divTimelineLabel.className = "timeline-label";
    divTimelineLabel.append(h2TimelineLabel);
    divTimelineLabel.append(spanTimelineSublabel);

    for (let j = 0; j < items[i].details.length; j++) {
      let pTimelineText = document.createElement("p");
      pTimelineText.className = "timeline-text";
      pTimelineText.innerHTML = "&blacksquare; " + items[i].details[j];
      divTimelineLabel.append(pTimelineText);
    }

    let divTags = document.createElement("div");
    for (let j = 0; j < items[i].tags.length; j++) {
      let spanTags = document.createElement("span");
      spanTags.className = "badge";
      spanTags.innerHTML = items[i].tags[j];
      divTags.append(spanTags);
    }
    divTimelineLabel.append(divTags);

    let iFa = document.createElement("i");
    iFa.className = "fa fa-" + items[i].icon;

    let divTimelineIcon = document.createElement("div");
    divTimelineIcon.className = "timeline-icon color-2";
    divTimelineIcon.append(iFa);    let divTimelineEntryInner = document.createElement("div");
    divTimelineEntryInner.className = "timeline-entry-inner";
    divTimelineEntryInner.append(divTimelineIcon);
    divTimelineEntryInner.append(divTimelineLabel);
    
    let article = document.createElement("article");
    article.className = "timeline-entry animate-box";
    article.append(divTimelineEntryInner);    // Make University of Brighton card clickable to open UOB.html
    if (items[i].title === "University of Brighton") {
      console.log("Setting up click handler for University of Brighton");
      article.style.cursor = "pointer";
      
      // Add visual indicator for clickability
      let clickIndicator = document.createElement("div");
      clickIndicator.className = "click-indicator";
      clickIndicator.innerHTML = `
        <i class="fas fa-arrow-right"></i>
        <span>Click to view modules & coursework</span>
      `;
      divTimelineLabel.appendChild(clickIndicator);
      
      // Add styling for the click indicator
      let style = document.createElement("style");
      style.textContent = `
        .click-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          padding: 8px 12px;
          background: linear-gradient(45deg, #2c98f0, #2c98f0);
          color: white;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(44, 152, 240, 0.3);
          transition: all 0.3s ease;
        }
        .timeline-entry:hover .click-indicator {
          background: linear-gradient(45deg, #1e7db8, #2c98f0);
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(44, 152, 240, 0.4);
        }
        .click-indicator i {
          font-size: 0.8rem;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
      
      article.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("University of Brighton clicked!");
        window.location.href = "UOB.html";
      });
      
      // Add hover effect to indicate it's clickable
      article.addEventListener("mouseenter", function() {
        article.style.transform = "scale(1.02)";
        article.style.transition = "transform 0.2s ease";
      });
      
      article.addEventListener("mouseleave", function() {
        article.style.transform = "scale(1)";
      });
    }

    mainContainer.append(article);
  }

  let divTimelineIcon = document.createElement("div");
  divTimelineIcon.className = "timeline-icon color-2";

  let divTimelineEntryInner = document.createElement("div");
  divTimelineEntryInner.className = "timeline-entry-inner";
  divTimelineEntryInner.append(divTimelineIcon);

  let article = document.createElement("article");
  article.className = "timeline-entry begin animate-box";
  article.append(divTimelineEntryInner);

  mainContainer.append(article);
}

function populateLinks(items, id) {
  let footer = document.getElementById(id);

  items.forEach(function (item) {
    if (item.label !== "copyright-text") {
      let span = document.createElement("span");
      span.className = "col";

      let p = document.createElement("p");
      p.className = "col-title";
      p.innerHTML = item.label;
      span.append(p);

      let nav = document.createElement("nav");
      nav.className = "col-list";

      let ul = document.createElement("ul");
      item.data.forEach(function (data) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        if (data.link) {
          a.href = data.link;
          a.target = "_blank";
        }
        if (data.func) {
          a.setAttribute("onclick", data.func);
        }
        a.innerHTML = data.text;

        li.append(a);
        ul.append(li);
      });
      nav.append(ul);
      span.append(nav);
      footer.append(span);
    }

    if (item.label === "copyright-text") {
      let div = document.createElement("div");
      div.className = "copyright-text no-print";
      item.data.forEach(function (copyright) {
        let p = document.createElement("p");
        p.innerHTML = copyright;
        div.append(p);
      });
      footer.append(div);
    }
  });
}

function getElement(tagName, className) {
  let item = document.createElement(tagName);
  item.className = className;
  return item;
}

populateBio(bio, "bio");
populateSkills(skills, "skills");
fetchRepositories();
populateExp_Edu(experience, "experience");
populateExp_Edu(education, "education");
populateCertifications(certifications, "certifications");
populateLinks(footer, "footer");
loadGitHubContributions();
initializeProjects();

// Initialize LinkedIn integration if enabled
if (config.LINKEDIN?.AUTO_FETCH) {
  initializeLinkedInIntegration().then((linkedInData) => {
    if (linkedInData && linkedInData.source !== "manual_config") {
      console.log("🔗 LinkedIn data fetched successfully, updating profile...");
      updateProfileWithLinkedInData(linkedInData);
    }
  });
} else if (config.LINKEDIN?.PROFILE_URL) {
  console.log("🔗 LinkedIn profile URL configured:", config.LINKEDIN.PROFILE_URL);
  console.log("💡 To enable automatic fetching, set AUTO_FETCH: true in config.js");
}

// NEW SIMPLIFIED GITHUB REPOSITORY FETCHING
async function fetchRepositories() {
  console.log("🚀 Starting repository fetch...");

  try {
    const headers = {
      Accept: "application/vnd.github.v3+json",
    };

    // Add GitHub token for authentication
    if (config.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${config.GITHUB_TOKEN}`;
      console.log("🔑 Using GitHub authentication token");
    }

    let allRepos = [];

    // Step 1: Try to get pinned repositories using GraphQL
    console.log("📌 Fetching pinned repositories...");
    try {
      const graphqlQuery = {
        query: `
          query {
            user(login: "KennedySovine") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    name
                    description
                    url
                    primaryLanguage {
                      name
                    }
                    stargazerCount
                    forkCount
                    owner {
                      login
                    }
                  }
                }
              }
            }
          }
        `,
      };

      const graphqlResponse = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });

      if (graphqlResponse.ok) {
        const graphqlData = await graphqlResponse.json();
        if (graphqlData.data?.user?.pinnedItems?.nodes) {
          const pinnedRepos = graphqlData.data.user.pinnedItems.nodes.map((repo) => ({
            name: repo.name,
            description: repo.description || "No description available",
            author: repo.owner.login,
            language: repo.primaryLanguage?.name || "Unknown",
            stars: repo.stargazerCount || 0,
            forks: repo.forkCount || 0,
            url: repo.url,
            isPinned: true,
          }));

          allRepos = pinnedRepos;
          console.log(`📌 Found ${pinnedRepos.length} pinned repositories:`, pinnedRepos.map((r) => r.name));
        }
      }
    } catch (graphqlError) {
      console.warn("⚠️ GraphQL pinned repos failed:", graphqlError.message);
    }

    // Step 2: Get additional repositories to reach 10 total
    if (allRepos.length < 10) {
      console.log(`🔍 Fetching additional repositories (need ${10 - allRepos.length} more)...`);

      const reposResponse = await fetch(
        `https://api.github.com/users/KennedySovine/repos?per_page=30&sort=updated&type=owner`,
        {
          headers: headers,
        }
      );

      if (reposResponse.ok) {
        const repos = await reposResponse.json();

        // Log rate limit info
        const rateLimit = reposResponse.headers.get("X-RateLimit-Limit");
        const rateRemaining = reposResponse.headers.get("X-RateLimit-Remaining");
        if (rateLimit && rateRemaining) {
          console.log(`⏱️ GitHub API Rate Limit: ${rateRemaining}/${rateLimit} remaining`);
        }

        // Filter out forks, archived repos, and already pinned repos
        const pinnedNames = allRepos.map((r) => r.name.toLowerCase());
        const additionalRepos = repos
          .filter(
            (repo) =>
              !repo.fork &&
              !repo.archived &&
              !pinnedNames.includes(repo.name.toLowerCase())
          )
          .slice(0, 10 - allRepos.length)
          .map((repo) => ({
            name: repo.name,
            description: repo.description || "No description available",
            author: repo.owner.login,
            language: repo.language || "Unknown",
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            url: repo.html_url,
            isPinned: false,
          }));

        allRepos = [...allRepos, ...additionalRepos];
        console.log(`✅ Added ${additionalRepos.length} additional repositories:`, additionalRepos.map((r) => r.name));
      } else if (reposResponse.status === 403) {
        console.error("❌ GitHub API rate limit exceeded");
      }
    }

    console.log(`🎯 Total repositories fetched: ${allRepos.length}`);
    console.log("📋 Final repository list:", allRepos.map((r) => `${r.name} (${r.isPinned ? 'pinned' : 'regular'})`));

    if (allRepos.length === 0) {
      throw new Error("No repositories found");
    }

    // Create 3-card layered carousel display
    displayRepositoryCarousel3Cards(allRepos);
  } catch (error) {
    console.error("❌ Error fetching repositories:", error);

    // Show fallback message
    document.getElementById("repos").innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <h3>Repositories Currently Unavailable</h3>
        <p>Unable to fetch repository data at this time.</p>
        <p>Please visit my <a href="https://github.com/KennedySovine" target="_blank" style="color: #6a5acd;">GitHub profile</a> directly.</p>
      </div>
    `;
  }
}

// NEW 3-CARD LAYERED CAROUSEL IMPLEMENTATION
function displayRepositoryCarousel3Cards(repos) {
  const repoContainer = document.getElementById("repos");
  let currentCenterIndex = 0;  // Create 3-card layered carousel container
  repoContainer.innerHTML = `
    <div style="position: relative; width: 100%; margin: 0 auto; max-width: 1200px;">
      <div id="repo-carousel" style="
        width: 100%;
        min-height: ${window.innerWidth <= 768 ? '220px' : '280px'};
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        gap: 20px;
        perspective: 1000px;
        padding: 0 20px;
        box-sizing: border-box;
      "></div><div style="text-align: center; margin-top: 20px;">
        <button id="prev-repo" style="
          background: #6a5acd;
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          margin: 0 12px;
          cursor: pointer;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
        " onmouseover="this.style.transform='scale(1.1) rotate(-5deg)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.25)'" 
           onmouseout="this.style.transform='scale(1) rotate(0deg)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">←</button>
        <span id="repo-counter" style="margin: 0 16px; font-weight: bold; font-size: 15px; color: #333;"></span>
        <button id="next-repo" style="
          background: #6a5acd;
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          margin: 0 12px;
          cursor: pointer;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
        " onmouseover="this.style.transform='scale(1.1) rotate(5deg)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.25)'" 
           onmouseout="this.style.transform='scale(1) rotate(0deg)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">→</button>
      </div>      <div style="text-align: center; margin-top: 12px;">
        <div id="slide-indicators" style="display: flex; justify-content: center; gap: 6px;"></div>
      </div>
    </div>
  `;

  // Create individual repo card
  function createRepoCard(repo, position) {
    const card = document.createElement("div");
    card.className = `repo-card repo-card-${position}`;
    card.dataset.repoUrl = repo.url;    // Responsive sizing - optimized for both desktop and mobile
    let cardWidth = 320;
    let cardHeight = 200;
    let cardPadding = 20;
    let fontSize = {
      title: 20,
      description: 14,
      stats: 12
    };
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile single-card layout: larger card for better visibility
      cardWidth = Math.min(320, window.innerWidth * 0.9);
      cardHeight = 200;
      cardPadding = 20;
      fontSize = {
        title: 18,
        description: 14,
        stats: 12
      };
    } else if (window.innerWidth < 900) {
      // Tablet size: smaller layered cards
      cardWidth = Math.min(280, window.innerWidth * 0.75);
      cardHeight = 180;
      cardPadding = 16;
      fontSize = {
        title: 18,
        description: 13,
        stats: 11
      };
    }// Base styles for all cards
    card.style.cssText = `
      position: absolute;
      width: ${cardWidth}px;
      height: ${cardHeight}px;
      padding: ${cardPadding}px;
      border-radius: 12px;
      background: linear-gradient(135deg, #b19cd9, #6a5acd);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      top: 50%;
      transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: transform, opacity, left, right;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    `;    // Position-specific styles and transitions
    if (isMobile && position === "center") {
      // Mobile center card: no layered effect, just centered
      card.style.cssText += `
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        opacity: 1;
        z-index: 3;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        pointer-events: auto;
      `;
    } else if (!isMobile) {
      // Desktop layered layout
      if (position === "left") {
        card.style.cssText += `
          left: 20px;
          transform: translateY(-50%) scale(0.85);
          opacity: 0.7;
          z-index: 1;
          cursor: default;
          filter: blur(0.5px) brightness(0.95);
        `;
      } else if (position === "center") {
        card.style.cssText += `
          left: 50%;
          transform: translateX(-50%) translateY(-50%) scale(1.05);
          opacity: 1;
          z-index: 3;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
          pointer-events: auto;
        `;
      } else if (position === "right") {
        card.style.cssText += `
          right: 20px;
          left: auto;
          transform: translateY(-50%) scale(0.85);
          opacity: 0.7;
          z-index: 1;
          cursor: default;
          filter: blur(0.5px) brightness(0.95);
        `;
      }
    }card.innerHTML = `
      <div style="font-size: ${fontSize.title}px; font-weight: bold; margin-bottom: 8px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${repo.name}
        ${repo.isPinned ? '<span style="background: #4169e1; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 6px;">📌</span>' : ''}
      </div>
      <div style="font-size: ${fontSize.description}px; color: #666; margin-bottom: 12px; flex-grow: 1; overflow: hidden; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${repo.description || "No description available"}</div>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: ${fontSize.stats}px; color: #555; margin-top: auto;">
        <span style="display: flex; align-items: center; gap: 4px;">
          <span style="width: 8px; height: 8px; background: #4169e1; border-radius: 50%;"></span>
          ${repo.language || "N/A"}
        </span>
        <span style="display: flex; align-items: center; gap: 4px;">
          ⭐ ${repo.stars || 0}
        </span>
        <span style="display: flex; align-items: center; gap: 4px;">
          🍴 ${repo.forks || 0}
        </span>
      </div>
    `;

    return card;
  }
  // Update display with responsive layout - 3-card on desktop, 1-card on mobile
  function updateDisplay(direction = "none") {
    const carousel = document.getElementById("repo-carousel");
    carousel.innerHTML = "";

    // Calculate indices for left, center, right
    const total = repos.length;
    const leftIndex = (currentCenterIndex - 1 + total) % total;
    const centerIndex = currentCenterIndex;
    const rightIndex = (currentCenterIndex + 1) % total;

    // Check if sidebar is collapsed (mobile view)
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile: Show only center card (single card view)
      const centerCard = createRepoCard(repos[centerIndex], "center");
      carousel.appendChild(centerCard);
    } else {
      // Desktop: Show 3-card layered layout
      if (total === 1) {
        const centerCard = createRepoCard(repos[centerIndex], "center");
        carousel.appendChild(centerCard);
      } else if (total === 2) {
        const leftCard = createRepoCard(repos[leftIndex], "left");
        const centerCard = createRepoCard(repos[centerIndex], "center");
        carousel.appendChild(leftCard);
        carousel.appendChild(centerCard);
      } else {
        const leftCard = createRepoCard(repos[leftIndex], "left");
        const centerCard = createRepoCard(repos[centerIndex], "center");
        const rightCard = createRepoCard(repos[rightIndex], "right");
        carousel.appendChild(leftCard);
        carousel.appendChild(centerCard);
        carousel.appendChild(rightCard);
      }
    }

    // Update counter
    document.getElementById("repo-counter").textContent = `${centerIndex + 1} of ${total} repositories`;

    // Update slide indicators
    const indicators = document.getElementById("slide-indicators");
    indicators.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("div");
      dot.style = `width: 14px; height: 6px; border-radius: 4px; background: ${i === centerIndex ? '#4169e1' : '#e0e0e0'}; transition: background 0.3s; margin: 0 2px;`;
      indicators.appendChild(dot);
    }

    // Add click handlers for center card
    const cards = document.querySelectorAll('.repo-card');
    cards.forEach(card => {
      card.onclick = null;
      if (card.classList.contains('repo-card-center')) {
        card.style.cursor = 'pointer';
        card.onclick = () => {
          window.open(card.dataset.repoUrl, '_blank');
        };
      } else {
        card.style.cursor = 'default';
      }
    });
  }

  // Initial display
  updateDisplay();

  // Navigation handlers
  document.getElementById("prev-repo").onclick = function () {
    currentCenterIndex = (currentCenterIndex - 1 + repos.length) % repos.length;
    updateDisplay("left");
  };
  document.getElementById("next-repo").onclick = function () {
    currentCenterIndex = (currentCenterIndex + 1) % repos.length;
    updateDisplay("right");
  };
  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      currentCenterIndex = (currentCenterIndex - 1 + repos.length) % repos.length;
      updateDisplay("left");
    } else if (e.key === "ArrowRight") {
      currentCenterIndex = (currentCenterIndex + 1) % repos.length;
      updateDisplay("right");
    }
  });
  // Window resize listener to update card sizes and layout
  window.addEventListener("resize", function() {
    // Update carousel container height based on screen size
    const carousel = document.getElementById("repo-carousel");
    if (carousel) {
      carousel.style.minHeight = window.innerWidth <= 768 ? '220px' : '280px';
    }
    updateDisplay();
  });
}

function createProjectCard(project, index) {
  console.log(`🔨 Creating project card for: ${project.title}`);
  
  const card = document.createElement('div');
  card.className = 'project-card animate-box';
  card.setAttribute('data-animate-effect', 'fadeInUp');
  
  // Professional card styling
  card.style.cssText = `
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
  `;
  
  // Add hover effect
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
  });
  
  card.innerHTML = `
    <div class="project-card-inner" style="height: 100%; display: flex; flex-direction: column;">
      <div class="project-image" style="position: relative; overflow: hidden;">
        <img src="${project.image}" alt="${project.title}" loading="lazy" style="width: 100%; height: 200px; object-fit: cover;">
        <div class="project-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(106, 90, 205, 0.85); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
          <button class="project-expand-btn" data-project-index="${index}" style="background: white; color: #6a5acd; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: transform 0.2s ease;">
            <i class="fa fa-expand"></i>
          </button>
        </div>
      </div>
      <div class="project-content" style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column;">
        <h3 class="project-title" style="color: #333; margin: 0 0 12px 0; font-size: 1.4rem; font-weight: 600;">${project.title}</h3>
        <p class="project-description" style="color: #666; margin: 0 0 16px 0; line-height: 1.6; flex-grow: 1;">${project.description}</p>
        <div class="project-tags" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto;">
          ${project.tags.map(tag => `<span class="project-tag" style="background: linear-gradient(135deg, #6a5acd, #8a7fd8); color: white; padding: 4px 10px; border-radius: 15px; font-size: 11px; font-weight: 500;">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Add click handler for the entire card to expand
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.project-expand-btn')) {
      showProjectModal(index);
    }
  });
  
  // Show overlay on hover
  const overlay = card.querySelector('.project-overlay');
  card.addEventListener('mouseenter', () => {
    overlay.style.opacity = '1';
  });
  
  card.addEventListener('mouseleave', () => {
    overlay.style.opacity = '0';
  });
  
  console.log('✅ Project card created successfully');
  return card;
}

function createProjectModal(project) {
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.id = 'project-modal';
  
  modal.innerHTML = `
    <div class="project-modal-content">
      <div class="project-modal-header">
        <h2>${project.title}</h2>
        <button class="project-modal-close" id="project-modal-close">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div class="project-modal-body">
        <div class="project-modal-image">
          <img src="${project.image}" alt="${project.title}">
        </div>
        <div class="project-modal-info">
          ${project.fullDescription}
          <div class="project-modal-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
          <div class="project-modal-actions">
            <a href="${project.sourceCodeUrl}" target="_blank" class="project-source-btn">
              <i class="fa fa-external-link"></i>
              Go to source code
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="project-modal-backdrop" id="project-modal-backdrop"></div>
  `;
  
  return modal;
}

function showProjectModal(projectIndex) {
  const project = projects[projectIndex];
  const existingModal = document.getElementById('project-modal');
  
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = createProjectModal(project);
  document.body.appendChild(modal);
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Add event listeners
  const closeBtn = modal.querySelector('#project-modal-close');
  const backdrop = modal.querySelector('#project-modal-backdrop');
  
  closeBtn.addEventListener('click', closeProjectModal);
  backdrop.addEventListener('click', closeProjectModal);
  
  // Close on Escape key
  document.addEventListener('keydown', handleModalKeydown);
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
  document.removeEventListener('keydown', handleModalKeydown);
}

function handleModalKeydown(event) {
  if (event.key === 'Escape') {
    closeProjectModal();
  }
}

function updateProjectsDisplay() {
  console.log('🖼️ Updating projects display...');
  const container = document.getElementById('projects');
  if (!container) {
    console.warn('❌ Projects container not found in updateProjectsDisplay');
    return;
  }
  
  console.log('✅ Container found, clearing content...');
  
  // Clear existing content and remove debug styling
  container.innerHTML = '';
  container.style.cssText = '';
  
  // Calculate which projects to show
  const startIndex = currentProjectIndex;
  const endIndex = Math.min(startIndex + projectsPerPage, projects.length);
  
  console.log(`📋 Displaying projects ${startIndex} to ${endIndex - 1} of ${projects.length}`);
  console.log(`📱 Projects per page: ${projectsPerPage}`);
  
  // Create project cards directly in the container
  for (let i = startIndex; i < endIndex; i++) {
    console.log(`🔨 Creating card for project ${i}:`, projects[i].title);
    const card = createProjectCard(projects[i], i);
    container.appendChild(card);
  }
  
  // Add project counter below the grid
  const projectCounter = document.createElement('div');
  projectCounter.style.cssText = `
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #666;
    font-weight: 500;
  `;
  projectCounter.innerHTML = `Showing ${startIndex + 1}-${endIndex} of ${projects.length} projects`;
  container.appendChild(projectCounter);
  
  console.log(`✅ Added ${endIndex - startIndex} project cards to container`);
  
  // Add event listeners to expand buttons
  container.querySelectorAll('.project-expand-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectIndex = parseInt(btn.getAttribute('data-project-index'));
      showProjectModal(projectIndex);
    });
  });
  
  // Update navigation button states
  updateProjectNavButtons();
  
  console.log('🎉 Projects display update complete!');
}

function updateProjectNavButtons() {
  const prevBtn = document.getElementById('project-prev-btn');
  const nextBtn = document.getElementById('project-next-btn');
  
  if (prevBtn && nextBtn) {
    const isFirstPage = currentProjectIndex === 0;
    const isLastPage = currentProjectIndex + projectsPerPage >= projects.length;
    
    prevBtn.disabled = isFirstPage;
    nextBtn.disabled = isLastPage;
    
    // Update button opacity and cursor based on state
    prevBtn.style.opacity = isFirstPage ? '0.3' : '1';
    nextBtn.style.opacity = isLastPage ? '0.3' : '1';
    prevBtn.style.cursor = isFirstPage ? 'not-allowed' : 'pointer';
    nextBtn.style.cursor = isLastPage ? 'not-allowed' : 'pointer';
    
    console.log(`🔄 Navigation buttons updated - Prev: ${!isFirstPage}, Next: ${!isLastPage}`);
  } else {
    console.warn('⚠️ Navigation buttons not found in DOM');
  }
}

function navigateProjects(direction) {
  const maxIndex = Math.max(0, projects.length - projectsPerPage);
  
  if (direction === 'next' && currentProjectIndex < maxIndex) {
    currentProjectIndex = Math.min(currentProjectIndex + projectsPerPage, maxIndex);
  } else if (direction === 'prev' && currentProjectIndex > 0) {
    currentProjectIndex = Math.max(currentProjectIndex - projectsPerPage, 0);
  }
  
  updateProjectsDisplay();
}

function updateProjectsPerPage() {
  const screenWidth = window.innerWidth;
  
  // More responsive breakpoints to match CSS
  // When sidebar collapses (768px), show only 1 project
  if (screenWidth <= 768) {
    projectsPerPage = 1;
  } else if (screenWidth >= 1200) {
    projectsPerPage = 3;
  } else if (screenWidth >= 600) {
    projectsPerPage = 2;
  } else {
    projectsPerPage = 1;
  }
  
  // Update grid columns based on projects per page
  const projectsGrid = document.getElementById('projects');
  if (projectsGrid) {
    if (projectsPerPage === 1) {
      projectsGrid.style.gridTemplateColumns = '1fr';
    } else if (projectsPerPage === 2) {
      projectsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
      projectsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
  }
  
  // Reset to first page and update display
  currentProjectIndex = 0;
  if (typeof updateProjectsDisplay === 'function') {
    updateProjectsDisplay();
  }
}

function initializeProjects() {
  console.log('🎨 Initializing projects...');
  console.log('📊 Projects data:', projects);
  console.log('📊 Projects length:', projects ? projects.length : 'undefined');
  
  // Check if projects data exists
  if (!projects || projects.length === 0) {
    console.error('❌ No projects data found');
    const container = document.getElementById('projects');
    if (container) {
      container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No projects available</p>';
    }
    return;
  }
  
  // Check if container exists
  const container = document.getElementById('projects');
  if (!container) {
    console.error('❌ Projects container element not found');
    return;
  }
  
  console.log('✅ Projects container found');
  
  // Reset variables to initial state
  currentProjectIndex = 0;
  
  // Set initial projects per page based on screen size
  const screenWidth = window.innerWidth;
  if (screenWidth <= 768) {
    projectsPerPage = 1; // Single project when sidebar collapses
  } else if (screenWidth >= 1200) {
    projectsPerPage = 3;
  } else if (screenWidth >= 600) {
    projectsPerPage = 2;
  } else {
    projectsPerPage = 1;
  }
  
  console.log(`📱 Set projects per page to: ${projectsPerPage} (screen width: ${screenWidth}px)`);
  
  // Add event listeners to navigation buttons
  const prevBtn = document.getElementById('project-prev-btn');
  const nextBtn = document.getElementById('project-next-btn');
  
  if (prevBtn && nextBtn) {
    console.log('✅ Found navigation buttons, adding event listeners');
    
    // Remove any existing listeners first
    prevBtn.onclick = null;
    nextBtn.onclick = null;
    
    prevBtn.addEventListener('click', () => {
      console.log('⬅️ Previous button clicked');
      navigateProjects('prev');
    });
    
    nextBtn.addEventListener('click', () => {
      console.log('➡️ Next button clicked');
      navigateProjects('next');
    });
  } else {
    console.warn('⚠️ Navigation buttons not found');
    console.log('prevBtn element:', prevBtn);
    console.log('nextBtn element:', nextBtn);
  }
  
  // Add resize listener to update projects per page
  window.addEventListener('resize', updateProjectsPerPage);
  
  // Initial display
  console.log('🚀 Starting initial projects display...');
  updateProjectsDisplay();
  
  console.log('🎉 Projects initialization complete!');
}

// =======================================================
// END PROJECTS FUNCTIONALITY
// =======================================================

/**
 * Update profile data with LinkedIn information
 * @param {Object} linkedInData - Data fetched from LinkedIn
 */
function updateProfileWithLinkedInData(linkedInData) {
  console.log('📝 Updating profile with LinkedIn data...');
  
  try {
    // Update bio if LinkedIn data is available
    if (linkedInData.bio && linkedInData.bio.length > 0) {
      const bioElement = document.getElementById('bio');
      if (bioElement) {
        bioElement.innerHTML = '';
        linkedInData.bio.forEach(bioText => {
          const p = document.createElement('p');
          p.innerHTML = bioText;
          bioElement.appendChild(p);
        });
        console.log('✅ Bio updated from LinkedIn');
      }
    }
    
    // Update skills if LinkedIn data is available
    if (linkedInData.skills && linkedInData.skills.length > 0) {
      const skillsElement = document.getElementById('skills');
      if (skillsElement) {
        skillsElement.innerHTML = '';
        linkedInData.skills.forEach(skill => {
          const p = document.createElement('p');
          p.innerHTML = skill;
          skillsElement.appendChild(p);
        });
        console.log('✅ Skills updated from LinkedIn');
      }
    }
    
    // Update experience if LinkedIn data is available
    if (linkedInData.experience && linkedInData.experience.length > 0) {
      console.log('✅ Experience data available from LinkedIn');
      // Experience would be updated in the populateExp_Edu function
    }
    
    // Add LinkedIn profile link
    if (linkedInData.profileUrl) {
      addLinkedInProfileLink(linkedInData.profileUrl);
    }
    
    // Show data source indicator
    showDataSourceIndicator(linkedInData.source, linkedInData.lastUpdated);
    
  } catch (error) {
    console.error('❌ Error updating profile with LinkedIn data:', error);
  }
}

/**
 * Add LinkedIn profile link to the page
 * @param {string} profileUrl - LinkedIn profile URL
 */
function addLinkedInProfileLink(profileUrl) {
  const footer = document.getElementById('footer');
  if (footer && profileUrl) {
    const linkedInLink = document.createElement('div');
    linkedInLink.style.cssText = `
      text-align: center;
      margin: 20px 0;
      padding: 10px;
      background: linear-gradient(135deg, #0077b5, #005885);
      border-radius: 8px;
    `;
    
    linkedInLink.innerHTML = `
      <a href="${profileUrl}" target="_blank" style="
        color: white;
        text-decoration: none;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        View LinkedIn Profile
      </a>
    `;
    
    footer.prepend(linkedInLink);
  }
}

/**
 * Show data source indicator
 * @param {string} source - Data source type
 * @param {string} lastUpdated - Last update timestamp
 */
function showDataSourceIndicator(source, lastUpdated) {
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 119, 181, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  const sourceText = {
    'linkedin_api': '🔗 LinkedIn API',
    'manual_config': '⚙️ Manual Config',
    'cached': '💾 Cached Data'
  };
  
  const updateTime = lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Unknown';
  indicator.innerHTML = `${sourceText[source] || '📝 Custom'} • ${updateTime}`;
  
  document.body.appendChild(indicator);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    indicator.style.opacity = '0';
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 300);
  }, 5000);
}

// GitHub Contributions Graph Loader
function loadGitHubContributions() {
  const username = "KennedySovine";
  const container = document.getElementById("github-contributions-graph");
  if (!container) return;

  // Use GitHub's contribution graph API through a proxy or direct fetch
  const proxyUrl = `https://github.com/${username}`;
  
  // Alternative approach: Use GitHub's calendar heatmap directly
  container.innerHTML = `
    <div style="
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      text-align: center;
    ">
      <iframe 
        src="https://github.com/${username}"
        style="
          width: 100%;
          height: 200px;
          border: none;
          border-radius: 8px;
        "
        onload="this.style.height = '200px'"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
      <p style="margin-top: 15px; font-size: 14px; color: #666;">
        <a href="https://github.com/${username}" target="_blank" style="color: #6a5acd; text-decoration: none;">
          📊 View full GitHub profile →
        </a>
      </p>
    </div>
  `;

  // Fallback: Try to fetch and parse the contributions
  fetch(`https://api.github.com/users/${username}/events?per_page=100`)
    .then(response => {
      if (!response.ok) throw new Error('API limit reached');
      return response.json();
    })
    .then(events => {
      // Create a simple activity indicator
      const activityCount = events.length;
      const recentActivity = events.slice(0, 10);
      
      container.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        ">
          <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 8px 0;">Recent GitHub Activity</h3>
            <p style="color: #666; margin: 0;">${activityCount} recent events</p>
          </div>
          
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
          ">
            ${recentActivity.slice(0, 6).map(event => `
              <div style="
                background: white;
                padding: 12px;
                border-radius: 8px;
                border-left: 4px solid #6a5acd;
                font-size: 12px;
              ">
                <div style="font-weight: bold; color: #333; margin-bottom: 4px;">
                  ${event.type.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div style="color: #666;">
                  ${event.repo.name.split('/')[1] || event.repo.name}
                </div>
                <div style="color: #999; font-size: 10px; margin-top: 4px;">
                  ${new Date(event.created_at).toLocaleDateString()}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="text-align: center;">
            <a href="https://github.com/${username}" target="_blank" style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: #6a5acd;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              transition: background 0.3s ease;
            " onmouseover="this.style.background='#5a4bbd'" onmouseout="this.style.background='#6a5acd'">
              📊 View Full GitHub Profile
              <span style="font-size: 12px;">→</span>
            </a>
          </div>
        </div>
      `;
    })
    .catch(() => {
      // Final fallback: Simple GitHub profile link
      container.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #6a5acd, #8a7fd8);
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          color: white;
          box-shadow: 0 4px 12px rgba(106, 90, 205, 0.3);
        ">
          <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
          <h3 style="margin: 0 0 12px 0; font-size: 24px;">GitHub Contributions</h3>
          <p style="margin: 0 0 24px 0; opacity: 0.9;">
            Check out my GitHub profile to see my contribution history and recent projects.
          </p>
          <a href="https://github.com/${username}" target="_blank" style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            Visit GitHub Profile
            <span style="font-size: 12px;">→</span>
          </a>
        </div>
      `;
    });
}

function populateCertifications(items, id) {
  const main = document.getElementById(id);
  if (!main) return;
  
  items.forEach(item => {
    // Create subtitle with issuer
    const spanSub = document.createElement("span");
    spanSub.className = "timeline-sublabel";
    spanSub.innerHTML = item.issuer;

    // Create main title with duration
    const h2 = document.createElement("h2");
    h2.innerHTML = item.title;
    const spanDur = document.createElement("span");
    spanDur.innerHTML = item.duration;
    h2.append(spanDur);

    // Create label container
    const divLabel = document.createElement("div");
    divLabel.className = "timeline-label";
    divLabel.append(h2, spanSub);

    // Add details
    item.details.forEach(detail => {
      const p = document.createElement("p");
      p.className = "timeline-text";
      p.innerHTML = "■ " + detail;
      divLabel.append(p);
    });

    // Add verification link if available
    if (item.verificationUrl) {
      const a = document.createElement("a");
      a.href = item.verificationUrl;
      a.target = "_blank";
      a.textContent = "View Certificate";
      a.className = "badge";
      a.style.marginRight = "8px";
      divLabel.append(a);
    }

    // Create icon
    const iconEl = document.createElement("i");
    iconEl.className = "fa fa-" + item.icon;
    const divIcon = document.createElement("div");
    divIcon.className = "timeline-icon color-2";
    divIcon.append(iconEl);

    // Create timeline entry
    const inner = document.createElement("div");
    inner.className = "timeline-entry-inner";
    inner.append(divIcon, divLabel);

    const article = document.createElement("article");
    article.className = "timeline-entry animate-box";
    article.append(inner);
    main.append(article);
  });

  // Add terminal marker
  const endIcon = document.createElement("div");
  endIcon.className = "timeline-icon color-2";
  const endInner = document.createElement("div");
  endInner.className = "timeline-entry-inner";
  endInner.append(endIcon);
  const endArticle = document.createElement("article");
  endArticle.className = "timeline-entry begin animate-box";
  endArticle.append(endInner);
  main.append(endArticle);
}
