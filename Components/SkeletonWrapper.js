const { Skeleton } = require("./ui/skeleton");

export default function SkeletonWrapper({
  children,
  isLoading,
  fullWidth = true,
}) {
  if (!isLoading) {
    return children;
  }
  return (
    <Skeleton className={`${fullWidth ? "w-full" : ""}`}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
