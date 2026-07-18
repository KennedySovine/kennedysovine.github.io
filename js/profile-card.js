window.addEventListener("DOMContentLoaded", async function () {
  async function get(url) {
    const resp = await fetch(url);
    return resp.json();
  }

  document.querySelectorAll(".github-card").forEach(async function (el) {
    const username = el.getAttribute("username");

    const response = await get(`https://api.github.com/users/${username}`);
    const { name, avatar_url, public_repos, followers, html_url, following } =
      response;

    el.innerHTML = `
        <a href="${html_url}" target="_blank" style="text-decoration: none; color: white; display: block; border-radius: 12px; padding: 16px; font-size: 14px; background: linear-gradient(135deg, var(--secondary-color), var(--accent-color)); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); transition: transform 0.2s ease-in-out;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <img style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid #fff;" src="${avatar_url}" alt="Profile image"></img>
                <div style="flex-grow: 1;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #ffffff; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);">${name}</h3>
                    <p style="margin: 4px 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.82); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);">
                        @${html_url.replace("https://", "")}
                    </p>
                </div>
            </div>
            <div style="margin-top: 16px; display: flex; justify-content: space-between; text-align: center;">
                <div>
                    <p style="font-size: 12px; color: rgba(255, 255, 255, 0.7); margin: 0; letter-spacing: 0.06em;">REPOSITORIES</p>
                    <p style="font-size: 20px; font-weight: bold; color: #ffffff; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22);">${public_repos}</p>
                </div>
                <div>
                    <p style="font-size: 12px; color: rgba(255, 255, 255, 0.7); margin: 0; letter-spacing: 0.06em;">FOLLOWERS</p>
                    <p style="font-size: 20px; font-weight: bold; color: #ffffff; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22);">${followers}</p>
                </div>
                <div>
                    <p style="font-size: 12px; color: rgba(255, 255, 255, 0.7); margin: 0; letter-spacing: 0.06em;">FOLLOWING</p>
                    <p style="font-size: 20px; font-weight: bold; color: #ffffff; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22);">${following}</p>
                </div>
            </div>
        </a>
        `;
  });
});
