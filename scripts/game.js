// Game variables
// Variables du jeu
let board = []
let mineLocations = []
let gameOver = false
let timer = 0
let timerInterval
let score = 0
let difficulty

// Function to initialize the game
// Fonction pour initialiser le jeu
function initializeGame(diff, customSettings) {
  difficulty = diff
  let boardSize, mineCount

  // Set board size and mine count based on difficulty
  // Définir la taille du plateau et le nombre de mines en fonction de la difficulté
  switch (difficulty) {
    case 'easy':
      boardSize = 8
      mineCount = 10
      break
    case 'medium':
      boardSize = 16
      mineCount = 40
      break
    case 'hard':
      boardSize = 24
      mineCount = 99
      break
    case 'custom':
      boardSize = customSettings.width
      mineCount = customSettings.mines
      break
  }

  // Reset game variables
  // Réinitialiser les variables du jeu
  board = []
  mineLocations = []
  gameOver = false
  timer = 0
  score = 0
  clearInterval(timerInterval)

  // Update display elements
  // Mettre à jour les éléments d'affichage
  document.getElementById('timer').textContent = 'Temps: 0s'
  document.getElementById('mine-count').textContent = `Mines: ${mineCount}`
  document.getElementById('score').textContent = 'Score: 0'

  // Create board
  // Créer le plateau
  for (let i = 0; i < boardSize; i++) {
    board[i] = []
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = {
        isMine: false,
        isRevealed: false,
        neighborMines: 0,
      }
    }
  }

  // Place mines
  // Placer les mines
  for (let i = 0; i < mineCount; i++) {
    let row, col
    do {
      row = Math.floor(Math.random() * boardSize)
      col = Math.floor(Math.random() * boardSize)
    } while (board[row][col].isMine)

    board[row][col].isMine = true
    mineLocations.push({ row, col })
  }

  // Calculate neighbor mines
  // Calculer les mines voisines
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (!board[i][j].isMine) {
        board[i][j].neighborMines = countNeighborMines(i, j)
      }
    }
  }

  renderBoard()
  startTimer()
}

// Function to render the game board
// Fonction pour afficher le plateau de jeu
function renderBoard() {
  const gameBoard = document.getElementById('game-board')
  gameBoard.innerHTML = ''
  gameBoard.style.gridTemplateColumns = `repeat(${board.length}, 1fr)`

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.dataset.row = i
      cell.dataset.col = j
      cell.addEventListener('click', () => revealCell(i, j))
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        toggleFlag(i, j)
      })
      gameBoard.appendChild(cell)
    }
  }
}

// Function to reveal a cell
// Fonction pour révéler une cellule
function revealCell(row, col) {
  if (gameOver || board[row][col].isRevealed) return

  board[row][col].isRevealed = true
  const cell = getCellElement(row, col)
  cell.classList.add('revealed')

  if (board[row][col].isMine) {
    gameOver = true
    cell.classList.add('mine')
    cell.textContent = '💥'
    revealAllMines()
    clearInterval(timerInterval)
    alert('Game Over!')
  } else {
    if (board[row][col].neighborMines > 0) {
      cell.textContent = board[row][col].neighborMines
    } else {
      // Reveal neighboring cells
      // Révéler les cellules voisines
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i
          const newCol = col + j
          if (
            newRow >= 0 &&
            newRow < board.length &&
            newCol >= 0 &&
            newCol < board[0].length
          ) {
            revealCell(newRow, newCol)
          }
        }
      }
    }
  }

  checkWinCondition()
}

// Function to toggle a flag on a cell
// Fonction pour basculer un drapeau sur une cellule
function toggleFlag(row, col) {
  if (gameOver || board[row][col].isRevealed) return

  const cell = getCellElement(row, col)
  if (cell.textContent === '🚩') {
    cell.textContent = ''
  } else {
    cell.textContent = '🚩'
  }
}

// Function to reveal all mines
// Fonction pour révéler toutes les mines
function revealAllMines() {
  for (const { row, col } of mineLocations) {
    const cell = getCellElement(row, col)
    cell.classList.add('revealed', 'mine')
    cell.textContent = '💣'
  }
}

// Function to check if the game is won
// Fonction pour vérifier si le jeu est gagné
function checkWinCondition() {
  const revealedCount = board.flat().filter((cell) => cell.isRevealed).length
  if (revealedCount === board.length * board[0].length - mineLocations.length) {
    gameOver = true
    clearInterval(timerInterval)
    updateScore()
    saveHighScore()
    alert(`Vous avez gagné ! Votre score : ${score}`)
  }
}

// Function to start the game timer
// Fonction pour démarrer le chronomètre du jeu
function startTimer() {
  timerInterval = setInterval(() => {
    timer++
    document.getElementById('timer').textContent = `Temps: ${timer}s`
    updateScore()
  }, 1000)
}

// Function to update the score
// Fonction pour mettre à jour le score
function updateScore() {
  score = Math.max(0, 1000 - timer * 10)
  document.getElementById('score').textContent = `Score: ${score}`
}

// Function to save high scores
// Fonction pour sauvegarder les meilleurs scores
function saveHighScore() {
  const highScores = JSON.parse(localStorage.getItem('highScores') || '[]')
  highScores.push({ score, difficulty })
  highScores.sort((a, b) => b.score - a.score)
  highScores.splice(10) // Garder seulement les 10 meilleurs scores
  localStorage.setItem('highScores', JSON.stringify(highScores))
}
