export const ToolSkeleton = () => {
  return (
    <div className="stream-ignore flex flex-col items-start gap-1 !animate-in !fade-in !opacity-100 !duration-1000">
      <div className="h-[15px] w-full max-w-[90%] rounded-sm bg-stone-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50 to-transparent animate-wave"></div>
      </div>
      <div className="h-[15px] w-full max-w-[50%] rounded-sm bg-stone-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50 to-transparent animate-wave"></div>
      </div>
    </div>
  );
};
