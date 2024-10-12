import React, { useState, useEffect} from 'react';
import { JsonRpcProvider, Connection, devnetConnection } from '@mysten/sui';

interface NFT {
  id: string;
  name: string;
  url: string;
}

const App: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null); // unity type
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  
  const provider = new JsonRpcProvider(new Connection(devnetConnection));

  // Function to connect to Sui wallet
  const connectWallet = async () => {
    try {
      // Ensure the Sui wallet API is present in the browser
      const suiWallet = (window as any).suiWallet;
      if (!suiWallet) {
        alert('Please install a Sui-compatible wallet like Ethos Wallet or Sui Wallet.');
        return;
      }
      
      // Request the user's account address
      const accounts = await suiWallet.requestAccounts();
      const userAccount = accounts[0];
      setAccount(userAccount);
      setWalletConnected(true);

      // Fetch NFTs and balance
      fetchNFTs(userAccount);
      fetchBalance(userAccount);
    } catch (error) {
      console.error("Error connecting to the wallet:", error);
    }
  };

// function to fetch NFTs from the sui blockchain
const fetchNFTs = async (accountAddress: string) => {
    try {
      const nfts = await provider.getObjectsOwnedByAddress(accountAddress);
      const userNFTs = nfts 
      .filter((obj: any) => obj.type.includes('NFT')) // assuming NFTs have 'NFT' in type
      .map((nft: any) => ({
        id: nft.objectId,
        name: nft.details.data.fields.name,
        url: nft.details.data.fields.url,
      }));
      setNfts(userNFTs);
    } catch (error) {
       console.error('Error Fetching NFTs:', error);
    }
};

// function to fetch balance (assuming memecoin is an object with specific type)

const fetchBalance = async (accountAddress: string) => {
   try {
     const coins = await provider.getObjectsOwnedByAddress(accountAddress);
     const balance = coins.reduce((sum: number, obj: any) => {
      if (obj.type === '0x2::coin::Coin<0x2::sui::SUI>') {
        return sum + parseInt(obj.details.data.fields.balance, 10);
      }
      return sum;
   }, 0);
   setBalance(balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}


return (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold mb-6">Sui DeFi App</h1>

    {!walletConnected ? (
      <button
        onClick={connectWallet}
        className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Connect Sui Wallet
      </button>
    ) : (
      <div className="text-center">
        <p className="mb-4">Connected Account: {account}</p>
        <p className="mb-4">Balance: {balance ? (balance / 1e9).toFixed(4) : 'Loading...'} SUI</p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {nfts.length > 0 ? (
            nfts.map((nft) => (
              <div key={nft.id} className="bg-gray-800 p-4 rounded-lg">
                <img src={nft.url} alt={nft.name} className="w-full h-40 object-cover mb-2 rounded-lg" />
                <p className="text-lg">{nft.name}</p>
              </div>
            ))
          ) : (
            <p>No NFTs found</p>
          )}
        </div>
      </div>
    )}
  </div>
);

}
export default App;