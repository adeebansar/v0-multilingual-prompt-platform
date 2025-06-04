# ScriptShift Prompt Master

A comprehensive multilingual platform for learning and mastering AI prompt engineering. Built with Next.js 15, featuring 11 language support, real-time prompt analysis, and interactive learning modules.

## Features

### 🌍 Multilingual Support
- 11 languages: English, Spanish, French, German, Chinese, Japanese, Arabic, Hindi, Urdu, Telugu, Tamil
- RTL support for Arabic and Urdu
- Automatic language detection
- Browser language preference detection

### 🎯 Interactive Playground
- Real-time prompt analysis and scoring
- AI model integration (GPT-3.5, GPT-4, GPT-4o)
- Temperature control and parameter tuning
- Usage tracking and cost estimation
- Prompt history and favorites

### 📚 Learning System
- Structured lessons with progress tracking
- Interactive quizzes and assessments
- Step-by-step tutorials
- Knowledge retention tracking

### 🎨 Template Library
- 10+ categories of enhanced prompt templates
- Real-world examples across domains
- Business, Creative, Technical, Academic templates
- Healthcare, Legal, Education, Career templates

### 🔧 Advanced Features
- Dark/Light theme support
- Responsive design for all devices
- Error boundaries and fallback handling
- Local storage for preferences
- Comprehensive testing framework

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **AI Integration**: OpenAI API
- **Internationalization**: Custom i18n system

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key
   \`\`\`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── lessons/           # Lesson pages
│   ├── playground/        # Interactive playground
│   ├── quizzes/          # Quiz system
│   └── settings/         # User settings
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── playground/       # Playground components
│   └── lessons/          # Lesson components
├── lib/                  # Utility libraries
│   ├── i18n.ts          # Internationalization
│   ├── templates.ts     # Prompt templates
│   └── prompt-analyzer.ts # Prompt analysis
└── contexts/            # React contexts
\`\`\`

## API Endpoints

- `/api/generate` - AI text generation
- `/api/translate` - Translation service
- `/api/detect-language` - Language detection
- `/api/check-api-key` - API key validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
\`\`\`
