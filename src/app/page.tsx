export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quiz Platform MVP
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Multi-language quiz platform with AI-powered results
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Development Status</h2>
            <p className="text-gray-600">
              Project scaffolding complete. Ready for module development.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
