export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full-animate-spin" />
                <p className="text-lg font-medium text-gray-600">
                    Searching the web for research work....
                </p>
            </div>

            <div className="mt-8 space-y-4 opacity-50">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
                ))}
            </div>
        </div>
    );
}