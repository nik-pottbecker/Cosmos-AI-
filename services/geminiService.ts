import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION, MathResponse } from "../types";
import { createPCM16Blob, decodeAudioData, base64ToUint8Array } from "./audioUtils";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Text & Vision Chat ---

export const sendMessageToGemini = async (
  prompt: string,
  imageBase64: string | null,
  isThinkingMode: boolean
): Promise<string | MathResponse> => {
  const modelName = isThinkingMode ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  
  // Dynamic Config based on mode
  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
  };

  if (isThinkingMode) {
    config.thinkingConfig = { thinkingBudget: 32768 }; 
  }

  // If we want JSON strictly for math, we might encourage it via responseMimeType
  // However, the prompt instructions handle the "if math then json else text" logic best in hybrid scenarios.
  // Setting responseMimeType to application/json forces JSON always, which breaks casual chat.
  // We will rely on System Instructions for the format switch.

  try {
    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming jpeg for simplicity from canvas/input
          data: imageBase64
        }
      });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config,
    });

    const text = response.text || "";
    
    // Try to parse JSON from the response if it looks like JSON
    try {
      // Find JSON substring if wrapped in backticks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0].replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        if (parsed.explanation && (parsed.quiz || parsed.graphData)) {
          return parsed as MathResponse;
        }
      }
    } catch (e) {
      // Not valid JSON, treat as text
    }

    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to Cosmos AI. Please try again.";
  }
};

// --- Live API (Voice) ---

export class LiveSessionManager {
  private session: any = null; // Session object from connect
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private audioQueue = new Set<AudioBufferSourceNode>();
  private activeStream: MediaStream | null = null;

  async connect(onAudioData: (visData: number) => void) {
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    // Resume contexts if suspended
    if(this.inputAudioContext.state === 'suspended') await this.inputAudioContext.resume();
    if(this.outputAudioContext.state === 'suspended') await this.outputAudioContext.resume();

    const outputNode = this.outputAudioContext.createGain();
    outputNode.connect(this.outputAudioContext.destination);

    this.activeStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Connection Promise
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          console.log("Live Session Opened");
          this.startAudioInputStream(sessionPromise, onAudioData);
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          
          if (base64Audio && this.outputAudioContext) {
             const audioBuffer = await decodeAudioData(
              base64ToUint8Array(base64Audio),
              this.outputAudioContext
            );

            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
            
            const source = this.outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputNode);
            
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            
            this.audioQueue.add(source);
            source.onended = () => this.audioQueue.delete(source);
          }
          
          // Handle interruptions
           if (message.serverContent?.interrupted) {
            this.audioQueue.forEach(src => {
              try { src.stop(); } catch(e) {}
            });
            this.audioQueue.clear();
            this.nextStartTime = 0;
          }
        },
        onclose: () => console.log("Live Session Closed"),
        onerror: (err) => console.error("Live Session Error", err),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: "You are a helpful, enthusiastic math tutor named Cosmos. Keep responses concise and conversational.",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });
    
    this.session = sessionPromise;
  }

  private startAudioInputStream(sessionPromise: Promise<any>, onAudioData: (vis: number) => void) {
    if (!this.inputAudioContext || !this.activeStream) return;

    const source = this.inputAudioContext.createMediaStreamSource(this.activeStream);
    const processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Visualization data (simple RMS)
      let sum = 0;
      for(let i=0; i<inputData.length; i+=100) sum += inputData[i] * inputData[i];
      onAudioData(Math.sqrt(sum / (inputData.length/100)) * 5); // Scale up

      const pcmBlob = createPCM16Blob(inputData);
      sessionPromise.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    source.connect(processor);
    processor.connect(this.inputAudioContext.destination);
  }

  async disconnect() {
    if (this.session) {
      // No explicit close method on the promise wrapper easily accessible without the stored session object
      // But typically we close via the session object if we had awaited it. 
      // For now, we stop tracks and contexts.
      try {
        const session = await this.session;
        // session.close() if available in SDK, else just cut connection locally
      } catch(e) {} 
    }
    
    this.activeStream?.getTracks().forEach(t => t.stop());
    this.inputAudioContext?.close();
    this.outputAudioContext?.close();
    this.session = null;
  }
}
