import { Paper } from '../types';

interface PaperCardProps {
    paper: Paper;
}

export default function
PaperCard({ paper }: PaperCardProps) {
    return (
        <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
            {/* 1. Title */}
            <h2 className="text-xl font-bold text-blue-700 mb-2">
                <a href={paper.url} target="_blank" rel="noopener noreferrer">
                    {paper.title}
                </a>
            </h2>

            {/* 2. Authors */}
            <p className="text-sm text-gray-600 mb-2">
                By: {paper.authors.join(', ')}
            </p>

            {/* 3. Metadata (Citations and Date) */}
            <div className="flex gap-4 text-xs font-medium text-gray-500 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded">
                    {paper.published_date}
                </span>
                <span className="bg-blue-50 px-2 py-1 rounded">
                    {paper.citationCount} Citations
                </span>
            </div>

            {/* 4. Abstract */}
            <p className="text-gray-700 line-clamp-3 text-sm">
                {paper.abstract}
            </p>
        </div>
    );
}