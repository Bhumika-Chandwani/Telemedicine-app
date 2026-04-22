import React, { useState, useEffect } from 'react';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, MoreVertical, Maximize, User } from 'lucide-react';

export function VideoConsultation({ navigateTo }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Doctor', message: 'Hello! How are you feeling today?', time: '10:00 AM' },
    { sender: 'You', message: 'Hi Doctor, I have been experiencing some headaches.', time: '10:01 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, {
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage('');
    }
  };

  const handleEndCall = () => {
    if (confirm('Are you sure you want to end this consultation?')) {
      navigateTo('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <header className="bg-gray-800 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => navigateTo('dashboard')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            <div>
              <h1 className="text-white text-sm sm:text-base lg:text-lg">Video Consultation</h1>
              <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">Dr. Sarah Johnson - Cardiology</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="px-2 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-lg flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm">{formatDuration(callDuration)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Video Feed */}
        <div className="flex-1 relative">
          {/* Doctor's Video (Main) */}
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <p className="text-white text-xl mb-2">Dr. Sarah Johnson</p>
              <p className="text-gray-400">Connected</p>
            </div>
          </div>

          {/* Patient's Video (Picture-in-Picture) */}
          <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              {isVideoOn ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white mt-2">You</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Video Off</p>
                </div>
              )}
            </div>
            <button className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-75 rounded hover:bg-opacity-100 transition-all">
              <Maximize className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Control Bar */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full px-6 py-3 flex items-center space-x-4 shadow-xl">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-colors ${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-4 rounded-full transition-colors ${
                !isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isVideoOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={handleEndCall}
              className="p-4 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className="p-4 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors relative"
            >
              <MessageSquare className="w-6 h-6 text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            <button className="p-4 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              <MoreVertical className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-96 bg-white border-l border-gray-300 flex flex-col">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-gray-800">Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="mb-1">{msg.message}</p>
                    <p className={`text-xs ${msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}