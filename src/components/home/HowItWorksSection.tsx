import { steps } from "./home-data";

export default function HowItWorksSection() {
    return (
        <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Amonzan hoạt động như thế nào?
                    </h2>
                    <p className="mt-4 text-gray-500">
                        Chỉ với 4 bước đơn giản để có một diện mạo hoàn hảo
                    </p>
                </div>

                <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="absolute left-0 top-8 -z-10 hidden h-0.5 w-full bg-gray-200 md:block" />

                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.title}
                                className="relative flex flex-col items-center rounded-sm border border-gray-200 bg-white p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border-none md:bg-transparent md:p-0 md:shadow-none"
                            >
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-[#131921] text-[#FF9900] shadow-md ring-4 ring-white">
                                    <Icon className="h-8 w-8" />
                                </div>

                                <h3 className="mb-2 text-lg font-bold text-gray-900">
                                    <span className="mr-2 text-[#FF9900]">{index + 1}.</span>
                                    {step.title}
                                </h3>

                                <p className="text-sm text-gray-500">{step.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}