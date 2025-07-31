import { AlertTriangle } from "lucide-react";

const SafetySection = () => {
    return (
        <section className="py-2 bg-amber-50 rounded-sm border-y border-amber-200 mt-4">
            <div className="mx-auto px-4">
                <div className="flex items-start space-x-4 max-[425px]:flex-col">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="size-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-noto font-semibold text-amber-900 mb-2 max-[375px]:text-sm">Important Medical Disclaimer</h3>
                        <p className="text-amber-800 text-sm font-noto leading-relaxed">
                            This AI tool is designed for informational purposes only and should not replace professional medical advice, diagnosis, or treatment.
                            Always consult with qualified healthcare professionals before making any decisions about medications. In case of medical emergencies,
                            contact emergency services immediately.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SafetySection;