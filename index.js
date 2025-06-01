import {
  bio,
  skills,
  education,
  experience,
  trekking,
  passes,
  footer,
} from "./user-data/data.js";

import { URLs } from "./user-data/urls.js";
import { config } from "./user-data/config.js";
import LinkedInIntegration, {
  initializeLinkedInIntegration,
  updateBioFromLinkedIn,
  updateBioManually,
} from "./js/linkedin-integration.js";

const { medium, gitConnected, gitRepo } = URLs;

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

function populateTrekking(items) {
  const trektag = document.getElementById("trekking");
  items.forEach((item) => {
    const trekCard = getElement("div", "");
    trekCard.innerHTML = `
            <li class="trek-title"><strong>${item.name},</strong> ${item.state} - ${item.height}</li>
    `;
    trektag.appendChild(trekCard);
  });
}

function populatePasses(items) {
  const trekTag = document.getElementById("passes");
  items.forEach((item) => {
    const trekCard = getElement("div", "");
    trekCard.innerHTML = `
            <li class="trek-title"><strong>${item.name},</strong> ${item.state} - ${item.height}</li>
    `;
    trekTag.appendChild(trekCard);
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
    background: linear-gradient(135deg, #ffdd99, #f9bf3f);
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
        <span style="width: 8px; height: 8px; background: #007acc; border-radius: 50%;"></span>
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
    if (!item) continue;

    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";
    repoCard.style = `
          flex: 1 0 48%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 12px;
          padding: 16px;
          font-size: 14px;
          background: linear-gradient(135deg, #ffdd99, #f9bf3f);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease-in-out;
          cursor: pointer;
      `;

    const repoLink = document.createElement("a");
    repoLink.href = `https://github.com/${item.author || 'unknown'}/${item.name || 'unknown'}`;
    repoLink.target = "_blank";
    repoLink.style = "text-decoration: none; color: black; display: block; height: 100%;";

    repoCard.appendChild(repoLink);

    const repoName = document.createElement("h4");
    repoName.className = "repo-heading";
    repoName.innerHTML = item.name || 'Unknown Repository';
    repoName.style = "margin: 0; font-size: 18px; font-weight: bold;";
    repoLink.appendChild(repoName);

    const repoDescription = document.createElement("p");
    repoDescription.className = "repo-description";
    repoDescription.innerHTML = item.description || 'No description available';
    repoDescription.style = "margin-top: 8px; font-size: 12px; color: #555;";
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
      spanTimelineLocation.style.color = "#666";
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
    divTimelineIcon.append(iFa);

    let divTimelineEntryInner = document.createElement("div");
    divTimelineEntryInner.className = "timeline-entry-inner";
    divTimelineEntryInner.append(divTimelineIcon);
    divTimelineEntryInner.append(divTimelineLabel);

    let article = document.createElement("article");
    article.className = "timeline-entry animate-box";
    article.append(divTimelineEntryInner);

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
fetchRepositories(); // New simplified GitHub API function
fetchGitConnectedData(gitConnected);
populateExp_Edu(experience, "experience");
populateTrekking(trekking);
populatePasses(passes);
populateExp_Edu(education, "education");
populateLinks(footer, "footer");

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
        <p>Please visit my <a href="https://github.com/KennedySovine" target="_blank" style="color: #f9bf3f;">GitHub profile</a> directly.</p>
      </div>
    `;
  }
}

// NEW 3-CARD LAYERED CAROUSEL IMPLEMENTATION
function displayRepositoryCarousel3Cards(repos) {
  const repoContainer = document.getElementById("repos");
  let currentCenterIndex = 0;

  // Create 3-card layered carousel container
  repoContainer.innerHTML = `
    <div style="position: relative; width: 100%; margin: 0 auto;">
      <div id="repo-carousel" style="
        width: 100%;
        min-height: 220px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        gap: 24px;
        perspective: 1000px;
      "></div>
      <div style="text-align: center; margin-top: 24px;">
        <button id="prev-repo" style="
          background: #f9bf3f;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          margin: 0 15px;
          cursor: pointer;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        " onmouseover="this.style.transform='scale(1.1) rotate(-5deg)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.25)'" 
           onmouseout="this.style.transform='scale(1) rotate(0deg)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">←</button>
        <span id="repo-counter" style="margin: 0 20px; font-weight: bold; font-size: 16px;"></span>
        <button id="next-repo" style="
          background: #f9bf3f;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          margin: 0 15px;
          cursor: pointer;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        " onmouseover="this.style.transform='scale(1.1) rotate(5deg)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.25)'" 
           onmouseout="this.style.transform='scale(1) rotate(0deg)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">→</button>
      </div>
      <div style="text-align: center; margin-top: 16px;">
        <div id="slide-indicators" style="display: flex; justify-content: center; gap: 8px;"></div>
      </div>
    </div>
  `;

  // Create individual repo card
  function createRepoCard(repo, position) {
    const card = document.createElement("div");
    card.className = `repo-card repo-card-${position}`;
    card.dataset.repoUrl = repo.url;

    // Base styles for all cards
    card.style.cssText = `
      position: absolute;
      width: 280px;
      height: 180px;
      padding: 20px;
      border-radius: 12px;
      background: linear-gradient(135deg, #ffdd99, #f9bf3f);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      top: 50%;
      transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: transform, opacity, left, right;
    `;

    // Position-specific styles and transitions
    if (position === "left") {
      card.style.cssText += `
        left: 50px;
        transform: translateY(-50%) scale(0.85);
        opacity: 0.7;
        z-index: 1;
        cursor: default;
      `;
    } else if (position === "center") {
      card.style.cssText += `
        left: 50%;
        transform: translateX(-50%) translateY(-50%) scale(1.12) translateY(-10px);
        opacity: 1;
        z-index: 3;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        pointer-events: auto;
      `;
    } else if (position === "right") {
      card.style.cssText += `
        right: 50px;
        left: auto;
        transform: translateY(-50%) scale(0.85);
        opacity: 0.7;
        z-index: 1;
        cursor: default;
      `;
    }

    card.innerHTML = `
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${repo.name}
        ${repo.isPinned ? '<span style="background: #007acc; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 8px;">📌</span>' : ''}
      </div>
      <div style="font-size: 13px; color: #666; margin-bottom: 16px; height: 40px; overflow: hidden; line-height: 1.4;">${repo.description || "No description available"}</div>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; color: #555;">
        <span style="display: flex; align-items: center; gap: 4px;">
          <span style="width: 8px; height: 8px; background: #007acc; border-radius: 50%;"></span>
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

  // Update display with 3-card layout and smooth animations
  function updateDisplay(direction = "none") {
    const carousel = document.getElementById("repo-carousel");
    const counter = document.getElementById("repo-counter");
    const indicators = document.getElementById("slide-indicators");

    // Animation configuration
    const animationDuration = 600;
    const isAnimating = carousel.classList.contains("animating");

    if (isAnimating) return; // Prevent overlapping animations

    carousel.classList.add("animating");

    // Get existing cards
    const existingCards = carousel.querySelectorAll(".repo-card");

    // Calculate new indices
    const leftIndex = (currentCenterIndex - 1 + repos.length) % repos.length;
    const rightIndex = (currentCenterIndex + 1) % repos.length;

    // Create new cards with initial hidden state
    const newLeftCard = createRepoCard(repos[leftIndex], "left");
    const newCenterCard = createRepoCard(repos[currentCenterIndex], "center");
    const newRightCard = createRepoCard(repos[rightIndex], "right");

    // Set initial animation states based on direction
    if (direction === "next") {
      // New cards slide in from the right
      newLeftCard.style.transform = "translateY(-50%) scale(0.85) translateX(100px)";
      newLeftCard.style.opacity = "0";
      newCenterCard.style.transform = "translateX(-50%) translateY(-50%) scale(1.12) translateY(-10px) translateX(100px)";
      newCenterCard.style.opacity = "0";
      newRightCard.style.transform = "translateY(-50%) scale(0.85) translateX(100px)";
      newRightCard.style.opacity = "0";
    } else if (direction === "prev") {
      // New cards slide in from the left
      newLeftCard.style.transform = "translateY(-50%) scale(0.85) translateX(-100px)";
      newLeftCard.style.opacity = "0";
      newCenterCard.style.transform = "translateX(-50%) translateY(-50%) scale(1.12) translateY(-10px) translateX(-100px)";
      newCenterCard.style.opacity = "0";
      newRightCard.style.transform = "translateY(-50%) scale(0.85) translateX(-100px)";
      newRightCard.style.opacity = "0";
    } else {
      // Fade in for initial load or indicator clicks
      newLeftCard.style.opacity = "0";
      newLeftCard.style.transform = "translateY(-50%) scale(0.75)";
      newCenterCard.style.opacity = "0";
      newCenterCard.style.transform = "translateX(-50%) translateY(-50%) scale(0.95) translateY(-10px)";
      newRightCard.style.opacity = "0";
      newRightCard.style.transform = "translateY(-50%) scale(0.75)";
    }

    // Add new cards to carousel
    carousel.appendChild(newLeftCard);
    carousel.appendChild(newCenterCard);
    carousel.appendChild(newRightCard);

    // Animate existing cards out
    if (existingCards.length > 0) {
      existingCards.forEach((card, index) => {
        if (direction === "next") {
          card.style.transform += " translateX(-100px)";
          card.style.opacity = "0";
        } else if (direction === "prev") {
          card.style.transform += " translateX(100px)";
          card.style.opacity = "0";
        } else {
          card.style.opacity = "0";
          card.style.transform += " scale(0.8)";
        }
      });
    }

    // Animate new cards in
    requestAnimationFrame(() => {
      // Reset transforms for smooth animation
      newLeftCard.style.transform = "translateY(-50%) scale(0.85)";
      newLeftCard.style.opacity = "0.7";
      newLeftCard.style.left = "50px";

      newCenterCard.style.transform = "translateX(-50%) translateY(-50%) scale(1.12) translateY(-10px)";
      newCenterCard.style.opacity = "1";
      newCenterCard.style.left = "50%";

      newRightCard.style.transform = "translateY(-50%) scale(0.85)";
      newRightCard.style.opacity = "0.7";
      newRightCard.style.right = "50px";
      newRightCard.style.left = "auto";
    });

    // Clean up after animation
    setTimeout(() => {
      if (existingCards.length > 0) {
        existingCards.forEach((card) => card.remove());
      }
      carousel.classList.remove("animating");

      // Add click handler to center card
      newCenterCard.onclick = () => window.open(repos[currentCenterIndex].url, "_blank");
    }, animationDuration);

    // Update counter with smooth transition
    counter.style.opacity = "0.5";
    setTimeout(() => {
      counter.textContent = `${currentCenterIndex + 1} of ${repos.length} repositories`;
      counter.style.opacity = "1";
    }, animationDuration / 2);

    // Update indicators with staggered animation
    indicators.innerHTML = "";
    repos.forEach((_, index) => {
      const indicator = document.createElement("div");
      const isActive = index === currentCenterIndex;
      indicator.style.cssText = `
        width: ${isActive ? '24px' : '8px'};
        height: 8px;
        border-radius: 4px;
        background: ${isActive ? '#007acc' : '#ccc'};
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        transform: scale(${isActive ? 1.2 : 1}) translateY(10px);
      `;

      // Staggered fade in
      setTimeout(() => {
        indicator.style.opacity = isActive ? "1" : "0.6";
        indicator.style.transform = `scale(${isActive ? 1.2 : 1}) translateY(0px)`;
      }, index * 50);

      indicator.onmouseover = () => {
        if (!isActive) {
          indicator.style.opacity = "0.8";
          indicator.style.transform = "scale(1.1) translateY(0px)";
        }
      };

      indicator.onmouseout = () => {
        if (!isActive) {
          indicator.style.opacity = "0.6";
          indicator.style.transform = "scale(1) translateY(0px)";
        }
      };

      indicator.onclick = () => {
        if (currentCenterIndex !== index) {
          currentCenterIndex = index;
          updateDisplay("fade");
        }
      };

      indicators.appendChild(indicator);
    });
  }

  // Navigation handlers with directional animations
  document.getElementById("prev-repo").onclick = () => {
    currentCenterIndex = (currentCenterIndex - 1 + repos.length) % repos.length;
    updateDisplay("prev");
  };

  document.getElementById("next-repo").onclick = () => {
    currentCenterIndex = (currentCenterIndex + 1) % repos.length;
    updateDisplay("next");
  };

  // Handle window resize for mobile responsiveness
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateDisplay();
    }, 250);
  });

  // Initial display
  updateDisplay();

  console.log(`✨ 3-card layered carousel displayed successfully with ${repos.length} repos!`);
}

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
