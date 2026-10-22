export default function Loading() {
    return (
        <div
            role="status"
            aria-label="loading series"
            className="site-container animate-pulse py-12"
        >
            <div className="grid gap-8 md:grid-cols-[12rem_minmax(0,1fr)]">
                <div className="aspect-5/7 rounded-lg bg-secondary" />

                <div className="space-y-5">
                    <div className="h-10 w-3/4 rounded bg-secondary" />
                    <div className="h-4 w-1/3 rounded bg-secondary" />
                    <div className="h-24 rounded bg-secondary" />
                </div>
            </div>

            <div className="mt-12 h-48 rounded-lg bg-secondary" />
        </div>
    );
}
