const BookCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-48 rounded-none" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-1/3" />
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="card p-5 flex items-center gap-4">
    <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
    <div className="space-y-2 flex-1">
      <div className="skeleton h-6 w-16" />
      <div className="skeleton h-3 w-24" />
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <div className="skeleton w-20 h-20 rounded-full" />
      <div className="space-y-2">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-3 w-56" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="skeleton h-24 rounded-2xl" />
      <div className="skeleton h-24 rounded-2xl" />
      <div className="skeleton h-24 rounded-2xl" />
      <div className="skeleton h-24 rounded-2xl" />
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-4 w-72" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export { BookCardSkeleton, StatCardSkeleton, ProfileSkeleton, PageSkeleton };
export default BookCardSkeleton;
