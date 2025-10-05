const map = []; //0-spatiu liber, 1-rosu, 2-galben
let winPercentage = {};
let cadePiesa = false, gameStarted = false, playAI = false;
const player = {
    _name: 'red',
    get name() {
        return this._name;
    },
    get code() {
        if (this.name === 'red')
            return 1;
        return 2;
    },
    set name(name) {
        this._name = name;
    }
};
window.addEventListener("load", () => {
    winPercentage = JSON.parse(localStorage.getItem('winPercentage')) || { red: 0, yellow: 0 };
    const mapGame = document.getElementById('map');
    let content = "<table>";
    for (let i = 0; i < 7; i++) {
        let row = [];
        content += "<tr>";
        for (let j = 0; j < 8; j++) {
            content += `<td data-i="${i}" data-j="${j}"></td>`;
            row.push(0);
        }
        content += "</tr>";
        map.push(row);
    }
    content += "</table>";
    mapGame.innerHTML = content;
    addEvents();
});

function addEvents() {
    let cells = document.querySelectorAll("#map td");
    cells.forEach(cell => {
        cell.addEventListener("click", playGame)
    });
    let reset = document.getElementById('reset');
    reset.addEventListener("click",()=>{
        if (confirm("Sigur vrei sa resetezi jocul?"))
            location.reload();
    });
    let change = document.getElementById('changePlayer');
    change.addEventListener("click",()=>{
        if(!gameStarted)
            switchPlayer();
    });
    let score = document.getElementById('showScore');
    score.addEventListener("click",()=>{
        alert(`Rosu: ${winPercentage.red} victorii\nYellow: ${winPercentage.yellow} victorii`);
    });
    let resetScore = document.getElementById('resetScore');
    resetScore.addEventListener("click",()=>{
        console.log('reset');
        if(confirm('Are you sure you want to reset the score?')){
            winPercentage.red = 0;
            winPercentage.yellow = 0;
        }
    });
}

async function playGame(event) {
    gameStarted = true;
    let change = document.getElementById('changePlayer');
    change.classList.add('forbidden');
    change.classList.remove('good');
    change.setAttribute('title','Game already started');
    if (cadePiesa) return;
    const col = Number(event.target.dataset.j);
    if (map[0][col] !== 0) {
        alert('Miscare imposibila');
        return;
    }
    await placePiece(col);
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function placePiece(col) {
    cadePiesa = true;
    let row = 0;
    if (map[row][col] === 0) {
        coloreaza(row, col);
        row++;
        await delay(80);
    }
    while (row < map.length && map[row][col] === 0) {
        sterge(row - 1, col);
        coloreaza(row, col);
        await delay(80);
        row++;
    }
    map[row - 1][col] = player.code;
    if (checkWin(row - 1, col)) {
        winPercentage[player.name]++;
        localStorage.setItem('winPercentage', JSON.stringify(winPercentage));
        alert(`A castigat jucatorul ${player.name === 'red' ? 'rosu' : 'galben'}`);
        location.reload();
    }
    switchPlayer();
    cadePiesa = false;
}


function coloreaza(row, col) {
    let cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        if (Number(cell.dataset.i) === row && Number(cell.dataset.j) === col)
            cell.classList.add(`${player.name}`);
    })
}

function sterge(row, col) {
    let cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        if (Number(cell.dataset.i) === row && Number(cell.dataset.j) === col)
            cell.classList.remove(`${player.name}`);
    })
}

function switchPlayer() {
    let body = document.body;
    let text = document.querySelector('span');
    let nextPlayer = '';
    if (player.code === 1)
        nextPlayer = 'yellow';
    else
        nextPlayer = 'red';
    player.name = `${nextPlayer}`;
    text.innerHTML = `<strong>${nextPlayer}</strong>`;
    text.style.color = `${nextPlayer}`;
    body.style.background = `linear-gradient(#010e34 70%, ${nextPlayer})`;
}

function inMap(x, y) {
    return x >= 0 && x <= 6 && y >= 0 && y <= 7;
}

function checkWin(x, y) {
    //Vom verifica cele 4 directii: orizontal, verical, si cele 2 diagonale: \ /
    const dy = [[-1, 1], [0, 0], [-1, 1], [1, -1]];
    const dx = [[0, 0], [-1, 1], [-1, 1], [-1, 1]];
    let i, j, steps, connected, cod = player.code;
    for (i = 0; i < 4; i++) {
        connected = 1;
        for (j = 0; j < 2; j++)
            for (steps = 1; steps <= 3; steps++) { //vedem cate sunt conectate
                let newX = x + steps * dx[i][j];
                let newY = y + steps * dy[i][j];
                if (inMap(newX, newY) && map[newX][newY] === cod)
                    connected++;
                else
                    break;
            }
        if (connected >= 4)
            return true;
    }
    return false;
}