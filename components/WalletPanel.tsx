import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { WalletIcon } from './icons/WalletIcon';
import { useSystem } from '../context/SystemContext';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { apiSendTransaction } from '../utils/api';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { PiIcon } from './icons/PiIcon';
import { CubeIcon } from './icons/CubeIcon';
import { EthereumIcon } from './icons/EthereumIcon';
import { BitcoinIcon } from './icons/BitcoinIcon';
// Fix: Import SystemState and WalletChain to resolve type errors.
import { SystemState, WalletChain } from '../types';

type ChainId = keyof SystemState['wallet']['chains'];

const chainIcons: Record<ChainId, React.ReactNode> = {
    nun: <CubeIcon />,
    pi: <PiIcon />,
    eth: <EthereumIcon />,
    btc: <BitcoinIcon />,
};

export const WalletPanel: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { wallet } = systemState;
    const [selectedChain, setSelectedChain] = useState<ChainId>('nun');
    const [sendAmount, setSendAmount] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [showPassphrase, setShowPassphrase] = useState(false);

    const activeChain = wallet.chains[selectedChain];

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(sendAmount);
        if (!recipientAddress.trim() || isNaN(amount) || amount <= 0 || wallet.isSending || amount > activeChain.balance) return;
        
        dispatch({ type: 'SEND_TRANSACTION_START', payload: { recipient: recipientAddress, amount, chainId: selectedChain } });

        try {
            // Note: API needs to know which chain to transact on. This is a simulation.
            const result = await apiSendTransaction(recipientAddress, amount);
            dispatch({ type: 'SEND_TRANSACTION_SUCCESS', payload: { amount, transactionHash: result.transactionHash, chainId: selectedChain } });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', message: `Successfully sent ${amount} ${activeChain.symbol}.` } });
            setSendAmount('');
            setRecipientAddress('');
        } catch (error: any) {
            dispatch({ type: 'SEND_TRANSACTION_FAILURE', payload: { chainId: selectedChain } });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'error', message: `Transaction failed: ${error.message}` } });
        }
    };

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', message: `${type} copied to clipboard.` } });
    };
    
    return (
        <DashboardCard title="Multi-Chain Wallet" icon={<WalletIcon />}>
            <div className="space-y-4">
                {/* Chain Selector */}
                <div className="grid grid-cols-4 gap-2">
                    {/* Fix: Use Object.entries for type-safe iteration over wallet chains. */}
                    {(Object.entries(wallet.chains) as [ChainId, WalletChain][]).map(([chainId, chainData]) => (
                        <button 
                            key={chainId}
                            onClick={() => setSelectedChain(chainId)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg transition text-xs font-bold border-2 ${selectedChain === chainId ? 'bg-nun-primary/20 border-nun-primary' : 'bg-nun-dark/50 border-transparent hover:border-nun-light/50 text-gray-300'}`}
                        >
                            {chainIcons[chainId]}
                            <span>{chainData.symbol}</span>
                        </button>
                    ))}
                </div>

                {/* Balance and Address Display */}
                <div>
                    <p className="text-xs text-gray-400 uppercase">{activeChain.name} Balance</p>
                    <p className="text-2xl font-bold text-nun-primary">{activeChain.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 8})} <span className="text-lg">{activeChain.symbol}</span></p>
                </div>
                <div className="text-xs font-mono">
                    <p className="text-gray-500">Address:</p>
                    <div className="flex items-center gap-2">
                         <p className="text-gray-300 break-all flex-grow" title={activeChain.address}>{activeChain.address}</p>
                         <button onClick={() => handleCopy(activeChain.address, `${activeChain.symbol} Address`)} className="p-1 rounded text-gray-400 hover:text-nun-primary transition flex-shrink-0" title="Copy Address">
                            <ClipboardIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="border-t border-nun-light/20 my-2"></div>

                {/* Send Form */}
                <form onSubmit={handleSend} className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-300">Send {activeChain.symbol}</h4>
                     <div>
                        <label htmlFor="recipient" className="block text-xs text-gray-400 mb-1">Recipient Address</label>
                        <input
                            type="text"
                            id="recipient"
                            value={recipientAddress}
                            onChange={e => setRecipientAddress(e.target.value)}
                            placeholder={`Enter ${activeChain.symbol} address`}
                            className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-2 text-sm font-mono focus:ring-1 focus:ring-nun-primary focus:outline-none"
                        />
                    </div>
                     <div>
                        <label htmlFor="amount" className="block text-xs text-gray-400 mb-1">Amount</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            id="amount"
                            value={sendAmount}
                            onChange={e => {
                                // Allow only valid decimal numbers
                                const value = e.target.value;
                                if (/^$|^[0-9]*\.?[0-9]*$/.test(value)) {
                                    setSendAmount(value);
                                }
                            }}
                            placeholder="0.0"
                            className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-2 text-sm focus:ring-1 focus:ring-nun-primary focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={wallet.isSending || !recipientAddress.trim() || !(parseFloat(sendAmount) > 0) || parseFloat(sendAmount) > activeChain.balance}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-secondary/80 text-nun-darker rounded hover:bg-nun-secondary transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Broadcast the transaction to the network."
                    >
                        {wallet.isSending ? <><ArrowPathIcon className="w-4 h-4 animate-spin" /> <span>Broadcasting...</span></> : 'Send Transaction'}
                    </button>
                </form>

                {/* Security Section */}
                <div className="border-t border-nun-light/20 pt-4 space-y-2">
                     <h4 className="text-sm font-bold text-gray-300">Wallet Security</h4>
                     <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Private Passphrase</label>
                     <p className="text-xs text-nun-warning mb-2">CRITICAL: Keep this passphrase secret and safe. It's the master key to all your assets.</p>
                     <div className="flex items-center gap-2">
                        <input type={showPassphrase ? 'text' : 'password'} readOnly value={wallet.passphrase} className="w-full bg-nun-darker/70 border border-nun-light/50 rounded-md py-1.5 px-2 font-mono text-gray-300 tracking-wider" />
                        <button onClick={() => setShowPassphrase(!showPassphrase)} className="p-2 rounded-md text-gray-400 hover:text-nun-primary hover:bg-nun-light/30 transition" title={showPassphrase ? "Hide Passphrase" : "Show Passphrase"}>
                            {showPassphrase ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                        <button onClick={() => handleCopy(wallet.passphrase, 'Wallet Passphrase')} className="p-2 rounded-md text-gray-400 hover:text-nun-primary hover:bg-nun-light/30 transition" title="Copy Passphrase">
                            <ClipboardIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};