"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Timer, Target, Trophy, ArrowLeft } from "lucide-react";

interface ActiveGameProps {
  gameId: string;
  onExit: () => void;
}

export const ActiveGame: React.FC<ActiveGameProps> = ({ gameId, onExit }) => {
  const { publicKey } = useWallet();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(25);
  const [gamePhase, setGamePhase] = useState<"selecting" | "revealing" | "completed">("selecting");
  const [player1Number, setPlayer1Number] = useState<number | null>(null);
  const [player2Number, setPlayer2Number] = useState<number | null>(null);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (gamePhase === "selecting" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setGamePhase("revealing");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gamePhase, timeRemaining]);

  const handleNumberSelect = (num: number) => {
    if (gamePhase === "selecting") {
      setSelectedNumber(num);
    }
  };

  const handleConfirmSelection = async () => {
    if (!selectedNumber || !publicKey) return;

    try {
      console.log("Confirming selection:", selectedNumber);
      
      setPlayer1Number(selectedNumber);
      const mockPlayer2 = Math.floor(Math.random() * 100) + 1;
      const mockTarget = Math.floor(Math.random() * 100) + 1;
      
      setTimeout(() => {
        setPlayer2Number(mockPlayer2);
        setTargetNumber(mockTarget);
        
        const p1Distance = Math.abs(selectedNumber - mockTarget);
        const p2Distance = Math.abs(mockPlayer2 - mockTarget);
        
        if (p1Distance < p2Distance) {
          setWinner("You");
        } else if (p2Distance < p1Distance) {
          setWinner("Player 2");
        } else {
          setWinner("Tie");
        }
        
        setGamePhase("completed");
      }, 2000);
      
      setGamePhase("revealing");
    } catch (error) {
      console.error("Error confirming selection:", error);
      alert("Failed to confirm selection");
    }
  };

  const renderNumberGrid = () => {
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-10 gap-2">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleNumberSelect(num)}
            disabled={gamePhase !== "selecting"}
            className={`aspect-square font-semibold transition-all border-2 ${
              selectedNumber === num
                ? "bg-green-900 text-green-400 scale-110 border-green-500 terminal-glow"
                : "bg-black text-green-600 hover:bg-green-950 hover:text-green-400 hover:scale-105 border-green-800"
            } ${gamePhase !== "selecting" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onExit}
        className="flex items-center gap-2 text-green-500 hover:text-green-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        &gt; RETURN_TO_LOBBY
      </button>

      <div className="terminal-border bg-black p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-green-500 terminal-glow">&gt; DUEL_SESSION #{gameId}</h2>
          
          {gamePhase === "selecting" && (
            <div className="flex items-center gap-3 bg-green-950/30 px-6 py-3 border-2 border-green-700">
              <Timer className="w-6 h-6 text-green-400 terminal-flicker" />
              <span className="text-2xl font-bold text-green-400">
                {timeRemaining}s
              </span>
            </div>
          )}
        </div>

        {gamePhase === "selecting" && (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-500" />
                &gt; SELECT_NUMBER [1-100]
              </h3>
              {selectedNumber && (
                <div className="bg-green-950/20 border-2 border-green-700 p-4 mb-4">
                  <p className="text-green-400 text-center">
                    &gt; SELECTED: <span className="text-3xl font-bold text-green-500 terminal-glow">{selectedNumber}</span>
                  </p>
                </div>
              )}
            </div>

            {renderNumberGrid()}

            <button
              onClick={handleConfirmSelection}
              disabled={!selectedNumber}
              className={`w-full mt-6 py-4 font-bold text-lg transition-all border-2 ${
                selectedNumber
                  ? "bg-green-900 hover:bg-green-800 text-green-400 border-green-500"
                  : "bg-black text-green-800 border-green-900 cursor-not-allowed"
              }`}
            >
              &gt; CONFIRM_SELECTION &amp; TRANSFER_FEE
            </button>
          </>
        )}

        {gamePhase === "revealing" && (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <Target className="w-20 h-20 text-green-500 mx-auto mb-4 terminal-flicker" />
              <h3 className="text-2xl font-bold text-green-400 mb-2">
                &gt; PROCESSING_RESULTS...
              </h3>
              <p className="text-green-600">
                &gt; CALCULATING_WINNER<br/>
                &gt; DISTRIBUTING_PRIZES
              </p>
            </div>
          </div>
        )}

        {gamePhase === "completed" && targetNumber !== null && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Trophy className={`w-20 h-20 mx-auto mb-4 terminal-flicker ${
                winner === "You" ? "text-green-500" : "text-green-800"
              }`} />
              <h3 className="text-3xl font-bold text-green-400 mb-2 terminal-glow">
                {winner === "You" ? "&gt; VICTORY_ACHIEVED" : winner === "Tie" ? "&gt; TIE_DETECTED" : "&gt; DEFEAT"}
              </h3>
              {winner === "You" && (
                <p className="text-green-500 text-xl font-semibold">
                  &gt; PRIZE_TRANSFERRED_TO_WALLET
                </p>
              )}
            </div>

            <div className="bg-green-950/20 border-2 border-green-700 p-6 space-y-4">
              <div className="text-center pb-4 border-b-2 border-green-800">
                <p className="text-green-600 mb-2">&gt; TARGET_NUMBER</p>
                <p className="text-5xl font-bold text-green-500 terminal-glow">{targetNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`bg-green-950/30 border-2 p-4 ${
                  winner === "You" ? "border-green-500" : "border-green-800"
                }`}>
                  <p className="text-green-600 text-sm mb-2">&gt; YOUR_NUMBER</p>
                  <p className="text-3xl font-bold text-green-400">{player1Number}</p>
                  <p className="text-green-600 text-sm mt-2">
                    &gt; DISTANCE: {player1Number ? Math.abs(player1Number - targetNumber) : 0}
                  </p>
                </div>

                <div className={`bg-green-950/30 border-2 p-4 ${
                  winner === "Player 2" ? "border-green-500" : "border-green-800"
                }`}>
                  <p className="text-green-600 text-sm mb-2">&gt; OPPONENT_NUMBER</p>
                  <p className="text-3xl font-bold text-green-400">{player2Number}</p>
                  <p className="text-green-600 text-sm mt-2">
                    &gt; DISTANCE: {player2Number ? Math.abs(player2Number - targetNumber) : 0}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onExit}
              className="w-full bg-green-900 hover:bg-green-800 text-green-400 font-semibold py-4 border-2 border-green-500 transition-colors"
            >
              &gt; EXIT_SESSION
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
