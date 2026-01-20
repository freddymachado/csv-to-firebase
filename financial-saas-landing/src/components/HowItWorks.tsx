
export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Snap a Screenshot",
            description: "Take a screenshot of your bank transaction list, credit card statement, or investment portfolio directly from your phone or apps."
        },
        {
            number: "02",
            title: "Upload & Extract",
            description: "Upload the image to our secure platform. Our advanced AI instantly analyzes the image and identifies every transaction detail."
        },
        {
            number: "03",
            title: "Export Report",
            description: "Download your clean, organized data as a CSV, Excel, or PDF report ready for your accountant or personal finance tool."
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        How it Works
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                        Three simple steps to financial organization.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-50 dark:border-gray-800 flex items-center justify-center mb-6 group-hover:border-blue-500 transition-colors shadow-sm">
                                <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">{step.number}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
