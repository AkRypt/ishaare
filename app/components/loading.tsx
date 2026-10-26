export function Loading() {
    return (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-brand-deep/45 backdrop-blur-[2px]">
            <div
                className="w-12 h-12 rounded-full border-[3px] border-white/25 border-t-action-bg animate-spin"
                role="status"
                aria-label="Loading"
            />
        </div>
    )
}
