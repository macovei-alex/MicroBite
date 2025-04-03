export default function OrderHistorySkeleton() {
    return (
      <div className="p-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between mb-4">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-56"></div>
            </div>
  
            <div className="border-t pt-4 mt-4">
              <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
              {[...Array(2)].map((_, j) => (
                <div key={j} className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }