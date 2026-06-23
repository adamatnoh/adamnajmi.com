import { useState, useEffect } from 'react';

// ============================================
// 1. WORD POOL
// ============================================
const WORDS = [
  'NAJMI',
  'JOHOR',
  'TOOLS',
  'MYSQL',
  'POWER',
  'REACT',
  'INTEL',
  'FLOWS',
  'TEAMS',
  'BUILT',
  'QUEUE',
  'DAILY',
  'YIELD',
  'GRADE',
  'USERS',
  'STACK',
  'STAKE',
  'RATES',
  'SWAPS',
  'CROSS',
  'VAULT',
  'LOWER',
  'BANKS',
  'ADMIN',
  'FUNDS',
  'EMAIL',
  'STAFF',
  'TOKEN',
  'AGENT',
  'FINAL',
];

// ============================================
// 2. REWARD IMAGE POOLS
// ============================================
const COMMON_IMAGES = [
  'common-grey.jpeg',
  'common-oyen.jpeg',
  'common-siam.jpeg',
  'common-tabby.jpeg',
  'common-calico.jpeg',
  'common-brown.jpeg',
];

const RARE_IMAGES = ['rare-rayyan.jpeg', 'rare-bengal.jpeg', 'rare-sphynx.jpeg'];

const SUPER_RARE_IMAGES = ['super-rare-oyo.jpeg'];

// ============================================
// 3. DAILY SECRET WORD (Deterministic)
// ============================================
const getDailySecret = () => {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % WORDS.length;
  return WORDS[index];
};

// ============================================
// 4. WORDLE LOGIC
// ============================================
const getLetterStatus = (guess, secret) => {
  const secretArr = secret.split('');
  const guessArr = guess.split('');
  const secretCopy = [...secretArr];
  const statuses = guessArr.map((letter, i) => {
    if (letter === secretArr[i]) {
      secretCopy[i] = null;
      return 'correct';
    }
    return null;
  });
  for (let i = 0; i < guessArr.length; i++) {
    if (statuses[i] === 'correct') continue;
    const letter = guessArr[i];
    const indexInSecret = secretCopy.indexOf(letter);
    if (indexInSecret !== -1) {
      statuses[i] = 'misplaced';
      secretCopy[indexInSecret] = null;
    } else {
      statuses[i] = 'absent';
    }
  }
  return statuses;
};

// ============================================
// 5. STREAK HELPERS
// ============================================
const getToday = () => new Date().toISOString().slice(0, 10);

const getStreak = () => {
  return parseInt(localStorage.getItem('cipherStreak') || '0', 10);
};

const updateStreakOnWin = () => {
  const today = getToday();
  const lastWinDate = localStorage.getItem('cipherLastWinDate');
  let currentStreak = getStreak();

  if (lastWinDate === today) {
    return currentStreak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (lastWinDate === yesterdayStr) {
    currentStreak += 1;
  } else {
    currentStreak = 1;
  }

  localStorage.setItem('cipherStreak', String(currentStreak));
  localStorage.setItem('cipherLastWinDate', today);
  return currentStreak;
};

const resetStreak = () => {
  localStorage.setItem('cipherStreak', '0');
  return 0;
};

// ============================================
// 6. GAME STATE HELPERS (localStorage)
// ============================================
const getSavedGameState = () => {
  try {
    const raw = localStorage.getItem('cipherGameState');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === getToday()) {
        return parsed;
      }
    }
  } catch {}
  return null;
};

const saveGameState = (state) => {
  localStorage.setItem(
    'cipherGameState',
    JSON.stringify({
      date: getToday(),
      ...state,
    }),
  );
};

const clearGameState = () => {
  localStorage.removeItem('cipherGameState');
};

// ============================================
// 7. TUTORIAL HELPERS
// ============================================
const hasSeenTutorial = () => {
  return localStorage.getItem('cipherTutorialSeen') === 'true';
};

const setTutorialSeen = () => {
  localStorage.setItem('cipherTutorialSeen', 'true');
};

// ============================================
// 8. REACT COMPONENT
// ============================================
const DailyCipher = () => {
  const SECRET = getDailySecret();
  const [isOpen, setIsOpen] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [reward, setReward] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [streak, setStreak] = useState(0);

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialChecked, setTutorialChecked] = useState(false);

  // Tooltip state & timers
  const [isCipherMounted, setIsCipherMounted] = useState(false);
  const [showCipherTooltip, setShowCipherTooltip] = useState(false);

  // ============================================
  // Load saved game state whenever the game opens
  // ============================================
  useEffect(() => {
    if (!isOpen) return;
    const saved = getSavedGameState();
    if (saved) {
      setAttempts(saved.attempts || []);
      setGameOver(saved.gameOver || false);
      setWon(saved.won || false);
      setReward(saved.reward || null);
      setShowRewardModal(false);
      setStreak(getStreak());
    } else {
      // No saved state for today – reset
      setAttempts([]);
      setGameOver(false);
      setWon(false);
      setReward(null);
      setShowRewardModal(false);
      clearGameState();
    }
  }, [isOpen]);

  // Tooltip timers
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsCipherMounted(true);
      requestAnimationFrame(() => {
        setShowCipherTooltip(true);
      });
    }, 10000);

    const hideTimer = setTimeout(() => {
      setShowCipherTooltip(false);
      setTimeout(() => setIsCipherMounted(false), 700);
    }, 20000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsCipherMounted(false);
      setShowCipherTooltip(false);
    }
  }, [isOpen]);

  // Load streak on mount
  useEffect(() => {
    setStreak(getStreak());
  }, []);

  // Expose guess function to window – with game state saving
  useEffect(() => {
    window.guessWord = (word) => {
      // If game is already over or won, ignore further guesses
      if (gameOver || won) return;

      const upperWord = word.toUpperCase();
      if (!WORDS.includes(upperWord)) return;

      const newAttempts = [...attempts, upperWord];
      setAttempts(newAttempts);

      // Check win
      if (upperWord === SECRET) {
        setWon(true);
        setGameOver(true);
        setShowRewardModal(true);

        const newStreak = updateStreakOnWin();
        setStreak(newStreak);

        const currentStreak = getStreak();
        let rarity, label, image;
        let roll = Math.random() * 100;

        let superRareThreshold = 1 + Math.min(currentStreak, 30);
        if (currentStreak >= 100) {
          superRareThreshold = 100;
        }

        if (roll < superRareThreshold) {
          rarity = 'super-rare';
          label = `🌟 Super Rare (${superRareThreshold >= 100 ? '100%' : superRareThreshold + '%'})`;
          const idx = Math.floor(Math.random() * SUPER_RARE_IMAGES.length);
          image = `/file/daily-cipher/${SUPER_RARE_IMAGES[idx]}`;
        } else if (roll < superRareThreshold + 10) {
          rarity = 'rare';
          label = '✨ Rare (10%)';
          const idx = Math.floor(Math.random() * RARE_IMAGES.length);
          image = `/file/daily-cipher/${RARE_IMAGES[idx]}`;
        } else {
          rarity = 'common';
          label = '🐱 Common';
          const idx = Math.floor(Math.random() * COMMON_IMAGES.length);
          image = `/file/daily-cipher/${COMMON_IMAGES[idx]}`;
        }

        const newReward = { rarity, label, image };
        setReward(newReward);

        // Save game state after win
        saveGameState({
          attempts: newAttempts,
          gameOver: true,
          won: true,
          reward: newReward,
        });

        return;
      }

      // Check loss (6 attempts used)
      if (newAttempts.length >= 6) {
        setGameOver(true);
        resetStreak();
        setStreak(0);

        // Save game state after loss
        saveGameState({
          attempts: newAttempts,
          gameOver: true,
          won: false,
          reward: null,
        });
      } else {
        // Save intermediate state (in-progress)
        saveGameState({
          attempts: newAttempts,
          gameOver: false,
          won: false,
          reward: null,
        });
      }
    };
    return () => {
      delete window.guessWord;
    };
  }, [attempts, gameOver, won, SECRET]);

  const renderGrid = () => {
    const rows = 6;
    const cols = SECRET.length;
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const guess = attempts[i] || '';
      const statuses = guess ? getLetterStatus(guess, SECRET) : [];
      const rowCells = [];
      for (let j = 0; j < cols; j++) {
        const letter = guess[j] || '';
        const status = statuses[j] || 'empty';
        let bg = 'bg-white/5 border-white/10';
        let text = 'text-white/30';
        if (status === 'correct') {
          bg = 'bg-green-500/40 border-green-500';
          text = 'text-white';
        } else if (status === 'misplaced') {
          bg = 'bg-yellow-500/40 border-yellow-500';
          text = 'text-white';
        } else if (status === 'absent' && letter) {
          bg = 'bg-white/5 border-white/20';
          text = 'text-white/40';
        } else if (letter) {
          bg = 'bg-white/10 border-white/20';
          text = 'text-white';
        }
        rowCells.push(
          <div
            key={j}
            className={`w-8 h-8 border rounded flex items-center justify-center font-mono text-sm font-bold ${bg} ${text}`}
          >
            {letter}
          </div>,
        );
      }
      grid.push(
        <div key={i} className="flex gap-1 justify-center mb-1">
          {rowCells}
        </div>,
      );
    }
    return grid;
  };

  // ============================================
  // 9. UI: TOGGLE BUTTON WITH TOOLTIP (Top Right)
  // ============================================
  if (!isOpen) {
    return (
      <>
        <div className="fixed top-4 right-4 z-40">
          {isCipherMounted && (
            <div
              className={`absolute top-full right-0 mt-3 bg-[#0a0a0a] border border-green-500/30 text-green-400 text-xs font-mono px-3 py-1.5 rounded shadow-lg whitespace-nowrap transition-all duration-700 ease-in-out ${showCipherTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            >
              🔍 Crack the daily cipher!
              <div className="absolute -top-1.5 right-4 w-2 h-2 bg-[#0a0a0a] border-t border-l border-green-500/30 rotate-45"></div>
            </div>
          )}

          <button
            onClick={() => {
              if (!hasSeenTutorial()) {
                setShowTutorial(true);
              } else {
                setIsOpen(true);
              }
            }}
            className="bg-[#0a0a0a] border border-green-500/30 text-green-400 px-4 py-2 rounded-lg shadow-2xl hover:border-green-400 hover:text-green-300 transition-all duration-200 font-mono text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="text-green-500">$</span> ./daily_cipher.sh
            </span>
          </button>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black/80">
            <div className="bg-[#0a0a0a] border border-green-500/30 rounded-lg p-6 max-w-md w-full font-mono shadow-2xl">
              <div className="flex items-center gap-2 border-b border-green-500/20 pb-3 mb-4">
                <div className="flex gap-1.5">
                  <div
                    onClick={() => setShowTutorial(false)}
                    className="w-3 h-3 rounded-full bg-red-500/80 hover:brightness-225 cursor-pointer"
                    aria-label="Close"
                  />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-green-400/60 text-[10px] sm:text-xs tracking-wider">
                  ┌─[tutorial]─[daily_cipher]
                </span>
              </div>

              <h3 className="text-green-400 text-lg font-bold mb-2">🔐 How to play</h3>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4 flex items-center justify-center">
                <img
                  src="/file/daily-cipher/tutorial.gif"
                  alt="Tutorial"
                  className="w-full rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '🎬 GIF tutorial here';
                  }}
                />
              </div>

              <div className="text-green-400/70 text-[11px] font-mono space-y-1 mb-4">
                <p>
                  <span className="text-green-500">$</span> Click on 5-letter words across the page.
                </p>
                <p>
                  <span className="text-green-500">$</span> 🟩 = correct spot, 🟨 = wrong spot, ⬜ =
                  not in word.
                </p>
                <p>
                  <span className="text-green-500">$</span> You have 6 attempts.
                </p>
                <p>
                  <span className="text-green-500">$</span> Win to earn cat rewards &amp; build your
                  🔥 streak!
                </p>
                <p className="font-bold italic">
                  <span className="text-green-500">&gt;</span> Remember: Only 5-LETTERS words can be
                  clicked.
                </p>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="tutorialNeverShow"
                  checked={tutorialChecked}
                  onChange={(e) => setTutorialChecked(e.target.checked)}
                  className="accent-green-500 w-4 h-4"
                />
                <label
                  htmlFor="tutorialNeverShow"
                  className="text-white/50 text-[10px] font-mono cursor-pointer"
                >
                  Don't show this again
                </label>
              </div>

              <button
                onClick={() => {
                  if (tutorialChecked) {
                    setTutorialSeen();
                  }
                  setShowTutorial(false);
                  setIsOpen(true);
                }}
                className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded hover:bg-green-500/30 transition font-mono text-sm w-full"
              >
                $ start_cipher
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ============================================
  // 10. UI: GAME WIDGET (Top Right)
  // ============================================
  return (
    <div className="fixed top-4 right-4 z-40 w-72">
      <div className="bg-[#0a0a0a] border border-green-500/30 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-green-500/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5 flex-shrink-0">
              <div
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:brightness-225 cursor-pointer"
                aria-label="Close"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-green-400/60 text-[10px] tracking-wider truncate">
              ┌─[adam@portfolio]─[~/cipher]
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {streak > 0 && (
              <span className="text-yellow-500/80 text-[10px] font-mono">🔥 {streak}</span>
            )}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="w-5 h-5 rounded-full border border-green-500/50 bg-black/60 text-green-400/60 hover:text-green-400 hover:border-green-400 text-[10px] font-mono flex items-center justify-center transition flex-shrink-0"
            >
              ?
            </button>
          </div>
        </div>

        {showHelp && (
          <div className="p-3 bg-black/60 border-b border-green-500/20 text-green-400/90 text-[10px] font-mono space-y-0.5">
            <p>
              <span className="text-green-500">$</span> Click 5-letter words on the page.
            </p>
            <p>
              <span className="text-green-500">$</span> 🟩 Correct spot, 🟨 Wrong spot, ⬜ Not in
              word.
            </p>
            <p>
              <span className="text-green-500">$</span> 6 attempts. Win a random 🐱!
            </p>
            <p className="text-white/30 text-[9px] mt-1">— refreshes daily —</p>
          </div>
        )}

        <div className="p-3">
          <div className="mb-3">{renderGrid()}</div>

          {gameOver && !won && (
            <div className="text-red-400/80 text-xs font-mono text-center border border-red-500/20 p-1 rounded">
              Game Over. The word was <span className="text-white font-bold">{SECRET}</span>
            </div>
          )}
          {won && (
            <div
              className="text-green-400 text-xs font-mono text-center border border-green-500/20 p-1 rounded cursor-pointer"
              onClick={() => {
                setShowRewardModal(true);
              }}
            >
              Claim your reward!
            </div>
          )}
        </div>
      </div>

      {/* Reward Modal – only shown when showRewardModal is true */}
      {reward && showRewardModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black/80">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-lg p-8 max-w-sm w-full text-center font-mono shadow-2xl">
            <div className="text-6xl mb-4">
              {reward.rarity === 'super-rare' && '🌟'}
              {reward.rarity === 'rare' && '✨'}
              {reward.rarity === 'common' && '🐱'}
            </div>
            <h3 className="text-green-400 text-xl font-bold mb-2">You cracked the code!</h3>
            <p className="text-white/60 text-sm mb-2">
              The word of the day is <span className="font-extrabold italic">{SECRET}</span>! Here
              is your reward
            </p>
            {streak > 0 && (
              <p className="text-yellow-500/80 text-xs font-mono mb-2">🔥 {streak}-day streak!</p>
            )}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 m-4 flex items-center">
              <img
                src={reward.image}
                alt="Reward cat"
                className="w-32 h-32 object-cover rounded-lg mx-auto border border-white/10"
                onError={(e) => {
                  e.target.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%230a0a0a" width="128" height="128"/%3E%3Ctext x="64" y="70" text-anchor="middle" font-size="40" fill="%23ffffff"%3E🐱%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <p className="text-cyan-400 text-xs font-mono mb-4">{reward.label}</p>
            <button
              onClick={() => {
                setShowRewardModal(false);
                setIsOpen(false);
              }}
              className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded hover:bg-green-500/30 transition font-mono text-sm"
            >
              $ continue_browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyCipher;
