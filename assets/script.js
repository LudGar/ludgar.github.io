const username = "LudGar"; // your GitHub username
const repoList = document.getElementById("repo-list");

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
  .then(resp => {
    if (!resp.ok) {
      throw new Error(`GitHub API error: ${resp.status}`);
    }
    return resp.json();
  })
  .then(repos => {
    repoList.innerHTML = ""; // clear loading state

    const pagesRepoName = `${username.toLowerCase()}.github.io`;

    // Filter: no forks, no archived, no GitHub Pages repo
    const visibleRepos = repos.filter(repo =>
      !repo.fork &&
      repo.name.toLowerCase() !== pagesRepoName
    );

    if (!visibleRepos.length) {
      repoList.innerHTML = "<div class='loading'>No public repositories found.</div>";
      return;
    }

    visibleRepos.forEach(repo => {

      const card = document.createElement("div");
      card.className = "repo-card";

      const primaryLink =
        repo.homepage && repo.homepage.trim().length
          ? repo.homepage
          : repo.html_url;

      card.innerHTML = `
        <a href="${primaryLink}" class="repo-link" target="_blank" rel="noopener noreferrer">
          <h2 class="repo-name">${repo.name}</h2>
        </a>
        <p class="repo-description">
          ${repo.description || "No description provided."}
        </p>
        <div class="repo-meta">
          ${repo.language ? `<span class="repo-tag">Lang: ${repo.language}</span>` : ""}
          <span class="repo-tag">★ ${repo.stargazers_count}</span>
          <span class="repo-tag">Updated: ${formatDate(repo.updated_at)}</span>
        </div>
      `;

      repoList.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    repoList.innerHTML = "<div class='loading'>Failed to load repositories from GitHub.</div>";
  });
