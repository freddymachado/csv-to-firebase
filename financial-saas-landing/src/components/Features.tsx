
export default function Features() {
    const features = [
        {
            title: "99% + Accuracy",
            description: "Our AI is trained on millions of financial documents to ensure every number and decimal is captured correctly."
        },
        {
            title: "Bank-Grade Security",
            description: "Your data is encrypted end-to-end. We never store your screenshots longer than necessary to process them."
        },
        {
            title: "Multi-Currency Support",
            description: "Works with USD, EUR, GBP, and 30+ other currencies including crypto portfolio screenshots."
        },
        {
            title: "Smart Categorization",
            description: "Transactions are automatically tagged (Food, Transport, Utilities) so you can see your spending habits instantly."
        },
        {
            title: "Universal Export",
            description: "Export to .XLSX, .CSV, .PDF or directly to Google Sheets."
        },
        {
            title: "Mobile First",
            description: "Designed to work perfectly on your phone, so you can upload screenshots the moment you take them."
        }
    ];

    return (
        <section className="py-24 bg-slate-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Everything you need for perfect records
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                        Powerful features built for accuracy and speed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
