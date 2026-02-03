import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Circle, RefreshCw } from "lucide-react";

export const TicTacToePuzzle = ({ onSolved }: { onSolved: () => void }) => {
    // 3x3 Grid
    // User = 'X', AI = 'O'
    // AI plays perfectly (Minimax) or Random?
    // Let's make AI decent but beatable, or maybe the goal is to Draw?
    // User wants "tricky but explainable".
    // Let's make it standard: Win to proceed.
    
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [status, setStatus] = useState<"PLAYING" | "WIN" | "LOSE" | "DRAW">("PLAYING");

    const checkWinner = (squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i: number) => {
        if (!isPlayerTurn || board[i] || status !== "PLAYING") return;
        
        const newBoard = [...board];
        newBoard[i] = "X";
        setBoard(newBoard);
        
        const winner = checkWinner(newBoard);
        if (winner === "X") {
            setStatus("WIN");
            setTimeout(onSolved, 1000);
            return;
        }
        
        if (!newBoard.includes(null)) {
            setStatus("DRAW");
            return;
        }

        setIsPlayerTurn(false);
    };

    // AI Turn
    useEffect(() => {
        if (!isPlayerTurn && status === "PLAYING") {
            const timer = setTimeout(() => {
                const available = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
                
                // Simple AI: Block or Win if possible, else Random
                // For now, just Random to ensure it's beatable for non-math students
                if (available.length > 0) {
                    const rand = Math.floor(Math.random() * available.length);
                    const move = available[rand];
                    
                    const newBoard = [...board];
                    newBoard[move] = "O";
                    setBoard(newBoard);
                    
                    const winner = checkWinner(newBoard);
                    if (winner === "O") {
                        setStatus("LOSE");
                    } else if (!newBoard.includes(null)) {
                        setStatus("DRAW");
                    } else {
                        setIsPlayerTurn(true);
                    }
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, status, board]);

    const reset = () => {
        setBoard(Array(9).fill(null));
        setStatus("PLAYING");
        setIsPlayerTurn(true);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-mono text-yellow-500 mb-2">ZERO_SUM_GAME</h2>
            <div className="text-xs text-slate-500 font-mono mb-8">
                OBJECTIVE: DEFEAT THE SYSTEM (X).<br/>
                STATUS: {status}
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-800 p-2 rounded border border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {board.map((cell, i) => (
                    <div 
                        key={i}
                        onClick={() => handleClick(i)}
                        className={`w-20 h-20 md:w-24 md:h-24 bg-black flex items-center justify-center text-4xl cursor-pointer hover:bg-slate-900 transition-colors
                            ${cell === "X" ? "text-cyan-500" : "text-red-500"}
                        `}
                    >
                        <AnimatePresence>
                            {cell && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                >
                                    {cell === "X" ? <X size={40} strokeWidth={2.5} /> : <Circle size={32} strokeWidth={3} />}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {(status === "LOSE" || status === "DRAW") && (
                <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={reset}
                    className="mt-8 px-6 py-2 bg-slate-800 border border-slate-600 text-slate-400 hover:text-white hover:border-white flex items-center gap-2 font-mono text-xs"
                >
                    <RefreshCw size={14} /> RETRY_CONNECTION
                </motion.button>
            )}
        </div>
    );
};
