import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

const Page = () => {
    return (
        <div className="min-h-screen w-full bg-white relative">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                            radial-gradient(circle at 50% 100%, rgba(253, 224, 71, 0.4) 0%, transparent 60%),
                            radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.4) 0%, transparent 70%),
                            radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.5) 0%, transparent 80%)
                        `,
                }}
            />
            {/* Your Content/Components */}
            <div className="relative z-10">
                <Navbar />
                <HeroSection />
            </div>
        </div>
    )
}

export default Page;