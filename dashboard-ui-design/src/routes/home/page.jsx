import React from 'react';
import {
  Camera,
  Brain,
  History,
  Keyboard,
  Monitor,
  ArrowRight,
  Star,
  Mail,
  Twitter,
  Github,
  Download,
  Menu
} from 'lucide-react';
import {  useNavigate } from 'react-router-dom';
function App() {
  const navigate = useNavigate();
  const handleClick = () => { 
    navigate('/login');
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI Scanner</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={handleClick}>
                Try for free
              </button>
            </div>
            
            <button className="md:hidden">
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Get Instant Answers with AI Scanning!
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Simply capture a screenshot, send it to AI, and get an answer instantly!
              </p>
              <div className="mt-8 flex gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80"
                alt="AI Scanner App Interface"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="h-8 w-8 text-blue-600" />,
                title: "Quick Screenshot Capture",
                description: "Capture instantly using a shortcut"
              },
              {
                icon: <Brain className="h-8 w-8 text-blue-600" />,
                title: "Accurate AI Answers",
                description: "Get precise results powered by AI"
              },
              {
                icon: <History className="h-8 w-8 text-blue-600" />,
                title: "Question History",
                description: "Save your questions for future reference"
              },
              {
                icon: <Keyboard className="h-8 w-8 text-blue-600" />,
                title: "Customizable Shortcuts",
                description: "Adjust hotkeys for convenience"
              },
              {
                icon: <Monitor className="h-8 w-8 text-blue-600" />,
                title: "Multi-Platform Support",
                description: "Available for Windows, MacOS, Android (coming soon)"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg border hover:shadow-lg transition">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Capture",
                description: "Press a shortcut to capture the question",
                icon: <Camera className="h-12 w-12 text-blue-600" />
              },
              {
                step: "2",
                title: "Process",
                description: "The app sends the image to AI for processing",
                icon: <Brain className="h-12 w-12 text-blue-600" />
              },
              {
                step: "3",
                title: "Answer",
                description: "Receive an instant answer on your screen!",
                icon: <ArrowRight className="h-12 w-12 text-blue-600" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "This app saves me hours of searching on Google!",
                author: "Sarah Johnson",
                role: "Student"
              },
              {
                text: "A must-have tool for students and professionals!",
                author: "Michael Chen",
                role: "Software Engineer"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-lg border hover:shadow-lg transition">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
          {
            name: "Free Trial",
            price: "$0",
            features: ["Dùng thử 7 ngày miễn phí", "Hỗ trợ nhiều ngôn ngữ", "Chạy được trên Windows, macOS, Linux", "Nhận diện văn bản chính xác hơn"]
          },
          {
            name: "Pro",
            price: "10.000",
            period: "₫/ngày",
            features: ["Hỗ trợ nhiều ngôn ngữ", "Nhận diện văn bản chính xác hơn", "Lưu lại lịch sử câu hỏi", "Xuất kết quả scan ra PDF"]

          },
        
          {
            name: "Premium",
            price: "50.000",
            period: "₫/tuần",
            features: ["Hỗ trợ nhiều ngôn ngữ", "Nhận diện văn bản chính xác hơn", "Lưu lại lịch sử câu hỏi", "Xuất kết quả scan ra PDF"]
          },
          {
            name: "Offline Model",
            price: "?",
            period: "/month",
            features: ["Sử dụng được khi không kết nối mạng","Hỗ trợ nhiều ngôn ngữ", "Nhận diện văn bản chính xác hơn", "Đang phát triển"]
          }
        ].map((plan, index) => (
              <div key={index} className="p-8 bg-white rounded-lg border hover:shadow-lg transition">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-500">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <ArrowRight className="h-5 w-5 text-blue-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg transition ${
                  index !== 0 
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Download Now – Get Answers to Any Question Instantly!
          </h2>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
            Download for Windows/MacOS
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">AI Scanner</span>
              </div>
              <p className="text-gray-400">
                Get instant answers to your questions with AI-powered scanning technology.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-4">
                <a href="mailto:support@aiscanner.com" className="flex items-center text-gray-400 hover:text-white">
                  <Mail className="h-5 w-5 mr-2" />
                  support@aiscanner.com
                </a>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Github className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AI Scanner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;