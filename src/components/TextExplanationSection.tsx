import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from "react-markdown";

interface TextProps {
    text: string;
    contentLoading: boolean
}

const TextExplanationSection: React.FC<TextProps> = ({ text, contentLoading }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='text-slate-950 font-noto mt-10 font-medium text-left leading-loose w-full items-center justify-center'
        >
            {contentLoading ? <Loader2 className="w-8 h-8 text-amber-600 animate-spin" /> : <ReactMarkdown>{text}</ReactMarkdown>}
        </motion.div>
    )
}

export default TextExplanationSection;