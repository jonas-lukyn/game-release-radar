
const container = document.getElementById("game-container");
let currentPage = 1;
let isLoading = false;
const genresMap = {};
const genreRows = {};

async function loadMultiplePages(pagesToLoad = 5) {
  for (let i = 0; i < pagesToLoad; i++) {
    await loadGames(currentPage);
    currentPage++;
  }
}

async function loadGames(page) {
  isLoading = true;
  const response = await fetch(
    `https://api.rawg.io/api/games?dates=2025-01-01,2025-12-31&ordering=-added&page_size=40&page=${page}&key=318c95baaf5446f0a2188c65d62251df`
  );
  const data = await response.json();
  const games = data.results;

  games.forEach((game) => {
    const genres = game.genres?.map((g) => g.name) || ["Nezařazeno"];
    genres.forEach((genre) => {
      if (!genresMap[genre]) {
        genresMap[genre] = [];
      }
      genresMap[genre].push({
        title: game.name,
        date: game.released,
        image: game.background_image
      });
    });
  });

  renderNewGames(games);
  isLoading = false;
}

function renderNewGames(games) {
  games.forEach((game) => {
    const genres = game.genres?.map((g) => g.name) || ["Nezařazeno"];
    genres.forEach((genre) => {
      if (!genreRows[genre]) {
        const section = document.createElement("section");
        section.className = "row-section";

        const title = document.createElement("h2");
        title.className = "row-title";
        title.textContent = genre;

        const row = document.createElement("div");
        row.className = "row";
        row.dataset.genre = genre;

        row.addEventListener("scroll", () => {
          if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 100 && !isLoading) {
            loadGames(currentPage++);
          }
        });

        section.appendChild(title);
        section.appendChild(row);
        container.appendChild(section);
        genreRows[genre] = row;
      }

      const tile = document.createElement("div");
      tile.className = "game-tile";

      const link = document.createElement("a");
      link.href = `https://www.igdb.com/search?type=1&q=${encodeURIComponent(game.title)}`;
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = game.image || "";
      img.alt = game.title;

      const info = document.createElement("div");
      info.className = "game-info";
      info.innerHTML = `<strong>${game.title}</strong><br>${game.date || 'TBA'}`;

      link.appendChild(img);
      tile.appendChild(link);
      tile.appendChild(info);
      genreRows[genre].appendChild(tile);
    });
  });
}

loadMultiplePages(5);
