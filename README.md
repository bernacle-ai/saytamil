# Tamil Chat - AI Writing Assistant

A modern, clean Tamil language AI writing assistant built with Next.js 16, React 19, and Tailwind CSS.

## Features--

✨ **Modern UI** - Built with Tailwind CSS for a clean, responsive design
🔐 **Authentication** - Simple login/signup with localStorage persistence
💬 **Chat Management** - Create, switch, and delete chat conversations
📝 **Text Editor** - Rich text editor with formatting tools
🤖 **AI Integration** - Ready for Gemini API integration
🎨 **Dark Theme** - Beautiful dark mode interface
📱 **Responsive** - Works on desktop, tablet, and mobile

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main page with auth logic
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Tailwind CSS imports
├── components/
│   ├── Auth/              # Authentication components
│   │   ├── AuthPage.tsx
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── Layout/            # Main layout components
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   ├── Editor/            # Editor component
│   │   └── Editor.tsx
│   ├── UI/                # UI components
│   │   └── Toast.tsx
│   └── Providers.tsx      # Context providers
├── contexts/              # React contexts
│   ├── ChatContext.tsx    # Chat state management
│   └── ToastContext.tsx   # Toast notifications
└── types/
    └── index.ts           # TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Authentication
- Sign up with email and password
- Login with existing credentials
- Credentials are stored in localStorage

### Chat Interface
- Click "New Chat" to create a conversation
- Type Tamil or English text in the editor
- Click "Analyze" to send text to AI
- View chat history in the sidebar

### Editor
- Format text with toolbar buttons (Bold, Italic, Underline)
- Character count displayed at bottom
- AI Assistant panel on the right shows suggestions

## Integration with Gemini API

To add Gemini API integration:

1. Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

2. Add to `.env.local`:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

3. Install Gemini SDK:
```bash
npm install @google/generative-ai
```

4. Create `src/hooks/useGemini.ts`:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export function useGemini() {
  const sendMessage = async (text: string) => {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(text);
    return result.response.text();
  };

  return { sendMessage };
}
```

5. Update Editor component to use the hook

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **LocalStorage** - Data persistence

## Features to Implement

- [ ] Gemini API integration
- [ ] Real-time chat responses
- [ ] Message editing
- [ ] Chat export
- [ ] Theme customization
- [ ] User profile
- [ ] Settings panel

## License

MIT
