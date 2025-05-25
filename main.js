
let allGames = [];
let favorites = [];
let currentPage = 1;
const pageSize = 20;

async function loadGames(page = 1) {
    const response = await fetch(`https://api.rawg.io/api/games?dates=2025-01-01,2025-12-31&ordering=-added&page_size=${pageSize}&page=${page}&key=318c95baaf5446f0a2188c65d62251df`);
    const data = await response.json();
    allGames = data.results.map(game => {
        return {
            title: game.name,
            release_date: game.released,
            platform: game.platforms?.map(p => p.platform.name).join(', ') || 'Neznámé'
        };
    });
    favorites = getFavorites();
    renderGames();
    renderPagination(data.previous !== null, data.next !== null);
    setupFilter();
}

function setupFilter() {
    const platforms = new Set(allGames.flatMap(g => g.platform.split(', ')));
    const filter = document.getElementById('platform-filter');
    filter.innerHTML = '<option value="all">Vše</option>' +
        Array.from(platforms).map(p => `<option value="${p}">${p}</option>`).join('');
    filter.addEventListener('change', () => loadGames(currentPage));
}

function renderGames() {
    const list = document.getElementById('game-list');
    const platform = document.getElementById('platform-filter').value;
    const mode = document.getElementById('toggle-favorites').dataset.mode;

    list.innerHTML = '';

    let filteredGames = allGames.filter(game =>
        platform === 'all' || game.platform.includes(platform));
    if (mode === 'favorites') {
        filteredGames = filteredGames.filter(game => favorites.includes(game.title));
    }

    filteredGames.forEach(game => {
        const isFav = favorites.includes(game.title);

        const li = document.createElement('li');
        const nameCol = document.createElement('span');
        const dateCol = document.createElement('span');
        const platformCol = document.createElement('span');
        const button = document.createElement('button');

        nameCol.textContent = game.title;
        dateCol.textContent = game.release_date;
        platformCol.textContent = game.platform;
        button.textContent = isFav ? '✓ V oblíbených' : '+ Přidat';

        button.style.marginLeft = '1em';
        button.onclick = () => {
            toggleFavorite(game.title);
        };

        nameCol.style.display = 'inline-block';
        nameCol.style.width = '35%';
        dateCol.style.display = 'inline-block';
        dateCol.style.width = '20%';
        platformCol.style.display = 'inline-block';
        platformCol.style.width = '30%';

        li.appendChild(nameCol);
        li.appendChild(dateCol);
        li.appendChild(platformCol);
        li.appendChild(button);

        list.appendChild(li);
    });
}

function renderPagination(hasPrev, hasNext) {
    let pag = document.getElementById('pagination');
    if (!pag) {
        pag = document.createElement('div');
        pag.id = 'pagination';
        pag.className = 'pagination';
        document.body.appendChild(pag);
    }

    pag.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Předchozí';
    prevBtn.disabled = !hasPrev;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            loadGames(currentPage);
        }
    };

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Další →';
    nextBtn.disabled = !hasNext;
    nextBtn.onclick = () => {
        currentPage++;
        loadGames(currentPage);
    };

    const pageIndicator = document.createElement('span');
    pageIndicator.textContent = `Stránka ${currentPage}`;

    pag.appendChild(prevBtn);
    pag.appendChild(pageIndicator);
    pag.appendChild(nextBtn);
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(title) {
    if (favorites.includes(title)) {
        favorites = favorites.filter(t => t !== title);
    } else {
        favorites.push(title);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderGames();
}

document.getElementById('toggle-favorites').addEventListener('click', () => {
    const toggle = document.getElementById('toggle-favorites');
    toggle.dataset.mode = toggle.dataset.mode === 'all' ? 'favorites' : 'all';
    toggle.textContent = toggle.dataset.mode === 'all' ? 'Zobrazit oblíbené' : 'Zobrazit všechny';
    loadGames(currentPage);
});

loadGames(currentPage);
