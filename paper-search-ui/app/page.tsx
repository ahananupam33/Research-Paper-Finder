import { SearchProps } from "../types";
import { fetchPapers } from "./action"
import SearchResults from "../components/SearchResults";

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
      </form>

      {/* Display Search Results with AI Chat */}
      {query && papers.length > 0 ? (
        <SearchResults papers={papers} currentPage={currentPage} query={query} />
      ) : (
        <div className="text-center text-gray-500 mt-12">
          {query ? 'No papers found. Try a different search term.' : 'Enter a search term to find research papers.'}
        </div>
      )}

    </div>
  );
}
