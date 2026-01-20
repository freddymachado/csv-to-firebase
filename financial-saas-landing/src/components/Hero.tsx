
export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-32 pb-16 lg:pt-48 lg:pb-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        <span className="block text-[#0F52BA]">Financial Clarity</span>
                        <span className="block">from your Screenshots</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-500 dark:text-gray-400">
                        Stop manual data entry. Instantly extract transactions from your bank app screenshots into Excel, CSV, or PDF reports with 99% accuracy.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <a href="#get-started" className="px-8 py-3 text-base font-medium rounded-md text-white bg-[#0F52BA] hover:bg-[#0047AB] md:py-4 md:text-lg md:px-10 transition-colors">
                            Get Early Access
                        </a>
                        <a href="#how-it-works" className="px-8 py-3 text-base font-medium rounded-md text-[#0F52BA] bg-blue-50 hover:bg-blue-100 md:py-4 md:text-lg md:px-10 transition-colors dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700">
                            How it Works
                        </a>
                    </div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </section>
    );
}
