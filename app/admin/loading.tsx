export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      <p className="text-lg font-semibold text-gray-600">Loading, please wait...</p>
    </div>
  );
}