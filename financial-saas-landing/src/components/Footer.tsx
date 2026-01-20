
export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">F</span>
                            FinancialSaaS
                        </span>
                        <p className="mt-4 text-sm text-gray-500 max-w-xs">
                            Turning bank screenshots into actionable data.
                            Secure, fast, and accurate financial reporting for modern businesses and individuals.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Product</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Security</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <p className="text-base text-center text-gray-400">
                        &copy; {new Date().getFullYear()} FinancialSaaS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
