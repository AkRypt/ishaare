export default function HowToPlayModal({ show, onClose }: { show: boolean, onClose: () => void }) {

    return (
        <div>
            {show && (
                <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-900 bg-opacity-50">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute w-full h-full" onClick={onClose}></div>
                        <div className="bg-primary-bg p-4 w-[90%] md:max-w-max rounded-lg shadow-2xl relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="absolute top-4 right-4 w-6 h-6 cursor-pointer" onClick={onClose}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <h1 className="text-3xl font-bold mb-4">How to Play</h1>
                            <p className="text-lg">1. Choose a topic</p>
                            <p className="text-lg">2. Hold the Phone in front of you</p>
                            <p className="text-lg">3. Your friends will describe or act the word out</p>
                            <p className="text-lg">4. You will have to guess the word</p>
                            <p className="text-lg">5. Tap the top part of your phone to skip the word</p>
                            <p className="text-lg">6. Tap the bottom part of your phone to guess the word</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}