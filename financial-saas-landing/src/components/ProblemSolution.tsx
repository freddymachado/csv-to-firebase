
export default function ProblemSolution() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Why struggle with spreadsheets?
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                        Recover hours of your time and eliminate human error.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* The Old Way */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold">
                                ✕
                            </span>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">The Old Way</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Manually typing numbers from screenshots</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Hours lost to data entry every month</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Typos and calculation errors</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Scattered receipts and lost tracking</span>
                            </li>
                        </ul>
                    </div>

                    {/* The New Way */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border-2 border-blue-500 relative transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                            RECOMMENDED
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                                ✓
                            </span>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">The Smart Way</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <span className="text-green-500 mt-1 font-bold">✓</span>
                                <span>Instant upload & AI extraction</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <span className="text-green-500 mt-1 font-bold">✓</span>
                                <span>Done in seconds, not hours</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <span className="text-green-500 mt-1 font-bold">✓</span>
                                <span>99% + Accuracy guaranteed</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <span className="text-green-500 mt-1 font-bold">✓</span>
                                <span>Auto-categorized & export ready</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
