export default function ChartSkeleton() {
  return (
    <div className="flex bg-transparent mx-auto min-w-52 w-full">
      <div className="flex animate-pulse min-w-52 w-full">
        <div className="flex min-w-52 w-full space-x-2 items-baseline m-4">
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          <div className="flex-1 h-12 bg-gray-300 rounded"></div>
          <div className="flex-1 h-24 bg-gray-400 rounded"></div>
          <div className="flex-1 h-14 bg-gray-300 rounded"></div>
          <div className="flex-1 h-20 bg-gray-300 rounded"></div>
          <div className="flex-1 h-32 bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  );
}
