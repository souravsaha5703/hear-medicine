import { useState, useRef } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { medicineInfo } from '@/hooks/getInfo';
import ReactMarkdown from "react-markdown";
import { cleanMarkdownData } from '@/utils/cleanMarkdown';
import { cleanOCRTextData } from '@/utils/cleanOCRText';
import AudioSection from '@/components/audioSection';

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { getMedicineInfo, getMedicineInfoVoice } = medicineInfo;

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
                    } catch (error) {
                        console.error(error);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setAnalysisResult(true);
            setIsAnalyzing(false);
        }

    };

    return (
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
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
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
                                <Select value={audioLanguage} onValueChange={(value) => setAudioLanguage(value)}>
                                    <SelectTrigger className="w-[280px] font-noto">
                                        <SelectValue placeholder="Choose language" />
                                    </SelectTrigger>
                                    <SelectContent className='font-noto text-slate-900 font-normal'>
                                        <SelectItem value="en-US-natalie Narration English">English - US & Canada</SelectItem>
                                        <SelectItem value="en-UK-theo Narration English">English - UK</SelectItem>
                                        <SelectItem value="fr-FR-adélie Conversational French">French - France</SelectItem>
                                        <SelectItem value="de-DE-lia Conversational German">German - Germany</SelectItem>
                                        <SelectItem value='es-ES-elvira Conversational Spanish'>Spanish - Spain</SelectItem>
                                        <SelectItem value='it-IT-greta Conversational Italian'>Italian - Italy</SelectItem>
                                        <SelectItem value='zh-CN-jiao Conversational Chinese'>Chinese - China</SelectItem>
                                        <SelectItem value='nl-NL-dirk Conversational Dutch'>Dutch - Netherlands</SelectItem>
                                        <SelectItem value='ja-JP-denki Conversational Japanese'>Japanese - Japan</SelectItem>
                                        <SelectItem value='hi-IN-ayushi Conversational Hindi'>Hindi - India</SelectItem>
                                        <SelectItem value='ta-IN-iniya Conversational Tamil'>Tamil - India</SelectItem>
                                        <SelectItem value='bn-IN-anwesha General Bengali'>Bengali - India</SelectItem>
                                        <SelectItem value='ko-KR-gyeong Conversational Korean'>Korean - Korea</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8"
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                                            <div>
                                                <p className="font-medium font-noto text-slate-950">AI Analysis in Progress</p>
                                                <p className="text-sm text-slate-600 font-noto">Processing image and identifying medication...</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-slate-200 rounded-full h-2">
                                            <motion.div
                                                className="bg-amber-600 h-2 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 3, ease: "easeInOut" }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
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
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                                            <span className='text-slate-950 font-noto font-semibold'>Analysis Complete</span>
                                        </CardTitle>
                                        <CardDescription className='font-noto'>
                                            AI has successfully identified your medication
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <h3 className="text-xl font-noto font-bold text-green-900 mb-2">
                                                {medicineName}
                                            </h3>
                                        </div>

                                        <Tabs defaultValue="audio" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="audio" className="flex font-noto items-center">
                                                    <Volume2 className="w-4 h-4 mr-2" />
                                                    Audio Explanation
                                                </TabsTrigger>
                                                <TabsTrigger value="text" className="flex font-noto items-center">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Text Results
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="text" className="space-y-6">
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className='text-slate-950 font-noto mt-10 font-medium text-left leading-loose w-full items-center justify-center'
                                                >
                                                    {textContentLoading ? <Loader2 className="w-8 h-8 text-amber-600 animate-spin" /> : <ReactMarkdown>{medicineData}</ReactMarkdown>}
                                                </motion.div>
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
    )
}

export default Analysis;