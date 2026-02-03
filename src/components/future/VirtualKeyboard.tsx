import React from "react";

export const VirtualKeyboard = () => {
    const ROWS = [
        ["ESC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "BACK"],
        ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"],
        ["CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "ENTER"],
        ["SHIFT", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "SHIFT"],
        ["SPACE"]
    ];

    return (
        <div className="w-full flex flex-col gap-1 items-center opacity-50 pointer-events-none select-none scale-[0.6] md:scale-75 origin-bottom">
            {ROWS.map((row, i) => (
                <div key={i} className="flex gap-1">
                    {row.map((key, j) => (
                        <div 
                            key={j} 
                            className={`
                                border border-green-900/30 text-[10px] text-green-700 font-mono flex items-center justify-center rounded
                                ${key === "SPACE" ? "w-64 h-8" : "w-10 h-10"}
                                ${["SHIFT", "ENTER", "CAPS", "BACK", "TAB"].includes(key) ? "w-16" : ""}
                            `}
                        >
                            {key === "SPACE" ? "" : key}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
