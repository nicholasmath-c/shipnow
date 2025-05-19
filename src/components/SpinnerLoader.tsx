export default function SPLoader() {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
  );
}

export function SPLoaderXS() {
  return (
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
  );
}

export function SPLoaderInCard() {
  return (
    <div className="flex flex-col items-center mt-24">
      <SPLoader />
    </div>
  );
}
