import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Mic, MicOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { busRoutes, busStops, faqs } from "../data/mockData";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AMTS Connect assistant. How can I help you today? You can ask me about routes, bus stops, fares, timings, ticket booking, or anything related to AMTS services.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Route queries
    if (lowerMessage.includes("route") && lowerMessage.match(/\d+/)) {
      const routeNum = lowerMessage.match(/\d+/)?.[0];
      const route = busRoutes.find((r) => r.number === routeNum);
      if (route) {
        return `Route ${route.number} (${route.name}) runs from ${route.from} to ${route.to}. It covers ${route.distance} in approximately ${route.duration}. First bus: ${route.firstBus}, Last bus: ${route.lastBus}. Fare: ${route.fare}. Buses run every ${route.frequency}.`;
      }
      return `I couldn't find route ${routeNum}. Please check the route number and try again.`;
    }

    // Bus stop queries
    if (lowerMessage.includes("stop") || lowerMessage.includes("station")) {
      const stopKeywords = ["maninagar", "kankaria", "vastrapur", "naroda", "satellite", "iskon", "geeta mandir", "kalupur"];
      const foundKeyword = stopKeywords.find((keyword) => lowerMessage.includes(keyword));
      
      if (foundKeyword) {
        const stop = busStops.find((s) => s.name.toLowerCase().includes(foundKeyword));
        if (stop) {
          return `${stop.name} (Code: ${stop.code}) is located at ${stop.location}. Routes available: ${stop.routes.join(", ")}. Facilities: ${stop.facilities.join(", ")}.`;
        }
      }
      
      return "Which bus stop are you looking for? You can ask about specific stops like Maninagar, Kankaria, Vastrapur, etc.";
    }

    // Fare queries
    if (lowerMessage.includes("fare") || lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      return "AMTS fares typically range from ₹10 to ₹20 depending on the distance. You can check specific route fares using the 'Route Finder' feature or ask me about a specific route number.";
    }

    // Timing queries
    if (lowerMessage.includes("timing") || lowerMessage.includes("time") || lowerMessage.includes("schedule")) {
      return "Most AMTS buses operate from 6:00 AM to 11:00 PM. However, timings vary by route. You can check specific route timings using the 'Know Your Route' feature or ask me about a specific route number.";
    }

    // Live tracking
    if (lowerMessage.includes("track") || lowerMessage.includes("live") || lowerMessage.includes("where")) {
      return "You can track buses in real-time using the 'Where is My Bus' feature or the 'Live Bus Tracking' feature on the home screen. Just enter your route number to see live locations!";
    }

    // Pass queries
    if (lowerMessage.includes("pass") || lowerMessage.includes("monthly")) {
      return "AMTS offers monthly passes at discounted rates. You can purchase them at any AMTS depot or authorized ticket counter. Monthly passes are great for regular commuters and can save you up to 30%!";
    }

    // Route finding
    if ((lowerMessage.includes("from") && lowerMessage.includes("to")) || 
        lowerMessage.includes("how to reach") || 
        lowerMessage.includes("which bus")) {
      return "I can help you find the best route! Please use the 'Route Finder' feature on the home screen where you can enter your starting point and destination. Or tell me specifically which locations you're traveling between.";
    }

    // Nearby stops
    if (lowerMessage.includes("near") || lowerMessage.includes("closest")) {
      return "Use the 'Nearby Stop' feature on the home screen to find bus stops near your current location. Make sure to allow location access for accurate results.";
    }

    // Help and support
    if (lowerMessage.includes("help") || lowerMessage.includes("contact") || lowerMessage.includes("support")) {
      return "For detailed assistance, please use the 'Help & Support' feature. You can also call our helpline at 079-2550 3932 or email us at info@amts.org. We're here to help 24/7!";
    }

    // Greeting
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! How can I assist you with AMTS services today? You can ask about routes, bus stops, fares, timings, or any other information.";
    }

    // Thank you
    if (lowerMessage.includes("thank")) {
      return "You're welcome! Feel free to ask if you need any more help with AMTS services. Have a great journey! 🚌";
    }

    // Lost and found
    if (lowerMessage.includes("lost") || lowerMessage.includes("found")) {
      return "If you've lost something on a bus, please contact our Lost and Found department at the AMTS head office. Call 079-2550 3932 and provide route number, date, and time of travel.";
    }

    // Wheelchair/accessibility
    if (lowerMessage.includes("wheelchair") || lowerMessage.includes("accessible") || lowerMessage.includes("disabled")) {
      return "Many AMTS buses are wheelchair accessible with low-floor entry. Look for buses marked with the wheelchair symbol. For specific route information about accessible buses, please call our helpline.";
    }

    // Default response
    return "I'm here to help with AMTS information! You can ask me about:\n• Bus routes and timings\n• Bus stops and locations\n• Fares and passes\n• Live bus tracking\n• How to reach a destination\n• General AMTS services\n\nWhat would you like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert("Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const quickQuestions = [
    "Show me route 1",
    "What are the bus timings?",
    "How to track my bus?",
    "Monthly pass information",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-[#FBE106] text-black rounded-full p-4 shadow-lg hover:bg-yellow-500 transition-all hover:scale-110 z-50 animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-[#FBE106]">
          {/* Header */}
          <div className="bg-[#FBE106] text-black p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full p-2">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-black">AMTS Connect Assistant</h3>
                <p className="text-gray-700 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-yellow-500 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user" ? "text-red-100" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible div for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            {isListening && (
              <div className="mb-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg animate-pulse">
                <Mic className="w-4 h-4" />
                <span>Listening... Speak now</span>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Ask me anything about AMTS..."}
                className="flex-1"
                disabled={isListening}
              />
              <Button
                onClick={toggleVoiceInput}
                variant={isListening ? "destructive" : "outline"}
                className={isListening ? "animate-pulse" : ""}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
