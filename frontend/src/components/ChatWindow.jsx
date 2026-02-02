import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../stores/chatStore';
import { Send, Loader2, Brain, ChevronDown, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const formatDuration = (seconds) => {
    if (!seconds) return '';
    return `for ${seconds} seconds`;
};

const ThinkingBlock = ({ thought, duration }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mb-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors mb-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
            >
                <Brain size={14} className="text-purple-500" />
                <span>Thought process {formatDuration(duration)}</span>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {isExpanded && (
                <div className="bg-slate-50/50 border-l-2 border-purple-200 pl-4 py-2 pr-2 text-slate-600 text-sm italic rounded-r-lg mb-4 animate-in fade-in slide-in-from-top-1">
                    <ReactMarkdown
                        components={{
                            p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />
                        }}
                    >
                        {thought}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default function ChatWindow() {
    const [input, setInput] = useState('');
    const { messages, isLoading, sendMessage, loadHistory } = useChatStore();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        sendMessage(input);
        setInput('');
    };

    const parseContent = (content) => {
        // Try new delimiter style
        let match = content.match(/:::thinking([\s\S]*?):::/);
        if (match) {
            return {
                thought: match[1].trim(),
                mainContent: content.replace(/:::thinking[\s\S]*?:::/, '').trim()
            };
        }

        // Try HTML tag style (legacy/fallback)
        match = content.match(/<think>([\s\S]*?)<\/think>/);
        if (match) {
            return {
                thought: match[1].trim(),
                mainContent: content.replace(/<think>[\s\S]*?<\/think>/, '').trim()
            };
        }

        return { thought: null, mainContent: content };
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Header Area in Chat */}
            <div className="bg-white/80 backdrop-blur-md border-b px-6 py-4 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-600">Online • AI Ready</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                {messages.map((msg, idx) => {
                    const { thought, mainContent } = msg.role === 'assistant' ? parseContent(msg.content) : { thought: null, mainContent: msg.content };

                    return (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`flex flex-col max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

                                {thought && (
                                    <div className="w-full mb-1">
                                        <ThinkingBlock thought={thought} duration={msg.thoughtDuration} />
                                    </div>
                                )}

                                <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <div className="markdown-content space-y-2">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                                    li: ({ node, ...props }) => <li className="" {...props} />,
                                                    a: ({ node, ...props }) => <a className="text-blue-500 hover:underline font-medium" target="_blank" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                                    code: ({ node, ...props }) => <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono text-pink-500" {...props} />,
                                                }}
                                            >
                                                {mainContent || (thought ? "*(Hanya menyertakan proses berpikir)*" : msg.content)}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex justify-start animate-in fade-in">
                        <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                            <Loader2 className="animate-spin text-purple-500" size={18} />
                            <span className="text-xs text-slate-500 font-medium italic">Thinking process...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t sticky bottom-0 z-20">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tanya info produk, lokasi, atau resep..."
                        className="w-full bg-slate-50 border-slate-200 border rounded-full pl-6 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md hover:shadow-lg transform active:scale-95"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-slate-400">HEART AI can make mistakes. Verify important info.</p>
                </div>
            </div>
        </div>
    );
}
