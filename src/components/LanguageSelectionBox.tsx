import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectionProps {
  audioLanguage: string;
  setAudioLanguage: React.Dispatch<React.SetStateAction<string>>
}

const LanguageSelectionBox: React.FC<LanguageSelectionProps> = ({ audioLanguage, setAudioLanguage }) => {
  return (
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
  )
}

export default LanguageSelectionBox;