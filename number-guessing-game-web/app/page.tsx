"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { GameLobby } from "@/components/GameLobby";
import { ActiveGame } from "@/components/ActiveGame";
import { Terminal, Trophy, Coins } from "lucide-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function Home() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connection) {
        try {
          const lamports = await connection.getBalance(publicKey);
          setBalance(lamports / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return (
    <main className="min-h-screen bg-black terminal-scan">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12 terminal-border bg-black p-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-10 h-10 text-green-500 terminal-flicker" />
            <h1 className="text-4xl font-bold text-green-500 terminal-glow">
              &gt; FARTDUEL_
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {connected && balance !== null && (
              <div className="bg-green-950/30 border-2 border-green-700 px-4 py-2 flex items-center gap-2">
                <Coins className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold">{balance.toFixed(4)} SOL</span>
              </div>
            )}
            <WalletMultiButton className="!bg-green-900 hover:!bg-green-800 !text-green-400 !border-2 !border-green-500" />
          </div>
        </header>

        {!connected ? (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="terminal-border bg-black p-12 text-center">
              <Trophy className="w-20 h-20 text-green-500 mx-auto mb-6 terminal-flicker" />
              <h2 className="text-3xl font-bold text-green-500 mb-4 terminal-glow">
                &gt; SYSTEM.INIT: FARTDUEL
              </h2>
              <p className="text-green-400 mb-8 text-lg">
                &gt; PROTOCOL: HEAD_TO_HEAD_DUEL<br/>
                &gt; RANGE: 1-100<br/>
                &gt; OBJECTIVE: CLOSEST_TO_TARGET<br/>
                &gt; REWARD: WINNER_TAKES_ALL
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-950/30 border border-green-700 p-6">
                  <Coins className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-green-400 font-semibold mb-2">&gt; ENTRY_FEE</h3>
                  <p className="text-green-600 text-sm">0.015 - 100 SOL</p>
                </div>
                <div className="bg-green-950/30 border border-green-700 p-6">
                  <Trophy className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-green-400 font-semibold mb-2">&gt; PAYOUT</h3>
                  <p className="text-green-600 text-sm">98% PRIZE_POOL</p>
                </div>
                <div className="bg-green-950/30 border border-green-700 p-6">
                  <Terminal className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-green-400 font-semibold mb-2">&gt; MODES</h3>
                  <p className="text-green-600 text-sm">PUBLIC | PRIVATE</p>
                </div>
              </div>

              <div className="bg-green-950/20 border border-green-700 p-6 mb-8">
                <h3 className="text-green-400 font-semibold mb-3">&gt; EXECUTION_PROTOCOL:</h3>
                <ol className="text-left text-green-500 space-y-2 font-mono">
                  <li>&gt; 1. CONNECT_WALLET</li>
                  <li>&gt; 2. INIT_GAME_SESSION</li>
                  <li>&gt; 3. SELECT_NUMBER [1-100] TIMEOUT:25s</li>
                  <li>&gt; 4. TRANSFER_ENTRY_FEE</li>
                  <li>&gt; 5. CALCULATE_WINNER DISTANCE:MIN</li>
                </ol>
              </div>

              <p className="text-green-400 font-semibold terminal-flicker">
                &gt; AWAITING_WALLET_CONNECTION...
              </p>
            </div>
          </div>
        ) : activeGameId ? (
          <ActiveGame gameId={activeGameId} onExit={() => setActiveGameId(null)} />
        ) : (
          <GameLobby onJoinGame={setActiveGameId} />
        )}
      </div>
    </main>
  );
}
