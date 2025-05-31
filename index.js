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

const { medium, gitConnected, gitRepo } = URLs;

async function fetchBlogsFromMedium(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Medium API error: ${response.status}`);
    }
    const data = await response.json();
    
    // Check if required data exists
    if (!data.items || !Array.isArray(data.items)) {
      console.warn("Medium API response missing items array");
      document.getElementById("blogs").innerHTML = "<li>No blog posts found.</li>";
      return;
    }
    
    // Safely get profile image if feed exists
    if (data.feed && data.feed.image) {
      document.getElementById("profile-img").src = data.feed.image;
    }
    
    populateBlogs(data.items, "blogs");
  } catch (error) {
    console.error("Error in fetching the blogs from Medium profile:", error);
    document.getElementById("blogs").innerHTML = "<li>Unable to load blog posts at this time.</li>";
  }
}

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
    blog,
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

function populateBlogs(items, id) {
  if (!items || !Array.isArray(items)) {
    console.warn("No blog items to populate");
    return;
  }
  
  const projectdesign = document.getElementById(id);
  if (!projectdesign) {
    console.warn(`Element with id '${id}' not found`);
    return;
  }
  
  const count = Math.min(3, items.length);

  for (let i = 0; i < count; i++) {
    const item = items[i];
    if (!item) continue;
    
    const blogCard = document.createElement("div");
    blogCard.className = "blog-card";
    blogCard.style = `
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          padding: 16px;
          font-size: 14px;
          background: linear-gradient(135deg, rgb(255, 221, 153), rgb(249, 191, 63));
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          min-height: 150px;
          cursor: pointer;
      `;

    const blogLink = document.createElement("a");
    blogLink.href = item.link || '#';
    blogLink.target = "_blank";
    blogLink.style = "text-decoration: none; color: black; display: block;";

    blogCard.appendChild(blogLink);

    const blogTitle = document.createElement("h4");
    blogTitle.className = "blog-heading";
    blogTitle.innerHTML = item.title || 'Untitled';
    blogTitle.style = "margin: 0px; font-size: 18px; font-weight: bold;";
    blogLink.appendChild(blogTitle);

    const pubDateEle = document.createElement("p");
    pubDateEle.className = "publish-date";
    pubDateEle.innerHTML = getBlogDate(item.pubDate);
    pubDateEle.style = "margin: 0 0 5px; font-size: 12px; color: #555;";
    blogLink.appendChild(pubDateEle);

    const blogDescription = document.createElement("p");
    blogDescription.className = "blog-description";
    const html = item.content || '';
    const [, doc] = /<p>(.*?)<\/p>/g.exec(html) || [null, 'No description available'];
    blogDescription.innerHTML = doc;
    blogDescription.style = "margin: 0 0 12px; font-size: 12px; color: #000;";
    blogLink.appendChild(blogDescription);

    const categoriesDiv = document.createElement("div");
    categoriesDiv.style = "display: flex; gap: 8px; margin-top: 12px;";

    if (item.categories && Array.isArray(item.categories)) {
      for (const category of item.categories) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.innerHTML = category;
        badge.style = `
                font-size: 12px;
                padding: 4px 8px;
                background-color: #007acc;
                color: white;
                border-radius: 4px;
            `;
        categoriesDiv.appendChild(badge);
      }
    }

    blogLink.appendChild(categoriesDiv);
    projectdesign.appendChild(blogCard);
  }
}

let repoSlides = [];
let currentRepoIndex = 0;
let animating = false;

// Helper: Render 3 slides (left, center, right) with animation
function renderRepoSlides(direction = null) {
  if (!repoSlides.length) return;
  const repoCarousel = document.getElementById("repos");
  repoCarousel.innerHTML = "";

  const total = repoSlides.length;
  const leftIdx = (currentRepoIndex - 1 + total) % total;
  const centerIdx = currentRepoIndex;
  const rightIdx = (currentRepoIndex + 1) % total;

  // Helper to create a card
  function createCard(repo, pos) {
    const div = document.createElement("div");
    div.className = `repo-card repo-card-${pos}`;
    div.style = `
      position: absolute;
      width: 300px;
      padding: 16px;
      border-radius: 12px;
      background: linear-gradient(135deg, #ffdd99, #f9bf3f);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.4s ease;
      ${pos === 'left' ? 'left: -150px; opacity: 0.5; transform: scale(0.8);' : ''}
      ${pos === 'center' ? 'left: 50%; transform: translateX(-50%); opacity: 1; z-index: 1; cursor: pointer;' : ''}
      ${pos === 'right' ? 'right: -150px; opacity: 0.5; transform: scale(0.8);' : ''}
    `;
    
    if (pos === "center") {
      div.onclick = () => window.open(`https://github.com/${repo.author}/${repo.name}`, "_blank");
    }
    
    div.innerHTML = `
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${repo.name}</div>
      <div style="font-size: 12px; color: #555; margin-bottom: 12px;">${repo.description || ""}</div>
      <div style="display: flex; gap: 16px; font-size: 12px; color: #666;">
        <span><strong>Language:</strong> ${repo.language || "N/A"}</span>
        <span><strong>★ Stars:</strong> ${repo.stars}</span>
        <span><strong>⑂ Forks:</strong> ${repo.forks}</span>
      </div>
    `;
    return div;
  }

  // Create cards
  const leftCard = createCard(repoSlides[leftIdx], "left");
  const centerCard = createCard(repoSlides[centerIdx], "center");
  const rightCard = createCard(repoSlides[rightIdx], "right");

  // Set container height and position
  const container = document.getElementById("repos");
  container.style.position = "relative";
  container.style.height = "200px";
  container.style.width = "100%";

  // Append in order: left, center, right
  container.appendChild(leftCard);
  container.appendChild(centerCard);
  container.appendChild(rightCard);
}

// Navigation with animation
function setupCarouselNavigation() {
  const leftBtn = document.getElementById("repo-carousel-left");
  const rightBtn = document.getElementById("repo-carousel-right");
  
  if (leftBtn && rightBtn) {
    leftBtn.onclick = () => {
      if (!repoSlides.length || animating) return;
      animating = true;
      currentRepoIndex = (currentRepoIndex - 1 + repoSlides.length) % repoSlides.length;
      renderRepoSlides("left");
      setTimeout(() => { animating = false; }, 400);
    };
    
    rightBtn.onclick = () => {
      if (!repoSlides.length || animating) return;
      animating = true;
      currentRepoIndex = (currentRepoIndex + 1) % repoSlides.length;
      renderRepoSlides("right");
      setTimeout(() => { animating = false; }, 400);
    };
  }
}

async function fetchReposFromGit(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Repos API error: ${response.status}`);
    }
    const items = await response.json();
    if (Array.isArray(items) && items.length > 0) {
      repoSlides = items;
      currentRepoIndex = 0;
      renderRepoSlides();
      setupCarouselNavigation();
    } else {
      console.warn("No repositories found from API");
      document.getElementById("repos").innerHTML = "<div>No repositories found.</div>";
    }
  } catch (error) {
    console.error("Error in fetching repos:", error);
    document.getElementById("repos").innerHTML = "<div>Unable to load repositories at this time.</div>";
  }
}

function populateRepo(items, id) {
  // This function is now replaced by the carousel functionality
  // but keeping it for compatibility if needed elsewhere
}

function populateExp_Edu(items, id) {
  let mainContainer = document.getElementById(id);

  for (let i = 0; i < items.length; i++) {
    let spanTimelineSublabel = document.createElement("span");
    spanTimelineSublabel.className = "timeline-sublabel";
    spanTimelineSublabel.innerHTML = items[i].subtitle;

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

function getBlogDate(publishDate) {
  const elapsed = Date.now() - Date.parse(publishDate);

  // Time conversions in milliseconds
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  if (elapsed < msPerMinute) {
    const seconds = Math.floor(elapsed / msPerSecond);
    return `${seconds} seconds ago`;
  } else if (elapsed < msPerHour) {
    const minutes = Math.floor(elapsed / msPerMinute);
    return `${minutes} minutes ago`;
  } else if (elapsed < msPerDay) {
    const hours = Math.floor(elapsed / msPerHour);
    return `${hours} hours ago`;
  } else if (elapsed < msPerMonth) {
    const days = Math.floor(elapsed / msPerDay);
    return days == 1 ? `${days} day ago` : `${days} days ago`;
  } else if (elapsed < msPerYear) {
    const months = Math.floor(elapsed / msPerMonth);
    return months == 1 ? `${months} month ago` : `${months} months ago`;
  } else {
    const years = Math.floor(elapsed / msPerYear);
    return years == 1 ? `${years} year ago` : `${years} years ago`;
  }
}

populateBio(bio, "bio");
populateSkills(skills, "skills");
fetchBlogsFromMedium(medium);
fetchReposFromGit(gitRepo);
fetchGitConnectedData(gitConnected);
populateExp_Edu(experience, "experience");
populateTrekking(trekking);
populatePasses(passes);
populateExp_Edu(education, "education");
populateLinks(footer, "footer");
