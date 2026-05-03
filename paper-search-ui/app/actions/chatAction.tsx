'use server'

import { Paper, Message } from '@/types'

export async function sendChatMessage(
  message: string,
  paper: Paper,
  conversationHistory: Message[],
  action: string = 'answer'
): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        paper: {
          paper_id: paper.paper_id || '',
          title: paper.title,
          authors: paper.authors,
          abstract: paper.abstract,
          published_date: paper.published_date,
          categories: paper.categories || [],
        },
        conversation_history: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        action
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Failed to get AI response')
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Chat API error:', error)
    throw error
  }
}
