export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface GraphDataPoint {
  x: number;
  y: number;
}

export interface MathResponse {
  explanation: string; // Markdown text
  quiz?: QuizQuestion[];
  graphData?: GraphDataPoint[];
  graphLabel?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string | MathResponse; // String for simple chats, Object for Math mode
  imageUri?: string; // For user uploaded images
  isThinking?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  date: number; // timestamp
  messages: ChatMessage[];
}

export interface AppSettings {
  useThinkingModel: boolean;
  theme: 'dark' | 'light';
}

export const SYSTEM_INSTRUCTION = `
You are Cosmos, an advanced Math Assistant. 
When the user asks a math question (algebra, calculus, functions, etc.), you MUST respond in strict JSON format following this schema:
{
  "explanation": "Markdown string explaining the solution step-by-step.",
  "quiz": [
    { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 0 },
    { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 1 },
    { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 2 }
  ],
  "graphData": [ {"x": -10, "y": 100}, ... ], 
  "graphLabel": "f(x) = x^2"
}

For "graphData", generate 20-50 points that visually represent the function mentioned in the solution.

If the user input is NOT a math question (e.g., "Hello", "Who are you"), respond with a standard text string (not JSON).
`;
