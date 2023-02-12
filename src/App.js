import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  const [greeting, setGreetingValue] = useState();

  useEffect(() => {
    fetchGreeting();
  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        setGreetingValue(data);
        console.log('data: ', data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue('');
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <p>{greeting}</p>
     <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
     <button onClick={setGreeting}>Change</button>
    </div>
  );
  }

export default App;
