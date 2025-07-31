import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

const AnalyzeLoader: React.FC = () => {
    return (
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
    )
}

export default AnalyzeLoader;