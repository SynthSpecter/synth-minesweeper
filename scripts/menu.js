// Function to create the main menu
// Fonction pour créer le menu principal
function createMainMenu() {
  const app = document.getElementById('app')
  app.innerHTML = `
        <h1>Démineur Synthwave</h1>
        <button id="easy">Facile (8x8, 10 mines)</button>
        <button id="medium">Moyen (16x16, 40 mines)</button>
        <button id="hard">Difficile (24x24, 99 mines)</button>
        <button id="custom">Personnalisé</button>
        <div id="instructions">
            <h2>Comment jouer</h2>
            <p>Cliquez pour révéler une case. Clic droit pour marquer une mine. Révélez toutes les cases sans mines pour gagner !</p>
        </div>
    `

  // Add event listeners to the buttons
  // Ajouter des écouteurs d'événements aux boutons
  app.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.id === 'custom') {
        showCustomDialog()
      } else {
        startGame(button.id)
      }
    })
  })
}

// Function to show the custom game settings dialog
// Fonction pour afficher la boîte de dialogue des paramètres de jeu personnalisés
function showCustomDialog() {
  const dialog = document.createElement('div')
  dialog.id = 'custom-dialog'
  dialog.innerHTML = `
        <h2>Paramètres personnalisés</h2>
        <label>Largeur : <input type="number" id="width" min="8" max="50" value="16"></label>
        <label>Hauteur : <input type="number" id="height" min="8" max="50" value="16"></label>
        <label>Mines : <input type="number" id="mines" min="1" max="2500" value="40"></label>
        <button id="start-custom">Commencer</button>
    `

  document.body.appendChild(dialog)

  // Add event listener to the start button
  // Ajouter un écouteur d'événements au bouton de démarrage
  document.getElementById('start-custom').addEventListener('click', () => {
    const width = parseInt(document.getElementById('width').value)
    const height = parseInt(document.getElementById('height').value)
    const mines = parseInt(document.getElementById('mines').value)
    startGame('custom', { width, height, mines })
    dialog.remove()
  })
}

// Function to start the game with the selected difficulty or custom settings
// Fonction pour démarrer le jeu avec la difficulté sélectionnée ou les paramètres personnalisés
function startGame(difficulty, customSettings) {
  const app = document.getElementById('app')
  app.innerHTML = `
        <div id="game-info">
            <span id="mine-count"></span>
            <span id="timer">Temps: 0s</span>
            <span id="score">Score: 0</span>
        </div>
        <div id="game-board"></div>
        <button id="new-game-btn">Nouvelle Partie</button>
    `

  // Add event listener to the new game button
  // Ajouter un écouteur d'événements au bouton nouvelle partie
  document.getElementById('new-game-btn').addEventListener('click', () => {
    createMainMenu()
  })

  // Initialize the game with the selected settings
  // Initialiser le jeu avec les paramètres sélectionnés
  initializeGame(difficulty, customSettings)
}
