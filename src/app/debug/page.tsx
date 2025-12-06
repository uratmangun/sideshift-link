'use client';

import { useState } from 'react';

interface CheckoutResponse {
    id: string;
    settleCoin: string;
    settleNetwork: string;
    settleAddress: string;
    settleAmount: string;
    updatedAt: string;
    createdAt: string;
    affiliateId: string;
    successUrl: string;
    cancelUrl: string;
}

export default function DebugPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkout, setCheckout] = useState<CheckoutResponse | null>(null);
    const [settleAmount, setSettleAmount] = useState('50');
    const [settleAddress, setSettleAddress] = useState('0x0000000000000000000000000000000000000000');

    const createCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    settleCoin: 'USDC',
                    settleNetwork: 'base',
                    settleAmount,
                    settleAddress,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to create checkout');
            }

            const data: CheckoutResponse = await response.json();
            setCheckout(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">SideShift Checkout Debug</h1>

                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Create Test Checkout</h2>
                    <p className="text-gray-400 mb-4">
                        Create a checkout for USDC on Base network.
                    </p>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label htmlFor="settleAmount" className="block text-sm text-gray-400 mb-1">
                                Amount (USDC)
                            </label>
                            <input
                                id="settleAmount"
                                type="text"
                                value={settleAmount}
                                onChange={(e) => setSettleAmount(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500"
                                placeholder="50"
                            />
                        </div>
                        <div>
                            <label htmlFor="settleAddress" className="block text-sm text-gray-400 mb-1">
                                Settle Address
                            </label>
                            <input
                                id="settleAddress"
                                type="text"
                                value={settleAddress}
                                onChange={(e) => setSettleAddress(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-sky-500"
                                placeholder="0x..."
                            />
                        </div>
                    </div>

                    <button
                        onClick={createCheckout}
                        disabled={loading}
                        className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        {loading ? 'Creating...' : 'Create Checkout'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
                        <p className="text-red-300">{error}</p>
                    </div>
                )}

                {checkout && (
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Checkout Created</h2>

                        <div className="space-y-3 mb-6">
                            <div>
                                <span className="text-gray-400">ID:</span>
                                <span className="ml-2 font-mono text-sm">{checkout.id}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Settle Coin:</span>
                                <span className="ml-2">{checkout.settleCoin}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Network:</span>
                                <span className="ml-2">{checkout.settleNetwork}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Amount:</span>
                                <span className="ml-2">{checkout.settleAmount}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Created:</span>
                                <span className="ml-2">{new Date(checkout.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <a
                            href={`https://pay.sideshift.ai/checkout/${checkout.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Open Payment Page →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
