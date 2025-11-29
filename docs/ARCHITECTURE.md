# EcoMon Guardian - Architecture Diagram

## System Architecture

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Layer"]
        UI[Next.js Frontend<br/>React 18 + TypeScript]
        State[Zustand State Management]
        Web3UI[RainbowKit + Wagmi<br/>Wallet Connection]
    end

    subgraph Pages["📱 Dashboard Pages"]
        Home[Home Page]
        Chat[Chat Interface]
        Quiz[Quiz System]
        Verify[Eco-Action Verification]
        Evolution[Evolution View]
        Store[Eco Store]
        NFTs[NFT Gallery]
        Leaderboard[Leaderboard]
        Settings[Settings]
    end

    subgraph API["🔌 API Layer (Next.js Route Handlers)"]
        ChatAPI["/api/chat"]
        QuizAPI["/api/quiz/*"]
        VerifyAPI["/api/verify"]
        NFTAPI["/api/nft"]
        StoreAPI["/api/store/*"]
    end

    subgraph Services["⚙️ Core Services"]
        GeminiChat[Gemini AI<br/>Chat Service]
        GeminiVision[Gemini Vision<br/>Image Verification]
        SolanaNFT[Solana NFT<br/>Minting Service]
    end

    subgraph External["☁️ External Services"]
        GoogleAI[Google Gemini API]
        SolanaNet[Solana Blockchain<br/>Devnet/Mainnet]
        Metaplex[Metaplex Protocol]
    end

    subgraph Database["🗄️ Data Layer"]
        Prisma[Prisma ORM]
        PostgreSQL[(PostgreSQL Database)]
    end

    %% Client connections
    UI --> State
    UI --> Web3UI
    UI --> Pages

    %% Pages to API
    Pages --> API

    %% API to Services
    ChatAPI --> GeminiChat
    QuizAPI --> GeminiChat
    VerifyAPI --> GeminiVision
    NFTAPI --> SolanaNFT

    %% Services to External
    GeminiChat --> GoogleAI
    GeminiVision --> GoogleAI
    SolanaNFT --> SolanaNet
    SolanaNFT --> Metaplex

    %% API to Database
    API --> Prisma
    Prisma --> PostgreSQL

    %% Styling
    classDef client fill:#3b82f6,stroke:#1d4ed8,color:#fff
    classDef api fill:#22c55e,stroke:#15803d,color:#fff
    classDef service fill:#f59e0b,stroke:#d97706,color:#fff
    classDef external fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef database fill:#ef4444,stroke:#dc2626,color:#fff

    class UI,State,Web3UI client
    class ChatAPI,QuizAPI,VerifyAPI,NFTAPI,StoreAPI api
    class GeminiChat,GeminiVision,SolanaNFT service
    class GoogleAI,SolanaNet,Metaplex external
    class Prisma,PostgreSQL database
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph User["👤 User Actions"]
        Upload[Upload Eco-Action Photo]
        TakeQuiz[Take Daily Quiz]
        ChatEcoMon[Chat with EcoMon]
        MintNFT[Mint NFT]
    end

    subgraph Processing["🔄 Processing"]
        Vision[Gemini Vision Analysis]
        QuizGen[AI Quiz Generation]
        ChatGen[AI Response Generation]
        NFTMint[NFT Minting Process]
    end

    subgraph Rewards["🏆 Rewards System"]
        Points[Eco Points]
        XP[Evolution XP]
        Tokens[Eco Tokens]
        Badges[Achievements]
    end

    subgraph Evolution["🌱 EcoMon Evolution"]
        Stage1[Stage 1: Seedling]
        Stage2[Stage 2: Sprout]
        Stage3[Stage 3: Bloom]
        Stage4[Stage 4: Guardian]
        Stage5[Stage 5: Legend]
    end

    Upload --> Vision
    Vision --> Points
    Vision --> XP

    TakeQuiz --> QuizGen
    QuizGen --> Points
    QuizGen --> XP

    ChatEcoMon --> ChatGen
    ChatGen --> |Emotional Bond| Evolution

    MintNFT --> NFTMint
    NFTMint --> |On-Chain| Solana[(Solana)]

    Points --> Tokens
    XP --> Evolution
    Badges --> Evolution

    Stage1 --> Stage2 --> Stage3 --> Stage4 --> Stage5

    classDef user fill:#06b6d4,stroke:#0891b2,color:#fff
    classDef process fill:#f59e0b,stroke:#d97706,color:#fff
    classDef reward fill:#22c55e,stroke:#15803d,color:#fff
    classDef evolution fill:#8b5cf6,stroke:#7c3aed,color:#fff

    class Upload,TakeQuiz,ChatEcoMon,MintNFT user
    class Vision,QuizGen,ChatGen,NFTMint process
    class Points,XP,Tokens,Badges reward
    class Stage1,Stage2,Stage3,Stage4,Stage5 evolution
```

## Database Entity Relationship

```mermaid
erDiagram
    User ||--o| EcoMon : owns
    User ||--o{ QuizAttempt : takes
    User ||--o{ Verification : submits
    User ||--o{ ChatMessage : sends
    User ||--o{ Achievement : earns
    User ||--o{ UserQuest : has

    EcoMon {
        string id PK
        string name
        string species
        string personality
        int evolutionStage
        string evolutionPath
        int evolutionXP
        json emotionalState
        string currentMood
        int corruptionLevel
        boolean isDarkForm
        string nftTokenId
    }

    User {
        string id PK
        string walletAddress UK
        string email UK
        int ecoPoints
        int ecoTokens
        int totalXP
        int level
        int streak
    }

    QuizAttempt {
        string id PK
        json questions
        json answers
        int score
        int pointsEarned
        int xpEarned
        datetime quizDate
    }

    Verification {
        string id PK
        string imageUrl
        string actionType
        float confidence
        boolean isVerified
        int pointsAwarded
        int xpAwarded
    }

    ChatMessage {
        string id PK
        string role
        string content
        string mood
        json emotion
    }

    Achievement {
        string id PK
        string badgeId
        string name
        string rarity
        datetime unlockedAt
    }

    Quest ||--o{ UserQuest : assigned
    Quest {
        string id PK
        string title
        string type
        string actionType
        int targetCount
        int pointReward
        int xpReward
    }

    UserQuest {
        string id PK
        int progress
        boolean isCompleted
        datetime expiresAt
    }

    StoreOrder {
        string id PK
        string productId
        int quantity
        int tokenCost
        string status
    }
```

## Component Architecture

```mermaid
flowchart TB
    subgraph Layout["📐 App Layout"]
        RootLayout[Root Layout]
        DashboardLayout[Dashboard Layout]
        Providers[Providers<br/>Wagmi + RainbowKit + React Query]
    end

    subgraph CoreComponents["🧩 Core Components"]
        EcoMonDisplay[EcoMon Display<br/>Animated Companion]
        ChatInterface[Chat Interface<br/>AI Conversation]
        QuizCard[Quiz Card<br/>Interactive Quiz]
        ImageUploader[Image Uploader<br/>Eco-Action Verification]
        WalletConnect[Wallet Connect<br/>Web3 Auth]
        EvolutionAnimation[Evolution Animation<br/>Stage Transitions]
    end

    subgraph UIComponents["🎨 UI Components (Radix)"]
        Button[Button]
        Card[Card]
        Dialog[Dialog]
        Input[Input]
        Progress[Progress]
        Tabs[Tabs]
        Avatar[Avatar]
        Badge[Badge]
        Tooltip[Tooltip]
        ScrollArea[Scroll Area]
    end

    subgraph Stores["📦 State Stores (Zustand)"]
        EcoMonStore[EcoMon Store<br/>Companion State]
        QuizStore[Quiz Store<br/>Quiz Progress]
        UserStore[User Store<br/>User Data]
    end

    RootLayout --> Providers
    Providers --> DashboardLayout
    DashboardLayout --> CoreComponents
    CoreComponents --> UIComponents
    CoreComponents --> Stores

    classDef layout fill:#3b82f6,stroke:#1d4ed8,color:#fff
    classDef core fill:#22c55e,stroke:#15803d,color:#fff
    classDef ui fill:#f59e0b,stroke:#d97706,color:#fff
    classDef store fill:#8b5cf6,stroke:#7c3aed,color:#fff

    class RootLayout,DashboardLayout,Providers layout
    class EcoMonDisplay,ChatInterface,QuizCard,ImageUploader,WalletConnect,EvolutionAnimation core
    class Button,Card,Dialog,Input,Progress,Tabs,Avatar,Badge,Tooltip,ScrollArea ui
    class EcoMonStore,QuizStore,UserStore store
```

## Technology Stack

```mermaid
mindmap
  root((EcoMon Guardian))
    Frontend
      Next.js 14
      React 18
      TypeScript
      Tailwind CSS
      Framer Motion
      Radix UI
    State Management
      Zustand
      React Query
    Web3
      Wagmi
      RainbowKit
      Solana Web3.js
      Metaplex
    AI/ML
      Google Gemini
      Gemini Vision
    Backend
      Next.js API Routes
      Prisma ORM
    Database
      PostgreSQL
    Styling
      Tailwind CSS
      PostCSS
      CSS Variables
```

## Deployment Architecture

```mermaid
flowchart TB
    subgraph Production["🚀 Production Environment"]
        Vercel[Vercel<br/>Next.js Hosting]
        PostgresDB[(PostgreSQL<br/>Cloud Database)]
    end

    subgraph Services["🔗 Connected Services"]
        GeminiAPI[Google Gemini API]
        SolanaMainnet[Solana Mainnet]
    end

    subgraph Development["🛠️ Development"]
        LocalDev[Local Development<br/>npm run dev]
        SolanaDevnet[Solana Devnet]
        PrismaStudio[Prisma Studio]
    end

    User((User)) --> Vercel
    Vercel --> PostgresDB
    Vercel --> GeminiAPI
    Vercel --> SolanaMainnet

    Developer((Developer)) --> LocalDev
    LocalDev --> PrismaStudio
    LocalDev --> SolanaDevnet
    LocalDev --> GeminiAPI

    classDef prod fill:#22c55e,stroke:#15803d,color:#fff
    classDef service fill:#f59e0b,stroke:#d97706,color:#fff
    classDef dev fill:#3b82f6,stroke:#1d4ed8,color:#fff

    class Vercel,PostgresDB prod
    class GeminiAPI,SolanaMainnet service
    class LocalDev,SolanaDevnet,PrismaStudio dev
```

## Key Features Summary

| Feature | Technology | Description |
|---------|------------|-------------|
| 🤖 AI Companion | Google Gemini | Personalized EcoMon with emotional intelligence |
| 📸 Action Verification | Gemini Vision | AI-powered eco-action photo verification |
| 🧠 Quiz System | Gemini AI | Dynamic environmental quiz generation |
| 💬 Chat Interface | Gemini AI | Context-aware conversations with EcoMon |
| 🎮 Evolution System | Custom Logic | 5-stage evolution based on eco-actions |
| 🎨 NFT Minting | Solana + Metaplex | On-chain NFTs for evolved EcoMons |
| 💳 Wallet Integration | RainbowKit + Wagmi | Multi-wallet Web3 authentication |
| 🏆 Achievement System | PostgreSQL | Badges and achievements tracking |
| 🛒 Eco Store | Custom | Token-based rewards marketplace |
