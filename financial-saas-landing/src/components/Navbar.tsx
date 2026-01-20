
export default function Navbar() {
    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-[#0F52BA] flex items-center justify-center text-white font-bold">F</span>
                            FinancialSaaS
                        </span>
                    </div>
                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
                        <a href="#features" className="text-gray-500 hover:text-[#0F52BA] px-3 py-2 text-sm font-medium transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-500 hover:text-[#0F52BA] px-3 py-2 text-sm font-medium transition-colors">How it Works</a>
                        <a href="#" className="px-4 py-2 rounded-md bg-[#0F52BA] text-white text-sm font-bold hover:bg-[#0047AB] transition-colors shadow-sm">
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
