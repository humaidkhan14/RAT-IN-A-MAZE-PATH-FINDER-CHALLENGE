/* ══════════════════════════════════════════
   RAT IN A MAZE — QUIZ LOGIC
   ══════════════════════════════════════════ */

// ── MAZE QUESTION BANK ─────────────────────────────────────────────────────
// Each question: { maze: 2D array (1=open, 0=blocked), answer: int, label: string }
// 0 = blocked cell, 1 = open cell
// Rat moves: Right or Down only (standard backtracking problem)

const QUESTIONS = {
  easy: [
    {
      maze: [
        [1, 1],
        [1, 1]
      ],
      answer: 2,
      label: "2×2 fully open grid"
    },
    {
      maze: [
        [1, 0],
        [1, 1]
      ],
      answer: 1,
      label: "2×2 with one block"
    },
    {
      maze: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 1]
      ],
      answer: 1,
      label: "3×3 narrow corridor"
    },
    {
      maze: [
        [1, 1, 1],
        [1, 1, 1],
        [0, 0, 1]
      ],
      answer: 3,
      label: "3×3 with bottom blocks"
    },
    {
      maze: [
        [1, 1, 0],
        [1, 1, 1],
        [0, 1, 1]
      ],
      answer: 2,
      label: "3×3 mixed open"
    }
  ],

  medium: [
    {
      maze: [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 1]
      ],
      answer: 1,
      label: "4×4 single winding path"
    },
    {
      maze: [
        [1, 1, 1, 1],
        [0, 1, 0, 1],
        [0, 1, 1, 1],
        [0, 0, 0, 1]
      ],
      answer: 2,
      label: "4×4 two routes"
    },
    {
      maze: [
        [1, 1, 0],
        [1, 1, 1],
        [1, 1, 1]
      ],
      answer: 4,
      label: "3×3 multiple paths"
    },
    {
      maze: [
        [1, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 1]
      ],
      answer: 1,
      label: "4×4 forced path"
    },
    {
      maze: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
      ],
      answer: 2,
      label: "3×3 centre blocked"
    }
  ],

  hard: [
    {
      maze: [
        [1, 1, 1, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 1],
        [0, 1, 1, 1]
      ],
      answer: 3,
      label: "4×4 complex maze"
    },
    {
      maze: [
        [1, 1, 1, 1, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 1, 1, 1],
        [1, 1, 0, 0, 1],
        [0, 1, 1, 1, 1]
      ],
      answer: 3,
      label: "5×5 advanced maze"
    },
    {
      maze: [
        [1, 1, 0, 0, 1],
        [1, 1, 1, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 1, 0, 1],
        [0, 0, 1, 1, 1]
      ],
      answer: 4,
      label: "5×5 branching paths"
    },
    {
      maze: [
        [1, 1, 1, 1],
        [1, 1, 0, 1],
        [0, 1, 1, 1],
        [0, 0, 1, 1]
      ],
      answer: 5,
      label: "4×4 open network"
    },
    {
      maze: [
        [1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1],
        [0, 0, 1, 1, 1],
        [0, 1, 1, 0, 1],
        [0, 1, 1, 1, 1]
      ],
      answer: 5,
      label: "5×5 many branches"
    }
  ]
};

// ── PATH COUNTING (Backtracking) ────────────────────────────────────────────
function countPaths(maze) {
  const rows = maze.length;
  const cols = maze[0].length;
  if (!maze[0][0] || !maze[rows-1][cols-1]) return 0;

  let count = 0;
  function dfs(r, c) {
    if (r === rows - 1 && c === cols - 1) { count++; return; }
    // Move Right
    if (c + 1 < cols && maze[r][c + 1] === 1) dfs(r, c + 1);
    // Move Down
    if (r + 1 < rows && maze[r + 1][c] === 1) dfs(r + 1, c);
  }
  dfs(0, 0);
  return count;
}

// ── WRONG OPTION GENERATION ─────────────────────────────────────────────────
function generateOptions(correct) {
  const opts = new Set([correct]);
  const candidates = [];
  for (let d = 1; d <= 4; d++) {
    if (correct - d >= 0) candidates.push(correct - d);
    candidates.push(correct + d);
  }
  // shuffle candidates
  candidates.sort(() => Math.random() - 0.5);
  for (const c of candidates) {
    if (opts.size === 3) break;
    opts.add(c);
  }
  return [...opts].sort((a, b) => a - b);
}

// ── MINI-GRID ANIMATION (Menu) ──────────────────────────────────────────────
function animateMiniGrid() {
  const grid = document.getElementById('mini-grid');
  const size = 5;
  const maze = [
    [1,1,0,1,1],
    [1,1,1,1,0],
    [0,1,0,1,1],
    [1,1,1,0,1],
    [0,0,1,1,1]
  ];
  grid.style.gridTemplateColumns = `repeat(${size}, 18px)`;
  grid.innerHTML = '';
  maze.forEach((row, r) => row.forEach((cell, c) => {
    const div = document.createElement('div');
    div.classList.add('mini-cell', cell ? 'open' : 'blocked');
    if (r === 0 && c === 0) div.classList.add('rat-start');
    if (r === size-1 && c === size-1) div.classList.add('rat-end');
    div.dataset.r = r; div.dataset.c = c;
    grid.appendChild(div);
  }));

  // animate a path
  const path = [[0,0],[0,1],[1,1],[1,2],[1,3],[2,3],[3,3],[3,2],[4,2],[4,3],[4,4]];
  let i = 0;
  function step() {
    if (i >= path.length) { setTimeout(reset, 1200); return; }
    const [r,c] = path[i++];
    const cell = grid.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    if (cell) cell.classList.add('path');
    setTimeout(step, 180);
  }
  function reset() {
    grid.querySelectorAll('.path').forEach(el => {
      el.classList.remove('path');
    });
    i = 0;
    setTimeout(step, 600);
  }
  step();
}

// ── APP STATE ───────────────────────────────────────────────────────────────
const state = {
  level: null,
  questions: [],
  currentQ: 0,
  score: 0,
  selectedOption: null,
  submitted: false,
  results: []   // [{correct: bool, label: str}]
};

// ── DOM REFS ────────────────────────────────────────────────────────────────
const screens = {
  menu:   document.getElementById('screen-menu'),
  quiz:   document.getElementById('screen-quiz'),
  result: document.getElementById('screen-result')
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo(0, 0);
}

// ── MENU SETUP ──────────────────────────────────────────────────────────────
animateMiniGrid();

document.querySelectorAll('.level-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.level = card.dataset.level;
    document.getElementById('btn-start').disabled = false;
    document.querySelector('.hint-text').style.display = 'none';
  });
});

document.getElementById('btn-start').addEventListener('click', startGame);

// ── START GAME ──────────────────────────────────────────────────────────────
function startGame() {
  // shuffle + take 5
  const pool = [...QUESTIONS[state.level]].sort(() => Math.random() - 0.5);
  state.questions = pool.slice(0, 5);
  state.currentQ = 0;
  state.score = 0;
  state.results = [];
  showScreen('quiz');
  loadQuestion();
}

// ── LOAD QUESTION ───────────────────────────────────────────────────────────
function loadQuestion() {
  const q = state.questions[state.currentQ];
  state.selectedOption = null;
  state.submitted = false;

  // HUD
  document.getElementById('hud-level').textContent = state.level.toUpperCase();
  document.getElementById('hud-q').textContent     = state.currentQ + 1;
  document.getElementById('hud-score').textContent = state.score;

  // Progress bar
  document.getElementById('progress-bar').style.width =
    `${(state.currentQ / 5) * 100}%`;

  // Question text
  const rows = q.maze.length, cols = q.maze[0].length;
  document.getElementById('q-text').textContent =
    `How many paths exist from Start (top-left) to End (bottom-right) in this ${rows}×${cols} maze? (Moving only RIGHT or DOWN)`;

  // Render maze
  renderMaze(q.maze);

  // Options
  const correct = q.answer;
  const opts = generateOptions(correct);
  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  opts.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = val;
    btn.addEventListener('click', () => selectOption(btn, val));
    grid.appendChild(btn);
  });

  // Feedback
  const fb = document.getElementById('feedback-box');
  fb.className = 'feedback-box hidden';

  // Buttons
  document.getElementById('btn-submit').disabled = true;
  document.getElementById('btn-submit').classList.remove('hidden');
  document.getElementById('btn-next').classList.add('hidden');
}

// ── RENDER MAZE ─────────────────────────────────────────────────────────────
function renderMaze(maze) {
  const rows = maze.length, cols = maze[0].length;
  const display = document.getElementById('maze-display');
  display.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  display.innerHTML = '';

  maze.forEach((row, r) => {
    row.forEach((cell, c) => {
      const div = document.createElement('div');
      div.classList.add('cell');
      if (r === 0 && c === 0) {
        div.classList.add('start');
        div.textContent = '🐀';
      } else if (r === rows - 1 && c === cols - 1) {
        div.classList.add('end');
        div.textContent = '🧀';
      } else if (cell === 0) {
        div.classList.add('blocked');
        div.textContent = '✖';
      } else {
        div.classList.add('open');
      }
      display.appendChild(div);
    });
  });
}

// ── SELECT OPTION ───────────────────────────────────────────────────────────
function selectOption(btn, val) {
  if (state.submitted) return;
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.selectedOption = val;
  document.getElementById('btn-submit').disabled = false;
}

// ── SUBMIT ───────────────────────────────────────────────────────────────────
document.getElementById('btn-submit').addEventListener('click', () => {
  if (state.selectedOption === null || state.submitted) return;
  state.submitted = true;

  const q = state.questions[state.currentQ];
  const correct = q.answer;
  const isCorrect = state.selectedOption === correct;

  if (isCorrect) state.score++;

  // Colour options
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
    const v = parseInt(btn.textContent);
    if (v === correct) btn.classList.add('correct');
    else if (v === state.selectedOption && !isCorrect) btn.classList.add('wrong');
  });

  // Feedback
  const fb = document.getElementById('feedback-box');
  const fbIcon = document.getElementById('fb-icon');
  const fbText = document.getElementById('fb-text');

  if (isCorrect) {
    fb.className = 'feedback-box correct';
    fbIcon.textContent = '✔';
    fbText.textContent = `Correct! There ${correct === 1 ? 'is' : 'are'} ${correct} valid path${correct !== 1 ? 's' : ''} through this maze.`;
    animatePaths(q.maze);
  } else {
    fb.className = 'feedback-box wrong';
    fbIcon.textContent = '✖';
    fbText.textContent = `Wrong! You chose ${state.selectedOption}, but the correct answer is ${correct}. Keep practising!`;
  }

  // Store result
  state.results.push({ correct: isCorrect, label: q.label, answer: correct, chosen: state.selectedOption });

  // Update HUD score
  document.getElementById('hud-score').textContent = state.score;

  // Buttons
  document.getElementById('btn-submit').classList.add('hidden');
  document.getElementById('btn-next').classList.remove('hidden');
  const isLast = state.currentQ === 4;
  document.getElementById('btn-next').textContent = isLast ? 'SEE RESULTS ▶' : 'NEXT ▶';
});

// ── ANIMATE PATHS ON CORRECT ─────────────────────────────────────────────────
function animatePaths(maze) {
  const rows = maze.length, cols = maze[0].length;
  // Collect all paths
  const allPaths = [];
  function dfs(r, c, path) {
    if (r === rows-1 && c === cols-1) { allPaths.push([...path]); return; }
    if (c+1 < cols && maze[r][c+1]) dfs(r, c+1, [...path, [r,c+1]]);
    if (r+1 < rows && maze[r+1][c]) dfs(r+1, c, [...path, [r+1,c]]);
  }
  dfs(0, 0, [[0,0]]);

  const display = document.getElementById('maze-display');
  const getCellEl = (r,c) => display.children[r * cols + c];

  allPaths.forEach((path, pi) => {
    path.forEach((pos, si) => {
      const [r,c] = pos;
      if (r === 0 && c === 0) return; // keep start icon
      if (r === rows-1 && c === cols-1) return; // keep end icon
      setTimeout(() => {
        const el = getCellEl(r,c);
        if (el) el.classList.add('path-flash');
      }, pi * 400 + si * 80);
    });
  });
}

// ── NEXT / FINISH ────────────────────────────────────────────────────────────
document.getElementById('btn-next').addEventListener('click', () => {
  state.currentQ++;
  if (state.currentQ >= 5) {
    showResults();
  } else {
    loadQuestion();
  }
});

// ── BACK TO MENU ─────────────────────────────────────────────────────────────
document.getElementById('btn-back').addEventListener('click', () => {
  if (confirm('Return to main menu? Your progress will be lost.')) {
    resetMenu();
    showScreen('menu');
  }
});

// ── SHOW RESULTS ─────────────────────────────────────────────────────────────
function showResults() {
  // Update progress bar to 100%
  document.getElementById('progress-bar').style.width = '100%';

  showScreen('result');

  const score = state.score;
  document.getElementById('result-score').textContent = score;

  // Trophy & title
  let trophy, title, msg;
  if (score === 5) {
    trophy = '🏆'; title = 'PERFECT!';
    msg = 'You aced every maze! You have mastered the Rat in a Maze backtracking algorithm.';
  } else if (score >= 3) {
    trophy = '🥈'; title = 'WELL DONE!';
    msg = 'Solid performance! A few more practice sessions and you\'ll be a maze master.';
  } else {
    trophy = '💡'; title = 'KEEP TRYING!';
    msg = 'The maze is tricky! Review how the backtracking algorithm counts paths and try again.';
  }
  document.getElementById('result-trophy').textContent = trophy;
  document.getElementById('result-title').textContent  = title;
  document.getElementById('result-msg').textContent    = msg;

  // Breakdown
  const bd = document.getElementById('result-breakdown');
  bd.innerHTML = '';
  state.results.forEach((r, i) => {
    const row = document.createElement('div');
    row.className = `breakdown-row ${r.correct ? 'correct' : 'wrong'}`;
    row.innerHTML = `
      <span class="bd-icon">${r.correct ? '✔' : '✖'}</span>
      <span class="bd-q">Q${i+1}: ${r.label}</span>
      <span style="font-size:0.7rem;color:var(--gray)">
        ${r.correct ? `Ans: ${r.answer}` : `You: ${r.chosen} | Ans: ${r.answer}`}
      </span>
    `;
    bd.appendChild(row);
  });
}

// ── REPLAY ───────────────────────────────────────────────────────────────────
document.getElementById('btn-replay').addEventListener('click', () => {
  startGame();
});

// ── MENU FROM RESULT ─────────────────────────────────────────────────────────
document.getElementById('btn-menu-from-result').addEventListener('click', () => {
  resetMenu();
  showScreen('menu');
});

function resetMenu() {
  state.level = null;
  document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('btn-start').disabled = true;
  document.querySelector('.hint-text').style.display = '';
}