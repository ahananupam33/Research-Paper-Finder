'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatbotSidebarProps, Message, Paper } from '@/types'
import { sendChatMessage } from '@/app/actions/chatAction'

export default function ChatbotSidebar({
  selectedPaper,
  selectedPaperIndex,
  isOpen,
  onClose
}: ChatbotSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Reset conversation when paper changes
  useEffect(() => {
    setMessages([])
  }, [selectedPaper?.paper_id])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (messageText: string, action?: string) => {
    if (!messageText.trim() || !selectedPaper || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendChatMessage(
        messageText,
        selectedPaper,
        messages,
        action || 'answer'
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure Ollama is running locally (ollama serve) and try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    let message = ''
    switch (action) {
      case 'explain':
        message = 'Please explain this research paper in simple terms.'
        break
      case 'compare':
        message = 'What are the key contributions of this paper?'
        break
      case 'suggest':
        message = 'Can you suggest related research topics based on this paper?'
        break
    }
    handleSendMessage(message, action)
  }

  if (!selectedPaper) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-700 text-white">
          <h2 className="text-lg font-bold">AI Research Assistant</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Paper Context Card */}
        <div className="p-4 border-b bg-blue-50">
          <div className="text-xs text-gray-600 mb-1">
            Selected Paper {selectedPaperIndex !== null ? `${selectedPaperIndex + 1} of 10` : ''}
          </div>
          <h3 className="font-bold text-sm text-blue-900 mb-1 line-clamp-2">
            {selectedPaper.title}
          </h3>
          <p className="text-xs text-gray-600 mb-1">
            {selectedPaper.authors.slice(0, 3).join(', ')}
            {selectedPaper.authors.length > 3 && ' et al.'}
          </p>
          <p className="text-xs text-gray-500 line-clamp-2">
            {selectedPaper.abstract.substring(0, 150)}...
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <div className="text-4xl mb-2">🤖</div>
              <p className="text-sm">Ask me anything about this paper!</p>
              <p className="text-xs mt-2">Try the quick actions below</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="text-xs text-gray-600 mb-2">Quick Actions:</div>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickAction('explain')}
              disabled={isLoading}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📝 Explain
            </button>
            <button
              onClick={() => handleQuickAction('compare')}
              disabled={isLoading}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⚖️ Key Points
            </button>
            <button
              onClick={() => handleQuickAction('suggest')}
              disabled={isLoading}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔍 Related Topics
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(input)
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-900 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
