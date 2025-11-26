const username = "LudGar"; // your GitHub username
const repoList = document.getElementById("repo-list");

fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
  .then(resp => resp.json())
  .then(repos => {
    repoList.innerHTML = ""; // clear loading text

    repos.forEach(repo => {
      // Skip forks and private repos automatically
      if (repo.fork) return;

      const card = document.createElement("div");
      card.className = "repo-card";

      card.innerHTML = `
        <a href="${repo.homepage || repo.html_url}" class="repo-link" target="_blank">
          <h2 class="repo-name">${repo.name}</h2>
        </a>
        <p class="repo-description">
          ${repo.description || "No description provided."}
        </p>
      `;

      repoList.appendChild(card);
    });
  })
  .catch(err => {
    repoList.innerHTML = "<div class='loading'>Failed to load repositories.</div>";
    console.error(err);
  });
