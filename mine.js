var mine = {
  total : 10, 
  height : 10, 
  width : 8, 

  board : [], 
  rCell : 0, 

  reset : () => {
    mine.board = [];
    mine.rCell = mine.height * mine.width;

    let wrap = document.getElementById("mine-wrap"),
        cssWidth = 100 / mine.width;
        wrap.innerHTML = "";

    for (let row=0; row<mine.height; row++) {
      mine.board.push([]);
      for (let col=0; col<mine.width; col++) {
        mine.board[row].push({
          r : false, 
          x : false, 
          m : false, 
          a : 0, 
          c : document.createElement("div")
        });

        let cell = mine.board[row][col].c;
        cell.classList.add("cell");
        cell.id = "mine-" + row + "-" + col;
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.onclick = () => { mine.open(cell); };
        cell.oncontextmenu = (e) => {
          e.preventDefault();
          mine.mark(cell);
        };
        cell.style.width = cssWidth + "%";
        cell.innerHTML = "&nbsp;";
        wrap.appendChild(cell);
      }
    }

    let mRow = mine.height - 1,
        mCol = mine.width - 1,
        mToLay = mine.total;
    while (mToLay > 0) {
      let row = Math.floor(Math.random() * mRow);
      let col = Math.floor(Math.random() * mCol);
      if (!mine.board[row][col].m) {
        mine.board[row][col].m = true;
        // CHEAT - SHOW MINE ON THE BOARD
        // mine.board[row][col].c.innerHTML = "*";
        mToLay--;
      }
    }

    for (let row=0; row<mine.height; row++) {
      let lastRow = row - 1,
          nextRow = row + 1;
      if (nextRow == mine.height) { nextRow = -1; }

      for (let col=0; col<mine.width; col++) {
        let lastCol = col - 1,
            nextCol = col + 1;
        if (nextCol == mine.width) { nextCol = -1; }

        if (!mine.board[row][col].m) {
          if (lastRow != -1) {
            if (lastCol != -1) { if (mine.board[lastRow][lastCol].m) { mine.board[row][col].a++; } }
            if (mine.board[lastRow][col].m) { mine.board[row][col].a++; }
            if (nextCol != -1) { if (mine.board[lastRow][nextCol].m) { mine.board[row][col].a++; } }
          }

          if (lastCol != -1) { if (mine.board[row][lastCol].m) { mine.board[row][col].a++; } }
          if (nextCol != -1) { if (mine.board[row][nextCol].m) { mine.board[row][col].a++; } }

          if (nextRow != -1) {
            if (lastCol != -1) { if (mine.board[nextRow][lastCol].m) { mine.board[row][col].a++; } }
            if (mine.board[nextRow][col].m) { mine.board[row][col].a++; }
            if (nextCol != -1) { if (mine.board[nextRow][nextCol].m) { mine.board[row][col].a++; } }
          }
        }

        // CHEAT - SHOW NUMBER OF ADJACENT MINES ON BOARD
        // if (mine.board[row][col].a != 0) { mine.board[row][col].c.innerHTML = mine.board[row][col].a ; }
      }
    }
  },

  mark : (cell) => {
    let row = cell.dataset.row,
        col = cell.dataset.col;

    if (!mine.board[row][col].r) {
      cell.classList.toggle("mark");
      mine.board[row][col].x = !mine.board[row][col].x;
    }
  },

  open : (cell) => {
    let row = cell.dataset.row,
        col = cell.dataset.col;

    if (!mine.board[row][col].x && mine.board[row][col].m) {
      cell.classList.add("boom");
      setTimeout(() => {
        alert("Opps. You lost.");
        mine.reset();
      }, 1);
    }

    else {
      let toReveal = [], 
          toCheck = [], 
          checked = [];
      for (let i=0; i<mine.height; i++) { checked.push({}); }
      toCheck.push([row, col]);

      while (toCheck.length>0) {
        let thisRow = parseInt(toCheck[0][0]),
            thisCol = parseInt(toCheck[0][1]);

        if (mine.board[thisRow][thisCol].m || mine.board[thisRow][thisCol].r || mine.board[thisRow][thisCol].x) {}
        else {
          if (!checked[thisRow][thisCol]) { toReveal.push([thisRow, thisCol]); }

          if (mine.board[thisRow][thisCol].a == 0) {
            let lastRow = thisRow - 1,
                nextRow = thisRow + 1,
                lastCol = thisCol - 1,
                nextCol = thisCol + 1;
            if (nextRow == mine.height) { nextRow = -1; }
            if (nextCol == mine.width) { nextCol = -1; }

            if (lastRow != -1) {
              if (lastCol != -1 && !checked[lastRow][lastCol]) { toCheck.push([lastRow, lastCol]); }
              if (!checked[lastRow][thisCol]) { toCheck.push([lastRow, thisCol]); }
              if (nextCol != -1 && !checked[lastRow][nextCol]) { toCheck.push([lastRow, nextCol]); }
            }

            if (lastCol != -1 && !checked[thisRow][lastCol]) { toCheck.push([thisRow, lastCol]); }
            if (nextCol != -1 && !checked[thisRow][nextCol]) { toCheck.push([thisRow, nextCol]); }

            if (nextRow != -1) {
              if (lastCol != -1 && !checked[nextRow][lastCol]) { toCheck.push([nextRow, lastCol]); }
              if (!checked[nextRow][thisCol]) { toCheck.push([nextRow, thisCol]); }
              if (nextCol != -1 && !checked[nextRow][nextCol]) { toCheck.push([nextRow, nextCol]); }
            }
          }
        }

        checked[thisRow][thisCol] = true;
        toCheck.shift();
      }

      if (toReveal.length > 0) {
        for (let cell of toReveal) {
          let thisRow = parseInt(cell[0]);
          let thisCol = parseInt(cell[1]);
          mine.board[thisRow][thisCol].r = true;
          if (mine.board[thisRow][thisCol].a != 0) {
            mine.board[thisRow][thisCol].c.innerHTML = mine.board[thisRow][thisCol].a;
          }
          mine.board[thisRow][thisCol].c.classList.add("reveal");
          mine.rCell = mine.rCell - 1;
        }
      }

      if (mine.rCell == mine.total) {
        alert("YOU WIN!");
        mine.reset();
      }
    }
  }
};
window.addEventListener("DOMContentLoaded", mine.reset);
