# 🩺 Medicine Assistant – Image to Info with Voice Support

HearMedi is a smart GenAI-powered web application that helps users understand their medicines by simply uploading a picture of a medicine packet. The app extracts the medicine name from the image using OCR, fetches relevant information using OpenAI's GPT model, and converts the text into a natural-sounding audio using Murf AI.

---

## 📸 Features

- 📷 Upload or drag & drop medicine image
- 🧠 Extracts text using OCR (ocr.space API)
- 💊 Identifies medicine name & dosage (with regex)
- 🧬 Fetches detailed information using OpenAI (GPT-4/GPT-3.5)
- 🔊 Converts explanation into audio using Murf AI
- 🎧 Interactive audio player with seek bar and loop support
- 🎨 Responsive & modern UI built with React & Tailwind CSS

---

## 🚀 Live Demo

👉 [Live Link](https://hearmedi.vercel.app/)

---

## 🛠️ Tech Stack

| Technology     | Purpose                              |
|----------------|--------------------------------------|
| **React + TS** | Frontend framework                   |
| **TailwindCSS**| Styling and responsiveness           |
| **ocr.space**  | OCR API to extract text from image   |
| **OpenAI GPT** | AI model to generate medicine info   |
| **Murf AI**    | Text-to-speech voice generation      |
| **React Markdown** | Renders GPT's markdown responses |
| **HTML5 Audio**| Interactive custom audio player      |
| **Framer Motion** | Smooth animations                 |

---

## 🧠 How It Works

1. **Upload Image**: User selects or drops a medicine image.
2. **Text Extraction**: OCR.space extracts text from the image.
3. **Text Cleanup**: Regex filters possible medicine names with dosage.
4. **AI Integration**: GPT takes the name and generates medical details (usage, side effects, precautions, etc.).
5. **Audio Generation**: Cleaned text is sent to Murf AI for voice output.
6. **Display**: The user can read or listen to the medicine details.
