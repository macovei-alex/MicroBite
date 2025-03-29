export default function MenuSkeleton() {
  return (
    <div className="flex flex-col gap-10 p-6 mt-2">
      <div className="bg-gray-200 w-40 h-8 animate-pulse rounded-lg self-center" />
      <div className="flex flex-row gap-10 justify-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-15 w-35 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-55 w-full bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
