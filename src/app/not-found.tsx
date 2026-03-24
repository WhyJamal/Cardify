import CardifyLogo from "@/shared/components/logo";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#202124] flex items-center justify-center font-sans px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">

                <div className="max-w-md text-center md:text-left">
                    <div className="mb-6">
                        <CardifyLogo />
                    </div>

                    <p className="text-[#bdc1c6] text-base mb-4">
                        <strong className="text-[#e8eaed]">404.</strong>{" "}
                        That's an error.
                    </p>

                    <p className="text-[#bdc1c6] text-sm mb-2 leading-relaxed">
                        The requested URL{" "}
                        <code className="bg-[#2d2f31] px-2 py-0.5 rounded text-[#8ab4f8] text-sm">
                            /content/
                        </code>{" "}
                        was not found on this server.
                    </p>

                    <p className="text-[#9aa0a6] text-sm">
                        That's all we know.
                    </p>
                </div>

                <div className="flex items-center justify-center min-w-50">
                    <Image
                        src="/images/errors/robot_.png"
                        alt="robot"
                        width={220}
                        height={220}
                        priority
                        className="opacity-90"
                    />
                </div>

            </div>
        </div>
    );
}



