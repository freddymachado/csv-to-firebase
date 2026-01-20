
export default function CTA() {
    return (
        <section className="py-24 bg-white dark:bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-[#0F52BA] px-6 py-16 shadow-2xl sm:px-16 md:pt-20 md:pb-20 lg:px-24">
                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                            Ready to automate your finances?
                        </h2>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
                            Join the waitlist today and get 3 months of premium features for free when we launch.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <a href="#" className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-700 hover:bg-blue-50 sm:px-8 sm:py-4 sm:text-lg font-bold">
                                Get Early Access
                            </a>
                        </div>
                    </div>

                    {/* Abstract circles */}
                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply opacity-50 filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply opacity-50 filter blur-3xl"></div>
                </div>
            </div>
        </section>
    );
}
