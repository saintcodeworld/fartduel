"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Plus, Users, Lock, Unlock } from "lucide-react";

interface GameLobbyProps {
  onJoinGame: (gameId: string) => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ onJoinGame }) => {
  const { publicKey } = useWallet();
  const [entryFee, setEntryFee] = useState("0.015");
  const [gameMode, setGameMode] = useState<"public" | "private">("public");
  const [inviteCode, setInviteCode] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [availableGames, setAvailableGames] = useState<any[]>([]);

  useEffect(() => {
    const demoGames = Array.from({ length: 20 }, (_, i) => ({
      id: `demo-${i + 1}`,
      entryFee: (Math.random() * (5 - 0.015) + 0.015).toFixed(3),
      mode: "public",
      players: Math.floor(Math.random() * 2) + 1,
    }));
    setAvailableGames(demoGames);
  }, []);

  const handleCreateGame = async () => {
    if (!publicKey) return;

    try {
      const fee = parseFloat(entryFee);
      if (fee < 0.015 || fee > 100) {
        alert("Entry fee must be between 0.015 and 100 SOL");
        return;
      }

      const gameId = Date.now().toString();
      const code = gameMode === "private" ? Math.floor(Math.random() * 1000000) : 0;

      console.log("Creating game:", {
        gameId,
        entryFee: fee,
        gameMode,
        inviteCode: code,
      });

      alert(`Game created! ${gameMode === "private" ? `Invite code: ${code}` : ""}`);
      onJoinGame(gameId);
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Failed to create game");
    }
  };

  const handleJoinGame = (gameId: string) => {
    onJoinGame(gameId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="terminal-border bg-black p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-green-500 flex items-center gap-2 terminal-glow">
              <Plus className="w-6 h-6" />
              &gt; CREATE_SESSION
            </h2>
          </div>

          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-green-900 hover:bg-green-800 text-green-400 font-semibold py-4 px-6 border-2 border-green-500 transition-colors"
            >
              &gt; INIT_NEW_DUEL
            </button>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-green-400 mb-2 font-semibold">
                  &gt; ENTRY_FEE (SOL)
                </label>
                <input
                  type="number"
                  min="0.015"
                  max="100"
                  step="0.001"
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  className="w-full bg-black border-2 border-green-700 px-4 py-3 text-green-400 placeholder-green-800 focus:outline-none focus:border-green-500"
                  placeholder="0.015 - 100"
                />
                <p className="text-green-600 text-sm mt-1">
                  &gt; MIN: 0.015 SOL | MAX: 100 SOL
                </p>
              </div>

              <div>
                <label className="block text-green-400 mb-3 font-semibold">
                  &gt; SESSION_MODE
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGameMode("public")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 font-semibold transition-colors border-2 ${
                      gameMode === "public"
                        ? "bg-green-900 text-green-400 border-green-500"
                        : "bg-black text-green-700 border-green-800 hover:border-green-600"
                    }`}
                  >
                    <Unlock className="w-5 h-5" />
                    PUBLIC
                  </button>
                  <button
                    onClick={() => setGameMode("private")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 font-semibold transition-colors border-2 ${
                      gameMode === "private"
                        ? "bg-green-900 text-green-400 border-green-500"
                        : "bg-black text-green-700 border-green-800 hover:border-green-600"
                    }`}
                  >
                    <Lock className="w-5 h-5" />
                    PRIVATE
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateGame}
                  className="flex-1 bg-green-900 hover:bg-green-800 text-green-400 font-semibold py-3 px-6 border-2 border-green-500 transition-colors"
                >
                  &gt; EXECUTE
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-black hover:bg-green-950 text-green-600 font-semibold border-2 border-green-800 transition-colors"
                >
                  &gt; ABORT
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="terminal-border bg-black p-8">
          <h2 className="text-2xl font-bold text-green-500 flex items-center gap-2 mb-6 terminal-glow">
            <Users className="w-6 h-6" />
            &gt; ACTIVE_SESSIONS
          </h2>

          {availableGames.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-green-800 mx-auto mb-4" />
              <p className="text-green-600">&gt; NO_SESSIONS_FOUND</p>
              <p className="text-green-800 text-sm mt-2">
                &gt; CREATE_NEW_SESSION_TO_START
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-green-950">
              {availableGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-green-950/20 p-4 border-2 border-green-800 hover:border-green-500 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-400 font-semibold">
                      &gt; SESSION #{game.id}
                    </span>
                    <span className="text-green-500 font-bold">
                      {game.entryFee} SOL
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 text-sm">
                      {game.mode === "public" ? "&gt; PUBLIC" : "&gt; PRIVATE"}
                    </span>
                    <button
                      onClick={() => handleJoinGame(game.id)}
                      className="bg-green-900 hover:bg-green-800 text-green-400 text-sm font-semibold py-2 px-4 border border-green-500 transition-colors"
                    >
                      &gt; JOIN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t-2 border-green-800">
            <h3 className="text-green-400 font-semibold mb-3">&gt; JOIN_PRIVATE_SESSION</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="ENTER_CODE"
                className="flex-1 bg-black border-2 border-green-700 px-4 py-2 text-green-400 placeholder-green-800 focus:outline-none focus:border-green-500"
              />
              <button
                onClick={() => {
                  if (inviteCode) {
                    handleJoinGame(inviteCode);
                  }
                }}
                className="bg-green-900 hover:bg-green-800 text-green-400 font-semibold py-2 px-6 border-2 border-green-500 transition-colors"
              >
                &gt; CONNECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
