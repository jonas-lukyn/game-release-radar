
async function loadGames() {
    const response = await fetch('games.json');
    const games = await response.json();
    displayGames(games);

    document.getElementById('platform-filter').addEventListener('change', function() {
        const platform = this.value;
        const filtered = platform === 'all' ? games : games.filter(g => g.platform === platform);
        displayGames(filtered);
    });
}

function displayGames(games) {
    const list = document.getElementById('game-list');
    list.innerHTML = '';
    games.forEach(game => {
        const li = document.createElement('li');
        li.textContent = `${game.title} – ${game.release_date} (${game.platform})`;
        list.appendChild(li);
    });
}

loadGames();
