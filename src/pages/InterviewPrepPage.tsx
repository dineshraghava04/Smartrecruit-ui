import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Send, Brain } from 'lucide-react';

export const InterviewPrepPage = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    {
      role: 'ai',
      content: 'Hello! I\'m your AI interview coach. I can help you practice for interviews, provide feedback, and answer common interview questions. What role are you preparing for?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages([...messages, { role: 'user', content: userMessage }]);

    setLoading(true);
    setTimeout(() => {
      const aiResponses = [
        'Great! Let\'s start with a common question: "Tell me about yourself." Take your time to answer, and I\'ll provide feedback.',
        'That\'s a solid answer! Here\'s some feedback: Try to structure your response using the STAR method (Situation, Task, Action, Result) for better impact.',
        'Excellent! Now let\'s try a behavioral question: "Tell me about a time when you faced a challenging situation at work and how you handled it."',
        'Good thinking! For technical interviews, make sure to explain your thought process out loud. Would you like to practice a coding question?',
      ];

      const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages((prev) => [...prev, { role: 'ai', content: aiResponse }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <span>AI Interview Preparation</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Practice with our AI-powered interview coach and get instant feedback
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-600">AI Coach</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message or answer..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Common Questions</h3>
            <p className="text-sm text-blue-700">Practice answers to frequently asked interview questions</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Behavioral</h3>
            <p className="text-sm text-blue-700">Master the STAR method for behavioral interviews</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Technical</h3>
            <p className="text-sm text-blue-700">Prepare for coding and technical assessments</p>
          </div>
        </div>
      </div>
    </div>
  );
};
