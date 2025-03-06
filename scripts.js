const BOARD_SIZE = 8
const MINE_COUNT = 10

let board = []
let mineLocations = []
let gameOver = false
let timer = 0
let timerInterval

const gameBoard = document.getElementById('game-board')
const mineCountDisplay = document.getElementById('mine-count')
const timerDisplay = document.getElementById('timer')
const newGameBtn = document.getElementById('new-game-btn')

function initializeGame() {
  board = []
  mineLocations = []
  gameOver = false
  timer = 0
  clearInterval(timerInterval)
  timerDisplay.textContent = 'Temps: 0s'
  mineCountDisplay.textContent = `Mines: ${MINE_COUNT}`

  // Create board
  for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = []
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = {
        isMine: false,
        isRevealed: false,
        neighborMines: 0,
      }
    }
  }

  // Place mines
  for (let i = 0; i < MINE_COUNT; i++) {
    let row, col
    do {
      row = Math.floor(Math.random() * BOARD_SIZE)
      col = Math.floor(Math.random() * BOARD_SIZE)
    } while (board[row][col].isMine)

    board[row][col].isMine = true
    mineLocations.push({ row, col })
  }

  // Calculate neighbor mines
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!board[i][j].isMine) {
        board[i][j].neighborMines = countNeighborMines(i, j)
      }
    }
  }

  renderBoard()
  startTimer()
}

function countNeighborMines(row, col) {
  let count = 0
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue
      const newRow = row + i
      const newCol = col + j
      if (
        newRow >= 0 &&
        newRow < BOARD_SIZE &&
        newCol >= 0 &&
        newCol < BOARD_SIZE
      ) {
        if (board[newRow][newCol].isMine) count++
      }
    }
  }
  return count
}

function renderBoard() {
  gameBoard.innerHTML = ''
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
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

function revealCell(row, col) {
  if (gameOver || board[row][col].isRevealed) return

  board[row][col].isRevealed = true
  const cell = gameBoard.children[row * BOARD_SIZE + col]
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
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i
          const newCol = col + j
          if (
            newRow >= 0 &&
            newRow < BOARD_SIZE &&
            newCol >= 0 &&
            newCol < BOARD_SIZE
          ) {
            revealCell(newRow, newCol)
          }
        }
      }
    }
  }

  checkWinCondition()
}

function toggleFlag(row, col) {
  if (gameOver || board[row][col].isRevealed) return

  const cell = gameBoard.children[row * BOARD_SIZE + col]
  if (cell.textContent === '🚩') {
    cell.textContent = ''
  } else {
    cell.textContent = '🚩'
  }
}

function revealAllMines() {
  for (const { row, col } of mineLocations) {
    const cell = gameBoard.children[row * BOARD_SIZE + col]
    cell.classList.add('revealed', 'mine')
    cell.textContent = '💣'
  }
}

function checkWinCondition() {
  const revealedCount = board.flat().filter((cell) => cell.isRevealed).length
  if (revealedCount === BOARD_SIZE * BOARD_SIZE - MINE_COUNT) {
    gameOver = true
    clearInterval(timerInterval)
    alert('Vous avez gagné !')
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer++
    timerDisplay.textContent = `Temps: ${timer}s`
  }, 1000)
}

newGameBtn.addEventListener('click', initializeGame)

initializeGame()
