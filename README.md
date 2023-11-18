# ETH2

# Ethereum ATM Application

This is a simple React application that serves as an interface to interact with an Ethereum smart contract acting as an Automated Teller Machine (ATM). Users can connect their MetaMask wallets to perform deposit, withdraw, multiply, and divide operations on the smart contract.

## Features

- Connect MetaMask wallet.
- View account details, ATM balance, and MetaMask balance.
- Deposit and withdraw Ethereum from the smart contract.
- Multiply and divide the balance stored in the smart contract.

## Prerequisites

- [MetaMask](https://metamask.io/) wallet installed.
- An Ethereum network with a deployed smart contract.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Leno901/ETH2.git
   cd ethereum-atm-app
2. Install Dependencies:
    ```bash
   npm i
   Open Two Additional Terminals
    
3. In the second terminal, run a local Ethereum node
   ```bash
   npx hardhat node

4. In the third terminal, deploy the smart contract:
   ```bash
   npx hardhat run --network localhost scripts/deploy.js

5. Return to the First Terminal:
   ```bash
   npm run dev

6. Open in Browser:
Open the following URL in your browser to interact with the application:
   ```bash
   http://localhost:3000

## Author
   John Bulos
   https://github.com/Leno901
