import React, { useState, useEffect, useRef } from 'react';
import { Settings, Plus, MessageSquare, Mic, Image as ImageIcon, Send, LogOut, ToggleLeft, ToggleRight, Loader2, Sparkles, Brain, Calculator, Activity, Sigma } from 'lucide-react';
import { ChatSession, ChatMessage, MessageRole, MathResponse } from '../types';
import { MessageBubble } from './Chat/MessageBubble';
import { sendMessageToGemini } from '../services/geminiService';
import { LiveSessionModal } from './Chat/LiveSessionModal';

interface Props {
  onLogout: () => void;
}

const WelcomeCard = ({ icon: Icon, title, desc, onClick }: any) => (
  <button 
    onClick={onClick}
    className="text-left p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500/30 transition-all group h-full"
  >
    <div className="w-10 h-10 rounded-lg bg-slate-800 group-hover:bg-indigo-500/20 flex items-center justify-center mb-3 transition-colors">
      <Icon size={20} className="text-slate-400 group-hover:text-indigo-400" />
    </div>
    <h3 className="text-slate-200 font-semibold mb-1 text-sm">{title}</h3>
    <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
  </button>
);

export const Dashboard: React.FC<Props> = ({ onLogout }) => {
  // State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    const saved = localStorage.getItem('cosmos_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
    } else {
      createNewSession();
    }
  }, []);

  // Persist
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('cosmos_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, currentSessionId, isLoading]);

  const getCurrentSession = () => sessions.find(s => s.id === currentSessionId);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Math Session',
      date: Date.now(),
      messages: [] // Start empty to show welcome screen
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if ((!textToSend.trim() && !selectedImage) || isLoading || !currentSessionId) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: textToSend,
      imageUri: selectedImage || undefined
    };

    // Optimistic Update
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const newTitle = s.messages.length === 0 ? (textToSend.slice(0, 30) || 'Image Analysis') : s.title;
        return { ...s, messages: [...s.messages, userMsg], title: newTitle };
      }
      return s;
    }));

    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    // Call Gemini
    const responseContent = await sendMessageToGemini(userMsg.content as string, userMsg.imageUri || null, useThinking);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: MessageRole.MODEL,
      content: responseContent,
      isThinking: useThinking
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: [...s.messages, modelMsg] };
      }
      return s;
    }));
    
    setIsLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentMessages = getCurrentSession()?.messages || [];
  const isWelcomeState = currentMessages.length === 0;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F1623] border-r border-slate-800/50 flex-col hidden md:flex">
        <div className="p-5">
           <div className="flex items-center gap-2 mb-8 px-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                 <Sigma size={18} className="text-white"/>
              </div>
              <span className="font-bold text-lg tracking-tight">Cosmos</span>
           </div>
          <button 
            onClick={createNewSession}
            className="w-full flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-900/20 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform"/>
            <span>New Session</span>
          </button>
        </div>
        
        <div className="px-4 pb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Your Conversations</div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all text-left truncate group ${
                currentSessionId === session.id 
                  ? 'bg-slate-800/80 text-white shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <MessageSquare size={16} className={currentSessionId === session.id ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'} />
              <span className="truncate flex-1">{session.title}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 mb-4">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                   <Brain size={14} className="text-purple-400"/>
                   <span>Thinking Mode</span>
                </div>
                <button onClick={() => setUseThinking(!useThinking)} className={`text-slate-400 hover:text-white transition-colors ${useThinking ? 'text-purple-400' : ''}`}>
                    {useThinking ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                </button>
             </div>
             <p className="text-[10px] text-slate-500 leading-tight">Enables deeper reasoning for complex proofs (Gemini 3 Pro).</p>
          </div>

          <button onClick={onLogout} className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm px-2 py-2 hover:bg-slate-800/50 rounded-lg transition-colors">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-[#0B0F19]">
        
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-[#0F1623]">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center"><Sigma size={14} className="text-white"/></div>
             <span className="font-bold">Cosmos</span>
          </div>
          <button onClick={createNewSession} className="p-2 bg-slate-800 rounded-lg"><Plus size={20}/></button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" ref={scrollRef}>
          
          {isWelcomeState ? (
             <div className="max-w-3xl mx-auto mt-10 md:mt-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-12">
                   <h1 className="text-4xl font-bold text-white mb-3">Welcome to Cosmos</h1>
                   <p className="text-slate-400 text-lg">Your intelligent companion for mathematics and science.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                   <WelcomeCard 
                      icon={Calculator}
                      title="Solve Calculus"
                      desc="Find the derivative of f(x) = x^2 * sin(x) and plot the tangent."
                      onClick={() => handleSend("Find the derivative of f(x) = x^2 * sin(x) and show the graph.")}
                   />
                   <WelcomeCard 
                      icon={Activity}
                      title="Visual Functions"
                      desc="Plot a Gaussian distribution with standard deviation 2."
                      onClick={() => handleSend("Plot a Gaussian distribution with standard deviation 2.")}
                   />
                   <WelcomeCard 
                      icon={Sparkles}
                      title="Quiz Me"
                      desc="Generate a 5-question quiz about Linear Algebra concepts."
                      onClick={() => handleSend("Create a difficult quiz about Linear Algebra eigenvectors.")}
                   />
                   <WelcomeCard 
                      icon={Brain}
                      title="Physics Help"
                      desc="Explain Quantum Entanglement simply with an analogy."
                      onClick={() => handleSend("Explain Quantum Entanglement simply with an analogy.")}
                   />
                </div>
             </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
               {currentMessages.map((msg) => (
                 <MessageBubble key={msg.id} message={msg} />
               ))}
               
               {isLoading && (
                 <div className="flex justify-start w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-[#1E293B] p-4 rounded-2xl rounded-tl-none border border-slate-700/50 flex flex-col gap-3 min-w-[200px] shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                           <div className="absolute inset-0 bg-indigo-500 rounded-full blur-sm opacity-50 animate-pulse"></div>
                           <Loader2 className="animate-spin text-indigo-400 relative z-10" size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                           {useThinking ? "Reasoning deeply..." : "Analyzing..."}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-slate-700/50 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 rounded-full w-2/3 animate-pulse"></div>
                      </div>
                    </div>
                 </div>
               )}
               <div className="h-4" /> {/* Spacer */}
            </div>
          )}
          
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0B0F19] border-t border-slate-800/50">
          <div className="max-w-3xl mx-auto">
            {selectedImage && (
              <div className="mb-3 relative inline-block animate-in fade-in zoom-in duration-200">
                <img src={selectedImage} alt="Preview" className="h-24 rounded-xl border border-slate-700 shadow-md" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-slate-800 rounded-full p-1.5 text-slate-300 hover:text-white border border-slate-600 shadow-sm transition-colors"
                >
                  <LogOut size={12} className="rotate-180" /> 
                </button>
              </div>
            )}
            
            <div className="relative flex items-end gap-2 bg-[#1E293B] rounded-2xl p-2 border border-slate-700/50 shadow-xl focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
              
              <div className="flex gap-1 pb-1">
                 <button 
                   onClick={() => setIsLiveOpen(true)}
                   className="p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-xl transition-colors tooltip"
                   title="Start Voice Chat"
                 >
                   <Mic size={20} />
                 </button>

                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-xl transition-colors"
                   title="Upload Image"
                 >
                   <ImageIcon size={20} />
                 </button>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                   if(e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                   }
                }}
                placeholder="Ask a math question..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 min-h-[50px] max-h-[120px] resize-none py-3"
                rows={1}
              />

              <button 
                onClick={() => handleSend()}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="mb-1 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-center text-[11px] text-slate-600 mt-3 font-medium">
              Powered by Google Gemini 3 Pro & Live API. AI can make mistakes.
            </p>
          </div>
        </div>

        {/* Live Modal */}
        <LiveSessionModal isOpen={isLiveOpen} onClose={() => setIsLiveOpen(false)} />

      </main>
    </div>
  );
};
