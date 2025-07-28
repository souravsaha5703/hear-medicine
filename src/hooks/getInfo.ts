import axios from "axios";

const getMedicineInfo = async (medicineName: string) => {
    const response = await fetch(`${import.meta.env.VITE_A4F_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_A4F_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: import.meta.env.VITE_AI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a medical assistant. Provide only factual, verified medicine information. If unsure, say 'Information not available.'",
                },
                {
                    role: "user",
                    content: `Give me detailed information about "${medicineName}" in the followin format: 1. Uses, 2. Dosage (Adults and Children), 3. Common Side Effects, 4. Warnings (Pregnancy, Elderly, Liver/Kidney patients)`
                },
            ],
        }),
    });
    const data = await response.json();
    return data.choices[0].message.content;
}

const getMedicineInfoVoice = async (medicineData: string) => {
    const data = {
        text: medicineData,
        voiceId: "en-US-terrell",
    }
    const response = await axios.post("https://api.murf.ai/v1/speech/generate", data, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "api-key": import.meta.env.VITE_MURF_API_KEY,
        },
    })
    return response.data.audioFile;
}

export const medicineInfo = {
    getMedicineInfo,
    getMedicineInfoVoice
};