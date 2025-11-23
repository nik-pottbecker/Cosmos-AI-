import React from 'react';
import { ArrowRight, BrainCircuit, Zap, Activity, CheckCircle2, ChevronRight, Calculator, Terminal, Sparkles } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
          <span className="self-center text-2xl font-semibold whitespace-nowrap tracking-tight text-white">
            Cosmos<span className="text-indigo-400">.ai</span>
          </span>
          <div className="flex gap-4">
            <button 
              onClick={onLogin}
              className="hidden md:block text-slate-300 hover:text-white font-medium text-sm transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onLogin}
              className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-full text-sm px-6 py-2.5 text-center transition-all shadow-lg shadow-indigo-500/20 hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-300 font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles size={12} />
          <span>Powered by Gemini 3 Pro</span>
        </div>
        
        <h1 className="mb-6 text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
          Solve Math with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Superhuman Intelligence</span>
        </h1>
        
        <p className="mb-10 text-lg md:text-xl font-normal text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          An advanced AI tutor that doesn't just give answers—it visualizes functions, creates quizzes, and reasons through complex physics problems step-by-step.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <button onClick={onLogin} className="inline-flex justify-center items-center py-4 px-8 text-base font-semibold text-white rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all hover:scale-105 shadow-xl shadow-indigo-500/20">
            Start Learning
            <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
          </button>
          <button onClick={onLogin} className="inline-flex justify-center items-center py-4 px-8 text-base font-medium text-slate-300 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all backdrop-blur-sm">
            View Features
          </button>
        </div>
      </section>

      {/* App Preview Mockup */}
      <section className="relative z-10 px-4 pb-32">
        <div className="max-w-6xl mx-auto rounded-xl border border-white/10 bg-[#131B2C]/80 backdrop-blur-sm shadow-2xl overflow-hidden relative group animate-in fade-in zoom-in-95 duration-1000 delay-300">
          
          {/* Mockup Window Header */}
          <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-[#0F1623]">
             <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
               <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
               <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
             </div>
             <div className="hidden md:flex ml-4 px-3 py-1 rounded-md bg-black/20 text-[10px] text-slate-500 font-mono items-center gap-2 border border-white/5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               cosmos.ai/dashboard
             </div>
          </div>

          {/* Mockup Content */}
          <div className="flex h-[400px] md:h-[600px] bg-[#0B0F19]">
            {/* Sidebar Mockup */}
            <div className="w-64 border-r border-white/5 bg-[#0F1623] hidden md:flex flex-col p-4 gap-6">
               <div className="h-10 bg-indigo-600 rounded-lg w-full flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-indigo-500/10">
                 + New Chat
               </div>
               <div className="space-y-3">
                 <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Recent</div>
                 {[1, 2, 3, 4].map((_, i) => (
                   <div key={i} className="h-8 rounded-lg bg-white/[0.03] w-full" />
                 ))}
               </div>
               <div className="mt-auto space-y-3">
                 <div className="h-12 rounded-lg bg-white/[0.03] w-full border border-white/5" />
               </div>
            </div>

            {/* Main Area Mockup */}
            <div className="flex-1 flex flex-col relative">
              {/* Header */}
              <div className="h-16 border-b border-white/5 flex items-center px-8 justify-between">
                <div className="text-sm text-slate-400">Optimization Problem #4</div>
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/5" />
                   <div className="w-8 h-8 rounded-full bg-white/5" />
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 p-8 overflow-hidden relative">
                 {/* Chat Bubble 1 */}
                 <div className="flex justify-end mb-6">
                    <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none max-w-md shadow-lg">
                       Calculate the derivative of f(x) = x² * sin(x) and plot it.
                    </div>
                 </div>

                 {/* Chat Bubble 2 (AI) */}
                 <div className="flex justify-start mb-6 w-full max-w-3xl">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 mr-3 flex items-center justify-center"><Sparkles size={14} className="text-white"/></div>
                    <div className="bg-[#1E293B] border border-white/10 p-5 rounded-2xl rounded-tl-none w-full shadow-lg">
                       <p className="text-slate-300 text-sm mb-4">Using the product rule, here represents the derivative:</p>
                       <div className="p-3 bg-black/30 rounded-lg border border-white/5 font-mono text-xs text-emerald-400 mb-4">
                          f'(x) = 2x*sin(x) + x²*cos(x)
                       </div>
                       {/* Fake Graph */}
                       <div className="h-32 w-full bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg border border-white/5 relative overflow-hidden">
                          <svg className="absolute bottom-0 left-0 w-full h-full opacity-50" viewBox="0 0 100 20" preserveAspectRatio="none">
                             <path d="M0,10 Q25,20 50,10 T100,10" fill="none" stroke="#34D399" strokeWidth="0.5"/>
                          </svg>
                          <div className="absolute top-2 right-2 flex gap-1">
                             <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                             <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 {/* Gradient Fade at bottom */}
                 <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0B0F19] to-transparent z-10" />
              </div>

              {/* Input Bar */}
              <div className="p-6 relative z-20">
                <div className="h-14 bg-[#1E293B] rounded-xl border border-white/10 flex items-center px-4 shadow-xl">
                   <div className="text-slate-500">Ask follow-up question...</div>
                   <div className="ml-auto w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <ArrowRight size={16} className="text-white"/>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-[#0F1623] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why top students choose Cosmos</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We combine the latest Large Language Models with specialized math engines to deliver accuracy you can trust.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {[
               {
                 icon: <BrainCircuit size={24} className="text-indigo-400" />,
                 title: "Deep Reasoning",
                 desc: "Our 'Thinking Mode' spends extra compute time verifying steps before answering."
               },
               {
                 icon: <Activity size={24} className="text-emerald-400" />,
                 title: "Dynamic Visuals",
                 desc: "Don't just read the answer. See the function behavior with instant, interactive graphs."
               },
               {
                 icon: <Zap size={24} className="text-amber-400" />,
                 title: "Real-time Voice",
                 desc: "Stuck on a problem? Talk it out with Cosmos Live for a natural tutoring experience."
               },
               {
                 icon: <Terminal size={24} className="text-pink-400" />,
                 title: "Code Generation",
                 desc: "Get Python or JavaScript code snippets to implement the solution yourself."
               },
               {
                 icon: <Calculator size={24} className="text-cyan-400" />,
                 title: "Step-by-Step",
                 desc: "Detailed breakdowns of every operation so you learn the 'why', not just the 'what'."
               },
               {
                 icon: <CheckCircle2 size={24} className="text-blue-400" />,
                 title: "Smart Quizzes",
                 desc: "Automatically generated mini-quizzes after every explanation to reinforce learning."
               }
             ].map((feature, i) => (
               <div key={i} className="p-8 rounded-2xl bg-[#131B2C] border border-white/5 hover:border-white/10 hover:bg-[#1A2438] transition-all group">
                 <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                   {feature.icon}
                 </div>
                 <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                 <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">From confusion to clarity in seconds</h2>
          <div className="space-y-12">
            {[
              { num: "01", title: "Ask anything", text: "Type a complex word problem or upload a photo of your textbook." },
              { num: "02", title: "Watch it think", text: "Cosmos breaks down the problem, verifying logic at each step." },
              { num: "03", title: "Visualize & Learn", text: "Get the solution, a graph, and a follow-up quiz to ensure mastery." }
            ].map((step, i) => (
              <div key={i} className="flex items-start md:items-center gap-6 group">
                <div className="text-5xl font-black text-white/5 group-hover:text-indigo-500/20 transition-colors font-mono">{step.num}</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-slate-400">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#080B13] text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2024 Cosmos AI. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
