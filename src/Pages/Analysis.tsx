import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Upload,
    Camera,
    RotateCcw,
    Volume2,
    FileText,
    CheckCircle,
    Loader2,
    ArrowLeft,
    Brain,
    Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { medicineInfo } from '@/hooks/getInfo';
import { cleanMarkdownData } from '@/utils/cleanMarkdown';
import { cleanOCRTextData } from '@/utils/cleanOCRText';
import AudioSection from '@/components/AudioExplanationSection';
import ErrorDialog from '@/components/ErrorDialog';
import type { Error } from '@/utils/AppInterfaces';
import LanguageSelectionBox from '@/components/LanguageSelectionBox';
import AnalyzeLoader from '@/components/AnalyzeLoader';
import TextExplanationSection from '@/components/TextExplanationSection';
import SafetySection from '@/components/SafetySection';
import logo from '@/assets/logo.png';

const Analysis = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [medicineName, setMedicineName] = useState<string>('');
    const [medicineData, setMedicineData] = useState<string>('');
    const [audioLanguage, setAudioLanguage] = useState<string>('');
    const [audioExplanation, setAudioExplanation] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<boolean>(false);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [textContentLoading, setTextContentLoading] = useState<boolean>(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resultSectionRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { getMedicineInfo, getMedicineInfoVoice } = medicineInfo;

    useEffect(() => {
        if (analysisResult && resultSectionRef.current) {
            resultSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [analysisResult]);

    const handleFileSelect = (file: File) => {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setAnalysisResult(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        }
    };

    const resetImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setAnalysisResult(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;
        if (!audioLanguage) {
            setError({
                title: "No language selected",
                description: "Please select an audio language to proceed"
            });
            setIsErrorDialogOpen(true);
            return;
        }
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'image/png',
        }

        setIsAnalyzing(true);
        setTextContentLoading(true);

        try {
            const compressedFile = await imageCompression(selectedImage, options);
            const formData = new FormData();
            formData.append("file", compressedFile);
            formData.append("language", "auto");
            formData.append("isOverlayRequired", "false");
            formData.append("filetype", "png");
            formData.append("OCREngine", "2");

            try {
                const ocrResponse = await axios.post(
                    "https://api.ocr.space/parse/image",
                    formData,
                    {
                        headers: {
                            apikey: import.meta.env.VITE_OCR_API_KEY,
                            "Content-Type": "multipart/form-data",
                        }
                    }
                )

                // console.log(ocrResponse.data);
                const ocrText: string = ocrResponse.data.ParsedResults[0].ParsedText;
                const cleanText: string | null = cleanOCRTextData(ocrText);
                // console.log(cleanText);
                if (cleanText != null) {
                    setMedicineName(cleanText);
                    try {
                        const languageInfo = audioLanguage.split(" ");
                        const medicineInfo = await getMedicineInfo(cleanText, languageInfo[2]);
                        const cleanMedicineInfo = cleanMarkdownData(medicineInfo);
                        const medicineInfoVoice = await getMedicineInfoVoice(cleanMedicineInfo, languageInfo[0], languageInfo[1]);
                        setMedicineData(medicineInfo);
                        setAudioExplanation(medicineInfoVoice);
                        setTextContentLoading(false);
                        setAnalysisResult(true);
                        setIsAnalyzing(false);
                    } catch (error: unknown) {
                        if (axios.isAxiosError(error)) {
                            setError({
                                title: "Something went wrong",
                                description: "The service is temporarily unavailable. Please try again later."
                            });
                            console.error(error);
                        } else if (error instanceof Error) {
                            setError({
                                title: "Something went wrong",
                                description: "The service is temporarily unavailable. Please try again later."
                            });
                        } else {
                            setError({
                                title: "Something went wrong",
                                description: "Please try again after sometime"
                            });
                        }
                        setAnalysisResult(false);
                        setIsAnalyzing(false);
                        setIsErrorDialogOpen(true);
                    }
                }
            } catch (error: unknown) {
                setError({
                    title: "Something went wrong",
                    description: "Failed to process the image, please provide a clear image"
                })
                setAnalysisResult(false);
                setIsAnalyzing(false);
                setIsErrorDialogOpen(true);
            }
        } catch (error) {
            setError({
                title: "Something went wrong",
                description: "Failed to process the image, please provide a clear image"
            })
            setAnalysisResult(false);
            setIsAnalyzing(false);
            setIsErrorDialogOpen(true);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-amber-100">
                {/* Header */}
                <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-16">
                            <Button
                                onClick={() => navigate('/')}
                                variant="ghost"
                                className="mr-4 font-roboto"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div className="flex items-center space-x-2">
                                <img src={logo} className='w-8' alt="HearMedi Logo" />
                                <span className="text-xl font-oswald font-bold text-gray-900">HearMedi</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Upload Section */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Camera className="w-6 h-6 mr-2 text-amber-600" />
                                    <span className='font-noto font-semibold text-slate-950'>Upload Medicine Image</span>
                                </CardTitle>
                                <CardDescription className='font-noto'>
                                    Take a clear photo of your medication or upload an existing image for AI analysis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!imagePreview ? (
                                    <motion.div
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${isDragOver
                                            ? 'border-amber-400 bg-amber-100'
                                            : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="space-y-4">
                                            <motion.div
                                                className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto"
                                                animate={{ rotate: isDragOver ? 360 : 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Upload className="w-8 h-8 text-amber-600" />
                                            </motion.div>
                                            <div>
                                                <p className="text-lg font-noto font-medium text-slate-950">
                                                    {isDragOver ? 'Drop your image here' : 'Click to upload or drag and drop'}
                                                </p>
                                                <p className="text-gray-500 font-noto">PNG, JPG, JPEG up to 10MB</p>
                                            </div>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInputChange}
                                            className="hidden"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Selected medicine"
                                                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={resetImage}
                                                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm font-noto text-slate-950"
                                            >
                                                <RotateCcw className="w-4 h-4 mr-1" />
                                                Change
                                            </Button>
                                        </div>
                                        <div className='text-center'>
                                            <p className="text-sm font-noto text-slate-600 mb-4">
                                                Image ready for analysis • {selectedImage?.name}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                                <div className='w-full flex flex-col items-start justify-start mt-5 space-y-4'>
                                    <div className='flex items-center'>
                                        <Languages className="w-6 h-6 mr-2 text-amber-600" />
                                        <span className='font-noto font-semibold text-slate-950 flex'>Select Your Preffered Language</span>
                                    </div>
                                    <LanguageSelectionBox
                                        audioLanguage={audioLanguage}
                                        setAudioLanguage={setAudioLanguage}
                                    />
                                </div>
                                <SafetySection />
                                {imagePreview && <div className="text-center">
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing}
                                        className="bg-slate-950 hover:bg-slate-900 cursor-pointer font-noto font-normal mt-10"
                                        size="lg"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Brain className="w-5 h-5 mr-2" />
                                                Start AI Analysis
                                            </>
                                        )}
                                    </Button>
                                </div>}
                            </CardContent>
                        </Card>

                        {/* Analysis Progress */}
                        <AnimatePresence>
                            {isAnalyzing && (
                                <AnalyzeLoader />
                            )}
                        </AnimatePresence>
                        {/*Result Section */}
                        <AnimatePresence>
                            {analysisResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <Card ref={resultSectionRef}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                                                <span className='text-slate-950 font-noto font-semibold'>Analysis Complete</span>
                                            </CardTitle>
                                            <CardDescription className='font-noto max-[400px]:text-xs'>
                                                AI has successfully identified your medication
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <h3 className="text-xl font-noto font-bold text-green-900 mb-2 max-[425px]:text-base max-[400px]:text-xs">
                                                    {medicineName}
                                                </h3>
                                            </div>

                                            <Tabs defaultValue="audio" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="audio" className="flex font-noto items-center max-[400px]:text-xs">
                                                        <Volume2 className="w-4 h-4 mr-2 max-[375px]:hidden" />
                                                        Audio Explanation
                                                    </TabsTrigger>
                                                    <TabsTrigger value="text" className="flex font-noto items-center max-[400px]:text-xs">
                                                        <FileText className="w-4 h-4 mr-2 max-[375px]:hidden" />
                                                        Text Results
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="text" className="space-y-6">
                                                    <TextExplanationSection
                                                        contentLoading={textContentLoading}
                                                        text={medicineData}
                                                    />
                                                </TabsContent>

                                                <TabsContent value="audio">
                                                    <AudioSection audio={audioExplanation} />
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
            <ErrorDialog isDialogOpen={isErrorDialogOpen} setIsDialogOpen={setIsErrorDialogOpen} error={error} />
        </>
    )
}

export default Analysis;