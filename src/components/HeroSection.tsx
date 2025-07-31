import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from 'motion/react';
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center">
                    <div className="inline-flex items-center gap-2 bg-slate-50 rounded-full px-5 py-3 text-sm text-slate-950 font-noto font-medium border border-accent/30 mb-10 max-[425px]:text-sm">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Medicine Assistant
                    </div>
                    <TextAnimate animation="blurInUp" by="character" once className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-slate-950 font-semibold font-roboto text-center leading-tight tracking-tight max-[350px]:text-2xl">
                        Your medicine explained
                    </TextAnimate>
                    <TextAnimate animation="blurInUp" by="character" once className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-slate-950 font-semibold font-roboto text-center leading-tight tracking-tight max-[350px]:text-2xl">
                        in a human voice
                    </TextAnimate>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-base sm:text-lg lg:text-xl text-center font-normal font-noto text-slate-800 max-w-xl mx-auto my-5 max-[375px]:text-sm">
                        Simply capture a photo of your medicine and get instant, clear audio explanations about usage, dosage, and important safety information.
                    </motion.p>
                    <div className="flex items-center justify-center max-[425px]:mt-5">
                        <Button onClick={() => navigate('/analysis')} className="w-60 h-12 text-lg bg-slate-50 text-slate-950 hover:bg-slate-200 font-noto font-medium cursor-pointer max-[375px]:h-11">Try it now</Button>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-5 max-[425px]:mt-10">
                        <div className="flex items-center gap-2 my-1 max-[513px]:my-0">
                            <div className="size-2 bg-pink-500 rounded-full"></div>
                            <span className="font-normal font-noto text-sm text-slate-950">Hight Identification Accuracy</span>
                        </div>
                        <div className="flex items-center gap-2 my-1 max-[513px]:my-0">
                            <div className="size-2 bg-purple-500 rounded-full"></div>
                            <span className="font-normal font-noto text-sm text-slate-950">Audio explanations in multiple languages</span>
                        </div>
                        <div className="flex items-center gap-2 my-1 max-[513px]:my-0">
                            <div className="size-2 bg-green-500 rounded-full"></div>
                            <span className="font-normal font-noto text-sm text-slate-950">User friendly explanations</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;