
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUploader from "@/components/FileUploader";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black selection:bg-blue-100 selection:text-blue-900 flex flex-col">
            <Navbar />

            <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                            Upload Transactions
                        </h1>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                            Upload your bank screenshots, PDF statements, or CSV files here.
                            Our AI will process them and add them to your database.
                        </p>
                    </div>

                    <FileUploader />

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Supported Formats</h3>
                            <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                                <li>Images (PNG, JPG, HEIC)</li>
                                <li>PDF Statements</li>
                                <li>Excel (.xlsx)</li>
                                <li>CSV Files</li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Processing Time</h3>
                            <p className="text-sm text-gray-500">
                                Most files are processed within 10-30 seconds. You will receive a notification when the data is ready.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
