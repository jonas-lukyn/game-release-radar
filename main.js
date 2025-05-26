
const container = document.getElementById("game-container");
let favorites = [];
let currentPage = 1;
let isLoading = false;
let allGames = [];
let genresMap = {};

// Načítání nové stránky her
async function loadGames(page = 1) {
  isLoading = true;
  const response = await fetch(
    `https://api.rawg.io/api/games?dates=2025-01-01,2025-12-31&ordering=-added&page_size=40&page=${page}&key=318c95baaf5446f0a2188c65d62251df`
  );
  const data = await response.json();
  const games = data.results;

  // Ukládáme globálně, pokud budeš chtít ještě další manipulace
  allGames = allGames.concat(games);

  games.forEach((game) => {
    const genres = game.genres?.map((g) => g.name) || ["Nezařazeno"];
    genres.forEach((genre) => {
      if (!genresMap[genre]) {
        genresMap[genre] = [];
      }
      genresMap[genre].push({
        title: game.name,
        image: game.background_image,
      });
    });
  });

  renderGenres(genresMap);
  isLoading = false;
}

function renderGenres(genreData) {
  container.innerHTML = ""; // Vymažeme, aby se celý blok přegeneroval (jednodušší implementace)

  Object.entries(genreData).forEach(([genre, games]) => {
    const section = document.createElement("section");
    section.className = "row-section";

    const title = document.createElement("h2");
    title.className = "row-title";
    title.textContent = genre;

    const row = document.createElement("div");
    row.className = "row";
    row.dataset.genre = genre;

    games.forEach((game) => {
      const tile = document.createElement("div");
      tile.className = "game-tile";

      const link = document.createElement("a");
      link.href = `https://www.igdb.com/search?type=1&q=${encodeURIComponent(game.title)}`;
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = game.image || "";
      img.alt = game.title;

      link.appendChild(img);
      tile.appendChild(link);
      row.appendChild(tile);
    });

    row.addEventListener("scroll", () => {
      if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 100 && !isLoading) {
        currentPage++;
        loadGames(currentPage);
      }
    });

    section.appendChild(title);
    section.appendChild(row);
    container.appendChild(section);
  });
}

loadGames(currentPage);
