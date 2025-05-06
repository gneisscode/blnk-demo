# Wallet Management System (WMS)

A modern web application for managing wallets, balances, identities, and ledgers. Built with Next.js and styled with Tailwind CSS.

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blnk-demo
```

### 2. Environment Setup

1. Create a `.env` file in the root directory:
```bash
cp env.example .env
```

2. The default environment variables are:
```
NEXT_PUBLIC_BLNK_API_BASE=http://localhost:5001
NEXT_PUBLIC_BLNK_API_KEY=HLkmGzUDnxu25xpm9ZDk-nPHqPydSKfFHUNOpls2I-c=
```

### 3. Start the Backend

1. Navigate to the blnk directory and start the Docker containers:
```bash
cd blnk
docker compose up
```

This will start the backend server at `http://localhost:5001`.

### 4. Start the Frontend

1. In a new terminal, from the project root:
```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Application Features

### Navigation

The application has a clean navigation bar at the top with:
- Home
- Wallets

### Wallets Management

#### List Wallets
- Navigate to `/wallets/list`
- View all wallets with their details
- Each wallet shows:
  - Balance
  - Currency
  - Status
  - Type
  - Creation date

#### Create Wallet
- Click "Create Wallet" on the wallets list page
- Fill in the required details:
  - Currency
  - Wallet Type
  - Purpose
  - Description

#### Wallet Details
- Click on any wallet to view its details
- View comprehensive information including:
  - Basic Information
  - Additional Information
  - Related Information (Ledger and Identity)
  - Timeline
- Actions available:
  - Fund Wallet
  - Withdraw from Wallet

### Fund Card Flow

1. Navigate to a card wallet's details
2. Click "Fund Card"
3. Select source wallet
4. Enter amount
5. Confirm transaction

### Balances Management

#### List Balances
- Navigate to `/balances/list`
- View all balances with their details


#### Balance Details
- View detailed balance information


### Identities Management

#### List Identities
- Navigate to `/identities/list`
- View all identities


#### Identity Details
- View comprehensive identity information
- Check verification status
- View related wallets and transactions

### Ledgers Management

#### List Ledgers
- Navigate to `/ledgers/list`
- View all ledgers


#### Ledger Details
- View ledger information
- Check related wallets and transactions





## API Integration

The application integrates with the Blnk API running on `localhost:5001`. The API handles:
- Wallet operations
- Balance management
- Identity verification
- Ledger management
- Transaction processing

## Development

### Project Structure
```
├── components/     # Reusable UI components
├── pages/         # Next.js pages and API routes
├── public/        # Static assets
├── styles/        # Global styles
├── utils/         # Utility functions
├── services/      # API services
├── hooks/         # Custom React hooks
└── types/         # TypeScript type definitions
```

### Key Technologies
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Docker

## Troubleshooting

1. If the backend is not accessible:
   - Check if Docker containers are running
   - Verify the API base URL in `.env`
   - Check API key validity

2. If the frontend fails to start:
   - Ensure all dependencies are installed
   - Check for port conflicts
   - Verify environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here]
