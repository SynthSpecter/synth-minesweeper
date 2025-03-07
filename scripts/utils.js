// Function to count neighbor mines
// Fonction pour compter les mines voisines
function countNeighborMines(row, col) {
  let count = 0
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue
      const newRow = row + i
      const newCol = col + j
      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length
      ) {
        if (board[newRow][newCol].isMine) count++
      }
    }
  }
  return count
}

// Function to get a cell element by its row and column
// Fonction pour obtenir un élément de cellule par sa ligne et sa colonne
function getCellElement(row, col) {
  return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
}

// Function to generate a random integer within a range
// Fonction pour générer un entier aléatoire dans une plage
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Function to format time in MM:SS format
// Fonction pour formater le temps au format MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}
