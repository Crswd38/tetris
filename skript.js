
// 랜덤한 정수를 생성하는 함수입니다.
function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 테트리스 블록의 순서를 생성하는 함수입니다.
function generateSequence(){
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while(sequence.length){
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        tetrominoSequence.push(name);
    }
}

// 다음 테트리스 블록을 가져오는 함수입니다.
function getNextTetromino(){
    if(tetrominoSequence.length === 0){
        generateSequence();
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];

    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    const row = name === 'I' ? -1 : -2;

    return{
        name: name,
        matrix: matrix,
        row: row,
        col: col
    };
}

// 테트리스 블록을 회전시키는 함수입니다.
function rotate(matrix){
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
    );

    return result;
}

// 테트리스 블록의 이동이 유효한지 확인하는 함수입니다.
function isValidMove(matrix, cellRow, cellCol){
    for(let row = 0; row < matrix.length; row++){
        for(let col = 0; col < matrix[row].length; col++){
            if(matrix[row][col] && (
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                playfield[cellRow + row][cellCol + col])
            ){
                return false;
            }
        }
    }
    return true;
}

// 테트리스 블록을 게임 필드에 배치하는 함수입니다.
function placeTetromino(){
    for(let row = 0; row < tetromino.matrix.length; row++){
        for(let col = 0; col < tetromino.matrix[row].length; col++){
            if(tetromino.matrix[row][col]){
                if(tetromino.row + row < 0){
                    return showGameOver();
                }
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }

    for(let row = playfield.length - 1; row >= 0; ){
        if(playfield[row].every(cell => !!cell)){
            for(let r = row; r >= 0; r--){
                for(let c = 0; c < playfield[r].length; c++){
                    playfield[r][c] = playfield[r-1][c];
                }
            }
        }else{
            row--;
        }
    }
    tetromino = getNextTetromino();
}

// 게임 오버 화면을 표시하는 함수입니다.
function showGameOver(){
    cencelAnimationFrame(rAF);
    gameOver = true;

    AudioContext.fillStyle = 'black';
    AudioContext.globalAlpha = 0.75;
    AudioContext.fillRect(0, canvas.height / 2 - 30, canvas.width / 60);

    AudioContext.globalAlpha = 1;
    AudioContext.fillStyle = 'white';
    AudioContext.font = '36px monespace';
    AudioContext.textAlign = 'center';
    AudioContext.textBaseline = 'middle';
    AudioContext.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}

// 캔버스와 그리드, 테트리스 블록의 순서, 게임 필드 등을 설정합니다.
const canvas = document.getElementById('game');
const conText = canvas.getContext('2d');
const grid = 32;
const tetrominoSequence = [];

const playfield = [];

for(let row = -1; row < 20; row++){
    playfield[row] = [];

    for(let col = 0; col < 10; col++){
        playfield[row][col] = 0;
    }
}

// 테트리스 블록의 모양과 색상을 설정합니다.
const tetrominos = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
};

const colors = {
    'I': 'cyan',
    'O': 'Yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

// 게임의 상태를 관리하는 변수들입니다.
let count = 0;
let tetromino = getNextTetromino();
let rAF = null;
let gameOver = false;

// 게임 루프 함수입니다.
function loop(){
    rAF = requestAnimationFrame(loop);
    conText.clearRect(0,0,canvas.width,canvas.height);

    for(let row = 0; row < 20; row++){
        for(let col = 0; col < 10; col++){
            if(playfield[row][col]){
                const name = playfield[row][col];
                conText.fillStyle = colors[name];

                conText.fillRect(col * grid, row * grid, grid-1, grid-1);
            }
        }
    }
    if(tetromino){
        if(++count > 35){
            tetromino.row++;
            count = 0;

            if(!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)){
                tetromino.row--;
                placeTetromino();
            }
        }
        conText.fillStyle = colors[tetromino.name];

        for(let row = 0; row < tetromino.matrix.length; row++){
            for(let col = 0; col < tetromino.matrix[row].length; col++){
                if(tetromino.matrix[row][col]){
                    conText.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
                }
            }
        }
    }
}

// 키보드 이벤트를 처리하는 이벤트 리스너입니다.
document.addEventListener('keydown', function(e){
    if(gameOver) return;
    
    if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
        const col = e.key === 'ArrowLeft' ? tetromino.col - 1 : tetromino.col + 1;
        if(isValidMove(tetromino.matrix, tetromino.row, col)){
            tetromino.col = col;
        }
    }
    
    if(e.key === 'ArrowUp'){
        const matrix = rotate(tetromino.matrix);
        if(isValidMove(matrix, tetromino.row, tetromino.col)){
            tetromino.matrix = matrix;
        }
    }

    if(e.key === 'ArrowDown'){
        const row = tetromino.row + 1;
        if(!isValidMove(tetromino.matrix, row, tetromino.col)){
            tetromino.row = row - 1;
            placeTetromino();
            return;
        }
        tetromino.row = row;
    }
});

// 게임 루프를 시작합니다.
rAF = requestAnimationFrame(loop);
