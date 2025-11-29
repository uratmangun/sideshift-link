"use client";

import { useState } from "react";

const COINS = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿", network: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ", network: "Ethereum" },
  { symbol: "USDC", name: "USD Coin", icon: "$", network: "Ethereum" },
  { symbol: "SOL", name: "Solana", icon: "◎", network: "Solana" },
];

export function Checkout() {
  const [payAmount, setPayAmount] = useState("0.1");
  const [payCoin, setPayCoin] = useState(COINS[0]);
  const [receiveCoin, setReceiveCoin] = useState(COINS[1]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwap = () => {
    const temp = payCoin;
    setPayCoin(receiveCoin);
    setReceiveCoin(temp);
  };

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full max-w-[440px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
            S
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white">
            SideShift Checkout
          </span>
        </div>
        <div className="text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
          Test Mode
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Pay Section */}
        <div className="space-y-2">
          <label
            htmlFor="pay-amount"
            className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
          >
            You Pay
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                id="pay-amount"
                type="text"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-none focus:ring-0 p-0 text-zinc-900 dark:text-white placeholder:text-zinc-300"
                placeholder="0.00"
              />
              <div className="text-sm text-zinc-500 mt-1">
                ≈ ${(parseFloat(payAmount || "0") * 45000).toLocaleString()}
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm text-sm">
                {payCoin.icon}
              </span>
              <span className="font-medium text-zinc-900 dark:text-white">
                {payCoin.symbol}
              </span>
              <svg
                className="w-4 h-4 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider / Swap */}
        <div className="relative h-px bg-zinc-100 dark:bg-zinc-800 my-4">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap coins"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-sm text-zinc-500 hover:text-blue-600"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        {/* Receive Section */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            You Receive
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="text-3xl font-bold text-zinc-900 dark:text-white opacity-60">
                {(parseFloat(payAmount || "0") * 14.5).toFixed(4)}
              </div>
              <div className="text-sm text-zinc-500 mt-1">
                1 {payCoin.symbol} ≈ 14.5 {receiveCoin.symbol}
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 h-fit"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm text-sm">
                {receiveCoin.icon}
              </span>
              <span className="font-medium text-zinc-900 dark:text-white">
                {receiveCoin.symbol}
              </span>
              <svg
                className="w-4 h-4 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3 space-y-2 text-sm">
          <div className="flex justify-between text-zinc-500">
            <span>Network Fee</span>
            <span>~$2.50</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Rate</span>
            <span>
              1 {payCoin.symbol} = 14.5 {receiveCoin.symbol}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Shift {payCoin.symbol} to {receiveCoin.symbol}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
