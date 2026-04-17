import React, { useState, useRef } from 'react';
// import SideMenu from '../components/Sidemenu';
// import Header from '../components/Header';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Button from '../components/Button';

export default function ResourceDetail() {
  // Placeholder state for future backend integration
  const [resource, setResource] = useState({
    title: "The Existential Risk of Emerging Artificial Intelligence",
    url: "academic-journal.org/ai-ethics/2024/08",
    breadcrumb: "VAULTS > APPLIED ETHICS > CURRENT FILE"
  });

  const [noteText, setNoteText] = useState("");
  const textareaRef = useRef(null);

  // The Magic Function to wrap text
  const applyStyle = (symbol) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = noteText.substring(start, end);
    
    // Example: wraps "hello" in "**hello**"
    const newText = 
      noteText.substring(0, start) + 
      `${symbol}${selectedText}${symbol}` + 
      noteText.substring(end);

    setNoteText(newText);
    
    // Refocus the textarea after clicking the button
    textarea.focus();
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      {/* <SideMenu activeItem="My Vaults" /> */}
      
      <div className="flex-grow flex flex-col">
        {/* <Header /> */}

        <main className="mt-16 ml-0 md:ml-64 p-8 md:p-12">
          {/* Breadcrumbs */}
          <nav className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">
            {resource.breadcrumb}
          </nav>

          {/* Title and Header Actions */}
          <div className="flex justify-between items-start mb-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold text-[#0B3C5D] leading-tight mb-4">
                {resource.title}
              </h1>
              <a href="#" className="flex items-center gap-2 text-sm text-sky-600 font-medium hover:underline">
                <Icon name="link" size="14px" />
                {resource.url}
              </a>
            </div>
            <div className="flex gap-3">
              <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Icon name="share" size="20px" className="text-slate-600" />
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Icon name="bookmark" size="20px" className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Two-Column Grid Layout */}
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left Column: Annotations (8/12) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#0B3C5D]">
                  <Icon name="note" size="20px" /> Annotations / Notes
                </h3>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  12 Notes Total
                </span>
              </div>

              {/* Note Drafting Area */}
              <Card className="p-6">
                <textarea 
                ref={textareaRef}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full h-32 p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500 text-slate-600 placeholder:text-slate-400 mb-4"
                placeholder="Start drafting..."
                />
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-slate-400">
                    {/* Bold Button */}
                    <button 
                    onClick={() => applyStyle('**')} 
                    className="hover:text-[#0B3C5D] font-serif font-bold transition-colors"
                    >
                    B
                    </button>
                    {/* Italic Button */}
                    <button 
                    onClick={() => applyStyle('_')} 
                    className="hover:text-[#0B3C5D] italic font-serif transition-colors"
                    >
                    I
                    </button>
                    <Icon name="link" size="18px" className="cursor-pointer hover:text-slate-600" />
                    </div>
                    <Button variant="blue" className="px-8 rounded-lg">Save Note</Button>
                </div>
                </Card>

              {/* Placeholder for Dynamic Note Cards */}
              <Card className="p-6 border-l-4 border-l-sky-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
                    <Icon name="search" size="16px" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Analysis</h4>
                    <p className="text-[10px] text-slate-400">Oct 24, 2024 • 09:42 AM</p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  The author posits that the "alignment problem" is not merely technical but inherently philosophical...
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">#Alignment</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">#Ethics</span>
                </div>
              </Card>
            </div>

            {/* Right Column: Insight Sidebar (4/12) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <Card className="p-0">
                <div className="h-40 bg-[url('/src/assets/insight-bg.png')] bg-cover bg-center flex items-end p-6 relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                   <h3 className="relative text-white font-bold text-lg">Resource Insight</h3>
                </div>
                <div className="p-6">
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Complexity</p>
                        <p className="text-sm font-bold text-[#0B3C5D]">Academic (PhD)</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Time to Digest</p>
                        <p className="text-sm font-bold text-[#0B3C5D]">45 mins</p>
                      </div>
                   </div>
                   {/* Collaborators Section */}
                   <div className="mt-8 bg-[#0B3C5D] p-6 rounded-2xl text-white">
                      <p className="text-xs font-bold mb-4">Shared With</p>
                      <div className="flex items-center gap-2 mb-6">
                         <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-[#0B3C5D] bg-slate-400"></div>
                            <div className="w-8 h-8 rounded-full border-2 border-[#0B3C5D] bg-slate-500"></div>
                            <div className="w-8 h-8 rounded-full border-2 border-[#0B3C5D] flex items-center justify-center bg-sky-800 text-[10px]">+4</div>
                         </div>
                      </div>
                      <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                        Invite Researcher
                      </button>
                   </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}