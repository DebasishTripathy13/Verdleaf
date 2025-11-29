# 🌱 EcoMon Guardian

A Web3-powered AI companion app where your digital creature evolves through verified real-world eco-actions. Combines gamification, AI, and blockchain to make environmental action fun and rewarding.

![EcoMon Guardian](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🎮 Core Gameplay
- **AI Companion**: Your EcoMon has a unique personality and emotional state
- **Evolution System**: 5 evolution stages with 5 distinct paths
- **Verification**: AI-powered image verification for eco-actions
- **Daily Quiz**: Test your environmental knowledge for rewards
- **Leaderboard**: Compete globally with other eco-guardians

### 🤖 AI Features
- **Personality-Driven Chat**: 4 personality types (Sage, Cheerleader, Scientist, Empath)
- **Gemini AI Integration**: Natural conversations and quiz generation
- **Vision AI**: Verify real eco-actions through photo analysis
- **Emotional Memory**: Your EcoMon remembers your actions and adapts

### 🔗 Web3 Integration
- **Wallet Connection**: RainbowKit with wagmi v2
- **Base L2**: Deployed on Base for low-cost transactions
- **NFT Potential**: Mint your evolved EcoMon (future feature)
- **Eco Tokens**: Earn tokens through verified actions (future feature)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key
- WalletConnect Project ID

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecomon-guardian.git
   cd ecomon-guardian
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ecomon"
   GEMINI_API_KEY="your-gemini-api-key"
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-id"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/         # AI chat endpoint
│   │   ├── quiz/         # Quiz generation & submission
│   │   └── verify/       # Image verification
│   ├── dashboard/        # Dashboard pages
│   │   ├── chat/        # Chat mode
│   │   ├── quiz/        # Daily quiz
│   │   ├── verify/      # Verify eco-actions
│   │   ├── evolution/   # Evolution path
│   │   └── leaderboard/ # Global rankings
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ecomon/           # EcoMon display
│   ├── chat/             # Chat interface
│   ├── quiz/             # Quiz components
│   └── web3/             # Wallet components
├── lib/                   # Utility libraries
│   ├── gemini.ts         # Gemini AI client
│   ├── gemini-vision.ts  # Vision AI for verification
│   ├── web3.ts           # Web3 configuration
│   └── utils.ts          # Helper functions
├── store/                 # Zustand state stores
├── types/                 # TypeScript types
├── constants/            # App constants
└── prisma/               # Database schema
```

## 🎨 UI/UX Features

- **Glassmorphism Design**: Modern frosted-glass effects
- **Framer Motion Animations**: Smooth transitions and micro-interactions
- **Dark Mode**: Eye-friendly dark theme
- **Responsive**: Works on mobile, tablet, and desktop
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Animation | Framer Motion |
| Database | PostgreSQL + Prisma |
| AI | Google Gemini API |
| Web3 | wagmi v2 + viem + RainbowKit |
| State | Zustand |
| Icons | Lucide React |

## 🌍 Evolution Paths

1. **🌲 Forest Guardian** - Focus on tree planting and nature conservation
2. **🌊 Ocean Keeper** - Beach cleanups and water conservation
3. **🏙️ Urban Sage** - Urban farming and community gardens
4. **🌸 Sky Watcher** - Air quality and renewable energy
5. **🔥 Flame Keeper** - Carbon footprint and sustainable living

## 📱 Add Your Pokemon Images

Place your Pokemon-style images in the `public/ecomon/` folder:

```
public/ecomon/
├── leaf/
│   ├── stage-1.png
│   ├── stage-2.png
│   └── ...
├── water/
│   └── ...
└── placeholder.svg
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [RainbowKit](https://rainbowkit.com/) for wallet connection
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Base](https://base.org/) for L2 infrastructure

---

**Made with 💚 for the planet**
