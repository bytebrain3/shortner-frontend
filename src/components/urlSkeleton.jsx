// Add this component before your main URLDashboard component
const URLCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-4 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center">
          <div className="h-6 w-20 bg-muted rounded mr-2"></div>
          <div className="h-5 w-16 bg-muted rounded"></div>
        </div>
        <div className="flex items-center mt-2">
          <div className="h-4 w-4 bg-muted rounded mr-2"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
      <div className="flex flex-col md:items-end">
        <div className="h-4 w-48 bg-muted rounded"></div>
        <div className="flex items-center mt-2">
          <div className="h-8 w-20 bg-muted rounded mr-2"></div>
          <div className="h-8 w-32 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default URLCardSkeleton;
