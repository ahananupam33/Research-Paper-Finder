'use client'

import { useState } from 'react'
import { Paper } from '@/types'
import PaperCard from './PaperCard'
import ChatbotSidebar from './ChatbotSidebar'

interface SearchResultsProps {
  papers: Paper[];
  currentPage: number;
  query: string;
}

export default function SearchResults({ papers, currentPage, query }: SearchResultsProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [selectedPaperIndex, setSelectedPaperIndex] = useState<number | null>(null)

  const handleAskAI = (paper: Paper, index: number) => {
    if (selectedPaper?.paper_id === paper.paper_id) {
      // Same paper - just toggle sidebar
      setIsChatOpen(!isChatOpen)
    } else {
      // Different paper - switch context and open sidebar
      setSelectedPaper(paper)
      setSelectedPaperIndex(index)
      setIsChatOpen(true)
    }
  }

  return (
    <>
      {/* Floating Chat Button - Always visible in top-right */}
      {selectedPaper && (
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed top-4 right-4 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center text-2xl"
          title="Open AI Chat"
        >
          💬
        </button>
      )}

      {/* Paper Cards */}
      <div className="space-y-6">
        {papers.map((paper, index) => (
          <PaperCard
            key={paper.url}
            paper={paper}
            onAskAI={(p) => handleAskAI(p, index)}
            isSelected={selectedPaper?.paper_id === paper.paper_id || selectedPaper?.url === paper.url}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-12">
        <a
          href={`?query=${query}&page=${currentPage - 1}`}
          className={`bg-white border p-2 rounded ${
            currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'
          }`}
        >
          Previous
        </a>
        <span className="p-2">Page {currentPage}</span>
        <a href={`?query=${query}&page=${currentPage + 1}`} className="bg-white border p-2 rounded hover:bg-gray-50">
          Next
        </a>
      </div>

      {/* Chatbot Sidebar */}
      <ChatbotSidebar
        selectedPaper={selectedPaper}
        selectedPaperIndex={selectedPaperIndex}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  )
}
