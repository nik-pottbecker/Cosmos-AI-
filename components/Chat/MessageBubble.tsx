import React, { useState } from 'react';
import { ChatMessage, MessageRole, QuizQuestion, MathResponse } from '../../types';
import { User, Sparkles, BrainCircuit, Copy, Check, Terminal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReactMarkdown from 'react-markdown';

interface Props {
  message: ChatMessage;
}

const CopyButton = ({ text, className }: { text: string, className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded transition-colors ${
        copied 
          ? 'bg-emerald-500/10 text-emerald-400' 
          : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white'
      } ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
};

const QuizBlock = ({ quiz }: { quiz: QuizQuestion[] }) => {
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.length).fill(-1));
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (qIndex: number, optIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const checkScore = () => {
    let s = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswerIndex) s++;
    });
    setScore(s);
  };

  const getQuizText = () => {
    return quiz.map((q, i) => 
      `Q${i+1}: ${q.question}\n${q.options.map(o => `- ${o}`).join('\n')}`
    ).join('\n\n');
  };

  return (
    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Mini Quiz</h4>
        <CopyButton text={getQuizText()} />
      </div>
      <div className="space-y-6">
        {quiz.map((q, i) => (
          <div key={i} className="space-y-2">
            <p className="text-sm font-medium text-slate-200">{i + 1}. {q.question}</p>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(i, optIdx)}
                  disabled={score !== null}
                  className={`text-left text-xs px-3 py-2 rounded transition-colors ${
                    answers[i] === optIdx
                      ? (score !== null 
                          ? (optIdx === q.correctAnswerIndex ? 'bg-green-500/20 text-green-300 border-green-500' : 'bg-red-500/20 text-red-300 border-red-500') 
                          : 'bg-indigo-600 text-white')
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  } border border-transparent`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {score === null ? (
        <button 
          onClick={checkScore}
          disabled={answers.includes(-1)}
          className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-medium text-sm"
        >
          Check Answers
        </button>
      ) : (
        <div className="mt-4 text-center font-bold text-indigo-300">
          Score: {score} / {quiz.length}
        </div>
      )}
    </div>
  );
};

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isMathResponse = typeof message.content === 'object';
  const textContent = isMathResponse 
    ? (message.content as MathResponse).explanation 
    : (message.content as string);

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full min-w-0`}>
          <div className={`p-4 rounded-2xl w-full ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none shadow-xl'
          }`}>
            
            {/* Image Preview for User */}
            {message.imageUri && (
               <img src={message.imageUri} alt="Uploaded math" className="max-w-[200px] mb-3 rounded-lg border border-indigo-400/30" />
            )}

            {/* Markdown Text */}
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeText = String(children).replace(/\n$/, '');

                    if (!inline && match) {
                      return (
                        <div className="not-prose my-4 rounded-lg overflow-hidden border border-slate-700 bg-slate-950/50">
                          <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 border-b border-slate-700">
                            <div className="flex items-center gap-2">
                              <Terminal size={12} className="text-slate-500" />
                              <span className="text-xs text-slate-400 font-mono">{match[1]}</span>
                            </div>
                            <CopyButton text={codeText} />
                          </div>
                          <div className="p-3 overflow-x-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </div>
                        </div>
                      );
                    }
                    return <code className={`${className} bg-slate-700/50 px-1 py-0.5 rounded font-mono text-xs`} {...props}>{children}</code>;
                  }
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>

            {/* Thinking Indicator */}
            {message.isThinking && !isUser && (
               <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400/70">
                 <BrainCircuit size={12} />
                 <span>Deep thinking applied</span>
               </div>
            )}

            {/* Math Visuals & Quiz */}
            {!isUser && isMathResponse && (
              <div className="mt-4 space-y-4 w-full">
                
                {/* Chart */}
                {(message.content as MathResponse).graphData && (
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative group">
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text={JSON.stringify((message.content as MathResponse).graphData, null, 2)} className="bg-slate-800/80 backdrop-blur shadow-md" />
                    </div>
                    <p className="text-xs text-slate-400 mb-2 text-center font-mono">
                      {(message.content as MathResponse).graphLabel || 'Graph Visualization'}
                    </p>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={(message.content as MathResponse).graphData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis 
                            dataKey="x" 
                            stroke="#94a3b8" 
                            tick={{fontSize: 10}} 
                            type="number" 
                            allowDataOverflow={false}
                          />
                          <YAxis 
                            stroke="#94a3b8" 
                            tick={{fontSize: 10}} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#818cf8' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="y" 
                            stroke="#818cf8" 
                            strokeWidth={2} 
                            dot={false} 
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Quiz */}
                {(message.content as MathResponse).quiz && (
                  <QuizBlock quiz={(message.content as MathResponse).quiz!} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};