'use client'

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Reviews</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">0.0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Positive Reviews</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Urgent Reviews</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h2>
        <p className="text-gray-600 mb-4">
          Welcome to Review Manager! Here's what you can do:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Add your business in Settings</li>
          <li>Connect your review platforms (Google, Yelp)</li>
          <li>View and respond to customer reviews</li>
          <li>Use AI to generate professional responses</li>
          <li>Track analytics and ratings</li>
        </ul>
      </div>
    </div>
  )
}
