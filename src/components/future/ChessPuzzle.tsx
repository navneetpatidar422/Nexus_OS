import React, { useState } from "react";
import { motion } from "motion/react";

// Simple Chess Board Representation
// White to move. Mate in 1.
// Position: White Queen on h6, White Knight on g5. Black King on h8, Black Pawn on h7, g7.
// Actually let's do a classic "Scholar's Mate" style or simple back rank.
// Let's do: White Rook e1, White King g1. Black King e8. Back rank mate?
// Let's do a puzzle: White Queen f7, Black King h8. Knight g5.
// If Qh7+, Kxh7.
// Let's use a famous one: "Philidor's Defense" smothered mate? Too complex to render.
// Simple: White Rook on a8, Black King on h8. (Too easy).
// Let's do: K: e1, R: h1. Bk: a8.
//
// Let's go with:
// White: King h1, Rook g1, Pawn h2, g2.
// Black: King h8, Rook a8...
//
// Actually, let's just make it abstract "Tactical Grid" where users have to click the right coordinate?
// No, the user said "enter the final position of best move". So typing "Qg7" or "h8".
//
// Puzzle: "Anastasia's Mate" simplified.
// White Ne7 check. Kh8. White Qxh7+ Kxh7. Rh1#
// That's 3 moves.
//
// Let's stick to Mate in 1.
// White Queen on f6. White Knight on h6. Black King on h8. Black Pawn on g7.
// Move: Qg7# is supported by Knight? No g7 is guarded by King?
// Wait, Knight on h6 guards g8 and f7.
// Queen on f6.
// If Qg7, Kxg7.
//
// Let's do:
// White Queen d8. Black King f7.
// Move: Qd7+?
//
// Simplest visual puzzle:
// White Queen at h5.
// Black King at e8.
// Pawn at f7.
// This is getting complicated to design blindly.
//
// Let's do a specific well-known pattern: "Back Rank Mate"
// Black King at g8. Black Pawns at f7, g7, h7.
// White Rook at d1.
// Move: Rd8#
//
// Board Layout:
// 8 [ ][ ][ ][ ][ ][ ][ ][ ]
// 7 [ ][ ][ ][ ][ ][ ][ ][ ]
// ...
// 1 [ ][ ][R][ ][ ][ ][ ][ ]
// ...
// 8 [ ][ ][ ][ ][ ][R][K][ ] (Black)
//
// Let's just render a board with pieces.
// PIECES:
// P = White Pawn, R = White Rook, N = White Knight, B = White Bishop, Q = White Queen, K = White King
// p = Black Pawn, ... k = Black King

// Puzzle:
// White: Rook at d1.
// Black: King at g8, Pawns at f7, g7, h7.
// Target: d8 (Rd8#)
// Answer: "Rd8" or "d8" or "RD8".

const BOARD_LAYOUT = [
    [null, null, null, "r", null, "r", "k", null], // 8
    ["p", "p", "p", null, null, "p", "p", "p"], // 7
    [null, null, null, null, null, null, null, null], // 6
    [null, null, null, "q", null, null, null, null], // 5
    [null, null, null, null, null, null, null, null], // 4
    [null, null, null, null, null, "N", null, null], // 3
    ["P", "P", "P", null, null, "P", "P", "P"], // 2
    [null, null, null, "Q", null, "R", "K", null], // 1
    // a   b   c   d   e   f   g   h
];
// Wait that board is messy.

// Let's try a smaller simplified 4x4 or 5x5 tactical board?
// No, standard chess is 8x8.
// Let's use a very sparse board.
//
// Puzzle:
// White Queen (Q) at a1.
// Black King (k) at h8.
// White Bishop (B) at c3 (Diagonal to h8?)
// No, let's just do the Back Rank Mate.
// White Rook (R) at c1.
// Black King (k) at g8.
// Black Pawns (p) at f7, g7, h7.
// Move R to c8 is mate.
// Answer: Rc8.

const START_BOARD = [
    [null, null, null, null, null, "r", "k", null], // 8
    [null, null, null, null, null, "p", "p", "p"], // 7
    [null, null, null, null, null, null, null, null], // 6
    [null, null, null, null, null, null, null, null], // 5
    [null, null, null, null, null, null, null, null], // 4
    [null, null, null, null, null, null, null, null], // 3
    [null, null, null, null, null, null, null, null], // 2
    [null, null, "R", null, null, null, null, null], // 1
    // a     b     c     d     e     f     g     h
];

export const ChessPuzzle = ({ onSolved }: { onSolved: () => void }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = input.toUpperCase().replace("#", "").replace("+", "").trim();
    if (clean === "RC8" || clean === "C8") {
        onSolved();
    } else {
        setError(true);
        setTimeout(() => setError(false), 500);
        setInput("");
    }
  };

  const getPiece = (char: string | null) => {
      if (!char) return null;
      const pieces: Record<string, string> = {
          'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
          'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟'
      };
      return pieces[char] || char;
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center py-4">
        <h2 className="text-xl font-mono text-cyan-500 mb-2 animate-pulse">TACTICAL_COPROCESSOR</h2>
        <div className="text-xs text-slate-400 mb-4 text-center font-mono">
            OBJECTIVE: EXECUTE LETHAL SEQUENCE.<br/>
            TARGET: WHITE TO MOVE. MATE IN 1.
        </div>
        
        <div className="grid grid-cols-8 gap-0 border-4 border-slate-700 bg-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {START_BOARD.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                    const isBlack = (rowIndex + colIndex) % 2 === 1;
                    return (
                        <div 
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xl md:text-2xl select-none
                                ${isBlack ? 'bg-slate-900' : 'bg-slate-600'}
                                ${cell && 'cursor-help'}
                            `}
                            title={`${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`}
                        >
                            <span className={cell && cell === cell.toUpperCase() ? "text-cyan-100 drop-shadow-[0_0_5px_cyan]" : "text-red-400 drop-shadow-[0_0_5px_red]"}>
                                {getPiece(cell)}
                            </span>
                        </div>
                    );
                })
            ))}
        </div>
        
        <div className="flex justify-between w-full max-w-[384px] text-[10px] text-slate-500 font-mono mt-1 px-2">
            <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex gap-4">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ENTER MOVE (e.g. e4)"
                className="bg-black border border-green-500/50 text-green-500 font-mono px-4 py-2 outline-none focus:border-green-500 w-48 uppercase placeholder:text-green-900"
                autoFocus
            />
            <button type="submit" className="bg-green-900/20 border border-green-500 text-green-500 px-4 py-2 hover:bg-green-500 hover:text-black transition-colors font-mono text-xs">
                EXECUTE
            </button>
        </form>
        {error && <div className="text-red-500 font-mono text-xs mt-2">INVALID_VECTOR. RETRY.</div>}
    </div>
  );
};
