import React, { useState, useEffect} from 'react';
import { JsonRpcProvider, Connection, devnetConnection } from '@mysten/sui.js';

interface NFT {
  id: string;
  name: string;
  url: string;
}

const App: React.FC = () =>  {
    const [walletConnected, setWalletConnected] = useState<boolean>(false);
    const [account, setAccount] = useState<String | null>(null);
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [balance, setBalance] = useState<number | null>(null);
}

const provider = new JsonRpcProvider(new Connection (devnetConnection));

// function to connect with my sui wallet

const connectWallet = async => {
  try 
  // ensure the practice is fair and present 
  const suiWallet = (window as any).suiWallet;
  if(!suiWallet) {
    alert('Please install a Sui-compatible wallet like Ethos wallet or Sui wallet');
    return;
  }

  // request the users account address
  const accounts = await suiWallet.requestAccounts();
  const userAccount = accounts[0];
  setAccount(userAccount);
  setWalletConnected(true);


// fetch NFTs and balance 
fetchNFTs(userAccount);
fetchBalance(userAccount);

} catch(error) {
   console.error('Error connecting to the wallet:', error);
}