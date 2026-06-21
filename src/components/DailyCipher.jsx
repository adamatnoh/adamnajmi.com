import { useState, useEffect } from "react";

// ============================================
// 1. EXPANDED WORD POOL
// ============================================
const WORDS = [
  "NAJMI",
  "JOHOR",
  "MYSQL",
  "POWER",
  "REACT",
  "INTEL",
  "RAPID",
  "BUILT",
  "QUEUE",
  "DAILY",
  "YIELD",
  "REACT",
  "INTEL",
  "GRADE",
  "USERS",
  "STACK",
  "STAKE",
  "YIELD",
  "RATES",
  "SWAPS",
  "CROSS",
  "VAULT",
  "LOWER",
  "BANKS",
  "FINAL",
];

// ============================================
// 2. DAILY SECRET WORD (Deterministic)
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
// 3. WORDLE LOGIC
// ============================================
const getLetterStatus = (guess, secret) => {
  const result = [];
  const secretArr = secret.split("");
  const guessArr = guess.split("");

  const secretCopy = [...secretArr];
  const statuses = guessArr.map((letter, i) => {
    if (letter === secretArr[i]) {
      secretCopy[i] = null;
      return "correct";
    }
    return null;
  });

  for (let i = 0; i < guessArr.length; i++) {
    if (statuses[i] === "correct") continue;
    const letter = guessArr[i];
    const indexInSecret = secretCopy.indexOf(letter);
    if (indexInSecret !== -1) {
      statuses[i] = "misplaced";
      secretCopy[indexInSecret] = null;
    } else {
      statuses[i] = "absent";
    }
  }
  return statuses;
};

// ============================================
// 4. THE REACT COMPONENT
// ============================================
const WordHunt = () => {
  const SECRET = getDailySecret();
  const [isOpen, setIsOpen] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [reward, setReward] = useState(null);

  // Expose guess function to window
  useEffect(() => {
    window.guessWord = (word) => {
      if (gameOver || won) return;
      const upperWord = word.toUpperCase();
      if (!WORDS.includes(upperWord)) return;

      const newAttempts = [...attempts, upperWord];
      setAttempts(newAttempts);

      if (upperWord === SECRET) {
        setWon(true);
        setGameOver(true);
        const roll = Math.random() * 100;
        let rarity, label;
        if (roll < 1) {
          rarity = "super-rare";
          label = "🌟 Super Rare (1%)";
        } else if (roll < 11) {
          rarity = "rare";
          label = "✨ Rare (10%)";
        } else {
          rarity = "common";
          label = "🐱 Common";
        }
        setReward({ rarity, label, image: `/file/cat-${rarity}.png` });
      } else if (newAttempts.length >= 6) {
        setGameOver(true);
      }
    };
    return () => {
      delete window.guessWord;
    };
  }, [attempts, gameOver, won, SECRET]);

  const resetGame = () => {
    setAttempts([]);
    setGameOver(false);
    setWon(false);
    setReward(null);
  };

  const renderGrid = () => {
    const rows = 6;
    const cols = SECRET.length;
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const guess = attempts[i] || "";
      const statuses = guess ? getLetterStatus(guess, SECRET) : [];
      const rowCells = [];
      for (let j = 0; j < cols; j++) {
        const letter = guess[j] || "";
        const status = statuses[j] || "empty";
        let bg = "bg-white/5 border-white/10";
        let text = "text-white/30";
        if (status === "correct") {
          bg = "bg-green-500/40 border-green-500";
          text = "text-white";
        } else if (status === "misplaced") {
          bg = "bg-yellow-500/40 border-yellow-500";
          text = "text-white";
        } else if (status === "absent" && letter) {
          bg = "bg-white/5 border-white/20";
          text = "text-white/40";
        } else if (letter) {
          bg = "bg-white/10 border-white/20";
          text = "text-white";
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
  // 5. UI: TOGGLE BUTTON (Top Right)
  // ============================================
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 bg-[#0a0a0a] border border-green-500/30 text-green-400 px-4 py-2 rounded-lg shadow-2xl hover:border-green-400 hover:text-green-300 transition-all duration-200 font-mono text-xs"
      >
        <span className="flex items-center gap-2">
          <span className="text-green-500">$</span> ./daily_cipher.sh
        </span>
      </button>
    );
  }

  // ============================================
  // 6. UI: GAME WIDGET (Top Right, dropdown)
  // ============================================
  return (
    <div className="fixed top-4 right-4 z-40 w-72">
      <div className="bg-[#0a0a0a] border border-green-500/30 rounded-lg shadow-2xl overflow-hidden">
        {/* Terminal Header – matches Chatbot style */}
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
            <span className="text-green-400/60 text-[10px] sm:text-xs tracking-wider truncate">
              ┌─[adam@portfolio]─[~/daily_cipher]
            </span>
          </div>
        </div>

        {/* Game Content */}
        <div className="p-3">
          {/* Grid */}
          <div className="mb-3">{renderGrid()}</div>

          {/* Game Status */}
          {gameOver && !won && (
            <div className="text-red-400/80 text-xs font-mono text-center border border-red-500/20 p-1 rounded">
              ❌ Game Over. The word was{" "}
              <span className="text-white font-bold">{SECRET}</span>
            </div>
          )}
          {won && (
            <div
              className="text-green-400 text-xs font-mono text-center border border-green-500/20 p-1 rounded cursor-pointer"
              onClick={() => setReward({ ...reward, show: true })}
            >
              ✅ Click to claim your reward!
            </div>
          )}

          {/* Reset (hidden for production, kept for testing) */}
          {gameOver && (
            <button
              onClick={resetGame}
              className="mt-2 text-white/20 hover:text-white/60 text-[10px] font-mono w-full text-center border-t border-white/5 pt-2"
            >
              $ reset
            </button>
          )}
        </div>
      </div>

      {/* 🏆 REWARD MODAL */}
      {reward && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black/80">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-lg p-8 max-w-sm w-full text-center font-mono shadow-2xl">
            <div className="text-6xl mb-4">
              {reward.rarity === "super-rare" && "🌟"}
              {reward.rarity === "rare" && "✨"}
              {reward.rarity === "common" && "🐱"}
            </div>
            <h3 className="text-green-400 text-xl font-bold mb-2">
              You cracked the code!
            </h3>
            <p className="text-white/60 text-sm mb-2">
              You found the word of the day!
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
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
            <p className="text-cyan-400 text-xs font-mono mb-4">
              {reward.label}
            </p>
            <button
              onClick={() => {
                setReward(null);
                resetGame();
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

export default WordHunt;
