import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { sendDermaChat } from '../lib/api';
import type { ChatMessage } from '../lib/api';
import { ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react';

export default function DermaChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendDermaChat(trimmed, messages);
      setMessages([...updatedMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: '⚠️ Sorry, I couldn\'t process your request. Please make sure the backend server is running and try again.',
        },
      ]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'I have acne and oily skin, what should I do?',
    'Best routine for hyperpigmentation?',
    'How to deal with dry, flaky skin?',
    'What foods help with clear skin?',
  ];

  return (
    <PageTransition className="relative z-10 min-h-screen flex flex-col pt-24 pb-4 px-4">
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-4"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-olive to-olive-dark flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-cream" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-charcoal leading-tight">
                AI Derma Specialist
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-charcoal-muted">Online · Powered by Groq AI</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto rounded-2xl glass-strong p-4 mb-4 min-h-0" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center h-full py-12"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-olive/15 to-peach/15 flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-olive" />
              </div>
              <h2 className="font-display text-xl font-semibold text-charcoal mb-2">
                Welcome to AI Derma Specialist
              </h2>
              <p className="text-sm text-charcoal-muted text-center max-w-md mb-8">
                I'm your personal AI dermatologist. Ask me anything about skincare, 
                skin conditions, routines, or diet for healthy skin.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    onClick={() => {
                      setInput(q);
                      inputRef.current?.focus();
                    }}
                    className="text-left text-xs p-3 rounded-xl bg-cream/80 hover:bg-sand/60 border border-sand/50 text-charcoal-muted hover:text-charcoal transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-olive mr-1.5">→</span>
                    {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-olive/15'
                          : 'bg-gradient-to-br from-olive to-olive-dark shadow-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-olive" />
                      ) : (
                        <Bot className="w-4 h-4 text-cream" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-olive text-white rounded-tr-sm'
                          : 'bg-cream/80 text-charcoal border border-sand/40 rounded-tl-sm'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div
                          className="derma-chat-content prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.content) }}
                        />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-olive to-olive-dark flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-cream" />
                  </div>
                  <div className="bg-cream/80 border border-sand/40 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 rounded-full bg-olive/50"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-3 flex items-end gap-3"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your skin concern..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-charcoal placeholder:text-charcoal-muted/50 resize-none outline-none py-2 px-2 max-h-32"
            style={{ minHeight: '40px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 cursor-pointer ${
              input.trim() && !isLoading
                ? 'bg-olive text-white shadow-md hover:bg-olive-dark hover:shadow-lg active:scale-95'
                : 'bg-sand/60 text-charcoal-muted/40 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
}

// Simple markdown to HTML converter for chat messages
function markdownToHtml(md: string): string {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-charcoal/5 rounded-lg p-3 my-2 overflow-x-auto"><code>$2</code></pre>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^### (.*$)/gm, '<h4 class="font-semibold text-charcoal mt-3 mb-1">$1</h4>')
    .replace(/^## (.*$)/gm, '<h3 class="font-display font-semibold text-charcoal mt-4 mb-1.5 text-base">$1</h3>')
    .replace(/^# (.*$)/gm, '<h2 class="font-display font-bold text-charcoal mt-4 mb-2 text-lg">$1</h2>')
    // Unordered lists
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-charcoal-muted">$1</li>')
    .replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc text-charcoal-muted">$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal text-charcoal-muted">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');

  return html;
}
