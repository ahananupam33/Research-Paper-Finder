'use server'

export async function fetchPapers(query: string, sort: string, currentPage: number, limit: number) {
    const response = await fetch(
        `https://research-paper-finder-lxa9.onrender.com/api/search?query=${query}&sort=${sort}&start=${currentPage}&total_results=${limit}`,
        {
            cache: 'no-store'
        }
    );
    if (!response.ok)
        throw new Error("Failed to fetch any research papers.");
    return response.json();
}