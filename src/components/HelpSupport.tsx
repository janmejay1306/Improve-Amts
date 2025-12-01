import { useState } from "react";
import { Headphones, ArrowLeft, Phone, Mail, MessageSquare, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { faqs } from "../data/mockData";
import { toast } from "sonner@2.0.3";

interface HelpSupportProps {
  onBack: () => void;
}

export function HelpSupport({ onBack }: HelpSupportProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast.success("Your message has been sent! We'll get back to you soon.");
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setShowContactForm(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F1E3]">
      {/* Header */}
      <div className="bg-[#FBE106] text-red-600 px-6 py-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-red-600 hover:bg-yellow-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Headphones className="w-6 h-6" />
          <h2 className="text-red-600">Help & Support</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="tel:18002335500"
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-2 text-center"
          >
            <div className="bg-red-100 p-3 rounded-full">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-gray-800">Call Us</p>
            <p className="text-sm text-gray-600">1800-233-5500</p>
          </a>

          <a
            href="mailto:support@amts.in"
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-2 text-center"
          >
            <div className="bg-red-100 p-3 rounded-full">
              <Mail className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-gray-800">Email Us</p>
            <p className="text-sm text-gray-600">support@amts.in</p>
          </a>

          <button
            onClick={() => setShowContactForm(!showContactForm)}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-2 text-center"
          >
            <div className="bg-red-100 p-3 rounded-full">
              <MessageSquare className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-gray-800">Contact Form</p>
            <p className="text-sm text-gray-600">Send a message</p>
          </button>
        </div>

        {/* Contact Form */}
        {showContactForm && (
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h3 className="text-gray-800 mb-4">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Subject</label>
                <Input
                  type="text"
                  name="subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Message</label>
                <Textarea
                  name="message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* FAQs */}
        <div className="bg-white rounded-xl p-5 shadow-md">
          <h3 className="text-gray-800 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-800 pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Office Hours */}
        <div className="bg-white rounded-xl p-5 shadow-md">
          <h3 className="text-gray-800 mb-3">Office Hours</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monday - Friday</span>
              <span className="text-gray-800">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Saturday</span>
              <span className="text-gray-800">9:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sunday</span>
              <span className="text-gray-800">Closed</span>
            </div>
          </div>
        </div>

        {/* Head Office Address */}
        <div className="bg-white rounded-xl p-5 shadow-md">
          <h3 className="text-gray-800 mb-3">Head Office</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Ahmedabad Municipal Transport Service (AMTS)
            <br />
            Geeta Mandir Bus Depot,
            <br />
            Ashram Road, Ahmedabad - 380009
            <br />
            Gujarat, India
          </p>
        </div>
      </div>
    </div>
  );
}
