import { useState, useRef, useEffect } from 'react'
import { CreateMLCEngine } from '@mlc-ai/web-llm'

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)

  // WebLLM state
  const [engine, setEngine] = useState(null)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [modelLoadProgress, setModelLoadProgress] = useState(0)
  const [selectedModel, setSelectedModel] = useState('Llama-3.1-8B-Instruct-q4f32_1-MLC')
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [modelError, setModelError] = useState(null)

  // Available models (subset of popular ones)
  const availableModels = [
    'Llama-3.1-8B-Instruct-q4f32_1-MLC',
    'Llama-3.2-3B-Instruct-q4f32_1-MLC',
    'Phi-3.5-mini-instruct-q4f32_1-MLC',
    'Qwen2.5-7B-Instruct-q4f32_1-MLC',
    'gemma-2-2b-it-q4f32_1-MLC'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Initialize WebLLM engine
  const initializeEngine = async (modelId) => {
    try {
      setIsModelLoading(true)
      setModelError(null)
      setModelLoadProgress(0)

      const initProgressCallback = (progress) => {
        setModelLoadProgress(Math.round(progress.progress * 100))
      }

      const newEngine = await CreateMLCEngine(
        modelId,
        { initProgressCallback }
      )

      setEngine(newEngine)
      setIsModelLoaded(true)
      setIsModelLoading(false)

      // Update the initial message to indicate the model is ready
      setMessages([{
        id: 1,
        type: 'ai',
        content: `Hello! I'm your AI assistant powered by ${modelId}. How can I help you today?`,
        timestamp: new Date()
      }])

    } catch (error) {
      console.error('Failed to initialize WebLLM engine:', error)
      setModelError(error.message)
      setIsModelLoading(false)
      setIsModelLoaded(false)
    }
  }

  // Load model on component mount
  useEffect(() => {
    initializeEngine(selectedModel)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !engine || isModelLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Prepare conversation history for the model
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      // Generate streaming response
      const chunks = await engine.chat.completions.create({
        messages: conversationHistory,
        temperature: 0.7,
        stream: true,
        stream_options: { include_usage: true }
      })

      let aiResponse = ''
      const aiMessageId = Date.now() + 1

      // Add initial empty AI message
      setMessages(prev => [...prev, {
        id: aiMessageId,
        type: 'ai',
        content: '',
        timestamp: new Date()
      }])

      // Stream the response
      for await (const chunk of chunks) {
        const deltaContent = chunk.choices[0]?.delta?.content || ''
        if (deltaContent) {
          aiResponse += deltaContent
          setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: aiResponse }
              : msg
          ))
        }
      }

      setIsTyping(false)

    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error while generating a response. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const newChat = () => {
    const welcomeMessage = isModelLoaded
      ? `Hello! I'm your AI assistant powered by ${selectedModel}. How can I help you today?`
      : 'Hello! I\'m your AI assistant. How can I help you today?'

    setMessages([
      {
        id: 1,
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date()
      }
    ])
  }

  const switchModel = async (modelId) => {
    if (modelId === selectedModel) return

    setSelectedModel(modelId)
    setIsModelLoaded(false)
    setEngine(null)
    await initializeEngine(modelId)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={newChat}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-left"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Model Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Model</h3>
              <select
                value={selectedModel}
                onChange={(e) => switchModel(e.target.value)}
                disabled={isModelLoading}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model.replace('-MLC', '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Status */}
            {isModelLoading && (
              <div className="px-3 py-2 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                <div className="text-sm text-yellow-300">Loading Model...</div>
                <div className="text-xs text-yellow-400 mt-1">
                  Progress: {modelLoadProgress}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${modelLoadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {modelError && (
              <div className="px-3 py-2 bg-red-900/20 border border-red-700 rounded-lg">
                <div className="text-sm text-red-300">Model Error</div>
                <div className="text-xs text-red-400 mt-1">{modelError}</div>
                <button
                  onClick={() => initializeEngine(selectedModel)}
                  className="mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Chat History */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Chats</h3>
              <div className="px-3 py-2 rounded-lg bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors">
                <div className="text-sm font-medium">Current Chat</div>
                <div className="text-xs text-gray-400 truncate">AI Assistant Conversation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold">AI Assistant</h1>
              {selectedModel && (
                <p className="text-xs text-gray-400">{selectedModel}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isModelLoading ? (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Loading {modelLoadProgress}%</span>
              </>
            ) : modelError ? (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Error</span>
              </>
            ) : isModelLoaded ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Ready</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Offline</span>
              </>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-600 text-white'
                  }`}>
                    {message.type === 'user' ? 'U' : 'AI'}
                  </div>

                  {/* Message Content */}
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-3xl">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-medium text-white">
                    AI
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !isModelLoaded || isModelLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-2xl transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              {isModelLoading ? (
                `Loading ${selectedModel}... ${modelLoadProgress}%`
              ) : !isModelLoaded ? (
                'Model not loaded. Please wait or check for errors.'
              ) : (
                'Press Enter to send, Shift + Enter for new line'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App