# WebLLM Chat Application

A modern, ChatGPT-like web application that runs large language models directly in your browser using WebLLM. No server required - everything runs locally with WebGPU acceleration!

![WebLLM Chat](https://img.shields.io/badge/WebLLM-Powered-blue) ![React](https://img.shields.io/badge/React-19.1.0-blue) ![Vite](https://img.shields.io/badge/Vite-6.3.5-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.7-cyan)

## ✨ Features

- 🤖 **Local AI Models**: Run powerful LLMs directly in your browser
- 🚀 **Real-time Streaming**: Get responses as they're generated
- 🎯 **Multiple Models**: Choose from Llama, Phi, Qwen, Gemma, and more
- 💾 **No Server Required**: Everything runs client-side
- 🔒 **Privacy First**: Your conversations never leave your device
- ⚡ **WebGPU Acceleration**: Hardware-accelerated inference
- 🎨 **Modern UI**: ChatGPT-inspired interface with dark theme
- 📱 **Responsive Design**: Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Modern browser with WebGPU support (Chrome 113+, Edge 113+)
- At least 8GB RAM (16GB recommended for larger models)
- Good internet connection for initial model download

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivomv/WEBLLM.git
   cd WEBLLM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` and wait for the model to load!

## 🎯 Available Models

| Model | Size | Description | Best For |
|-------|------|-------------|----------|
| **Llama-3.1-8B-Instruct** | ~4.5GB | Meta's latest instruction-tuned model | General conversation, reasoning |
| **Llama-3.2-3B-Instruct** | ~1.8GB | Smaller, faster Llama model | Quick responses, lower-end devices |
| **Phi-3.5-mini-instruct** | ~2.2GB | Microsoft's efficient small model | Code generation, math |
| **Qwen2.5-7B-Instruct** | ~4.1GB | Alibaba's multilingual model | Multiple languages, reasoning |
| **Gemma-2-2B-IT** | ~1.4GB | Google's lightweight model | Fast responses, mobile devices |

## 🛠️ Usage

### First Time Setup
1. Select a model from the sidebar dropdown
2. Wait for the model to download and load (progress shown in sidebar)
3. Once loaded, start chatting!

### Model Switching
- Use the dropdown in the sidebar to switch between models
- Each model has different capabilities and response speeds
- Smaller models load faster but may be less capable

### Chat Features
- **Streaming responses**: See AI responses as they're generated
- **Conversation history**: Full context maintained throughout the chat
- **New chat**: Reset conversation while keeping the model loaded
- **Error handling**: Automatic retry on failures

## 🔧 Technical Details

### Built With
- **React 19.1.0** - Modern React with latest features
- **Vite 6.3.5** - Fast build tool and dev server
- **TailwindCSS 4.1.7** - Utility-first CSS framework
- **@mlc-ai/web-llm 0.2.79** - WebLLM inference engine

### Architecture
- **Frontend-only**: No backend server required
- **WebGPU**: Hardware acceleration for model inference
- **Streaming**: Real-time response generation
- **Local Storage**: Models cached in browser after first download

### Browser Compatibility
| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 113+ | ✅ Full | Recommended |
| Edge 113+ | ✅ Full | Recommended |
| Firefox | ❌ Limited | WebGPU experimental |
| Safari | ❌ Limited | WebGPU experimental |

## 📁 Project Structure

```
WEBLLM/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── README.md           # This file
```

## 🚨 Important Notes

### Performance Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **GPU**: Modern GPU with WebGPU support
- **Storage**: 2-8GB per model (cached after first download)
- **Network**: Fast connection for initial model download

### First Load
- Models are downloaded on first use (2-8GB per model)
- Download time: 5-15 minutes depending on connection
- Subsequent loads are instant (models cached locally)

### Privacy & Security
- All processing happens locally in your browser
- No data sent to external servers
- Conversations are not stored permanently
- Models run in isolated WebAssembly environment

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding New Models
1. Check [MLC Models](https://mlc.ai/models) for available models
2. Add model ID to `availableModels` array in `App.jsx`
3. Test model loading and performance

### Customization
- **UI Theme**: Modify Tailwind classes in `App.jsx`
- **Model Settings**: Adjust temperature, max tokens in chat completion
- **Performance**: Implement Web Workers for better UI responsiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WebLLM](https://github.com/mlc-ai/web-llm) - For the amazing in-browser LLM inference
- [MLC LLM](https://github.com/mlc-ai/mlc-llm) - For model compilation and optimization
- [React](https://reactjs.org/) - For the UI framework
- [Vite](https://vitejs.dev/) - For the build tool
- [TailwindCSS](https://tailwindcss.com/) - For the styling

## 📞 Support

If you encounter any issues:
1. Check browser compatibility (Chrome 113+ recommended)
2. Ensure sufficient RAM and storage
3. Try a smaller model if having performance issues
4. Open an issue on GitHub for bugs or feature requests

---

**Made with ❤️ by [shivomv](https://github.com/shivomv)**
