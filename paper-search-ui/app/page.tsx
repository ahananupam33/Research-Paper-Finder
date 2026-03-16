import { Paper, SearchProps } from "../types";
import PaperCard from "../components/PaperCard";
import { fetchPapers } from "./action"
import Link from "next/link";

export default async function HomePage({ searchParams }: SearchProps) {

  const params = await searchParams;
  const query = params.query || '';
  const sort = params.sort || 'newest';
  const currentPage = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '10');
  const papers = query ? await fetchPapers(query, sort, currentPage, limit) : [];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Research Paper Finder</h1>

      {/* Search Input */}
      <form action="/" method="GET" className="mb-8">
        <input 
          name="query"
          placeholder="Enter keywords (e.g. 'Quantum Computing)"
          className="border p-2 rounded w-full text-black"
        />
        {/* Sorting menu */}
        <div className="flex items-center gap-2 text-sm">
          {/* <label className="font-semibold text-gray-700">Sort by:</label>
          <select
            name="sort"
            defaultValue={sort}
            className="border p-2 rounded-lg bg-white"
          >
            <option value="newest">Most Recent</option>
            <option value="oldest">Least Recent</option>
            <option value="citations">Most Citations</option>
          </select> */}

          {/* Limit setting menu */}
          {/* <label>Show:</label>
          <select
            name="limit"
            defaultValue={limit}
            className="border p-2 rounded"
            onChange={(e) => e.target.form?.requestSubmit()}
          >
            <option value="10">10 results</option>
            <option value="20">20 results</option>
            <option value="50">50 results</option>
          </select> */}
        </div>
      </form>

      {/* Display Search Results */}
      <div className="space-y-6">
        {papers.map((paper: Paper) => (
          <PaperCard key={paper.url} paper={paper} />
        ))}
      </div>

      {/* Pagination Controls */}
      {query && papers.length > 0 && (
        <div className="flex justify-center gap-4 mt-12">
          <Link
            href={`/?query=${query}&sort=${sort}&limit=${limit}&page=${currentPage-1}`}
            className={`px-4 py-2 border rounded ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
          >Previous</Link>
          <span className="py-2 font-bold">Page {currentPage}</span>
          <Link
            href={`/?query=${query}&sort=${sort}&limit=${limit}&page=${currentPage+1}`}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >Next</Link>
        </div>
      )}

    </div>
  );
}
