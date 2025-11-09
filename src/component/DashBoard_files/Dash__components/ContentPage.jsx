export default function ContentArea({ loading, error, content }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-4rem)]">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>Error: {error.message || "Failed to load data"}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <span className="mr-3">{content.icon}</span>
            <h1 className="text-2xl font-bold text-gray-900">
              {content.title}
            </h1>
          </div>
          
          <p className="text-gray-600 mb-6">{content.body}</p>
          
          {content.remoteData && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p>{content.remoteData.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {content.remoteData.lastUpdated}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}