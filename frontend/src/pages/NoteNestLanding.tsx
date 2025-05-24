
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Brain,
  Users,
  Mic,
  Image,
  Search,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,

  Feather
} from 'lucide-react';

const NoteNestLanding = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Authentication",
      description: "Firebase-powered authentication with Google login and role-based access control for teams.",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-Time Collaboration",
      description: "Live editing with WebSockets, real-time chat, and presence indicators for seamless teamwork.",
      gradient: "from-gray-600 to-gray-800"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description: "Automatic summarization, intelligent tag generation, and smart content categorization.",
      gradient: "from-violet-600 to-indigo-700"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Notes",
      description: "Record voice notes and automatically transcribe them to text using advanced speech recognition.",
      gradient: "from-gray-700 to-violet-600"
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Multimedia Support",
      description: "Upload images, optional OCR text extraction, and rich media integration within notes.",
      gradient: "from-violet-500 to-gray-700"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Organization",
      description: "Advanced search, folder organization, pinning, archiving, and intelligent tagging system.",
      gradient: "from-gray-800 to-violet-600"
    }
  ];

  const additionalFeatures = [
    "Real-time notifications and activity tracking",
    "Clean and minimal design with smooth transitions",
    "Responsive design optimized for all devices",
    "Advanced note management with favorites and archives",
    "Live presence indicators for collaborative editing",
    "Intelligent content suggestions and prioritization"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-gray-50">
        <motion.div
          style={{ y }}
          className="absolute inset-0 opacity-10"
        >
          <div className="absolute top-20 left-20 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center justify-center mb-8"
            >
              <Feather className="w-16 h-16 text-violet-600 mr-4" />
              <h1 className="text-6xl md:text-8xl font-extrabold text-black tracking-tight">
                Note<span className="text-violet-600">nest</span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              The next-generation AI-powered collaborative note-taking platform that transforms how you capture, organize, and share ideas with seamless real-time collaboration.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-3"
                onClick={() => navigate('/signup')}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 border-2 border-gray-300 hover:border-violet-400 text-gray-700 hover:text-violet-600 text-lg font-semibold rounded-xl transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-10 w-16 h-16 bg-violet-200 rounded-2xl opacity-60"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-10 w-20 h-20 bg-gray-200 rounded-full opacity-60"
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of note-taking with our comprehensive suite of AI-powered tools and collaborative features designed for modern productivity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4 group-hover:text-violet-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built with cutting-edge technology and designed for seamless productivity, collaboration, and exceptional user experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {additionalFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4 group"
                  >
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700 text-lg leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-50 to-violet-50 rounded-3xl p-10 shadow-lg border border-gray-200">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center group">
                    <div className="text-5xl font-bold text-violet-600 group-hover:scale-110 transition-transform">
                      24/7
                    </div>
                    <div className="text-gray-600 mt-3 font-medium">Real-time Sync</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-5xl font-bold text-gray-800 group-hover:scale-110 transition-transform">
                      AI
                    </div>
                    <div className="text-gray-600 mt-3 font-medium">Powered</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-5xl font-bold text-violet-600 group-hover:scale-110 transition-transform">
                      ∞
                    </div>
                    <div className="text-gray-600 mt-3 font-medium">Collaboration</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-5xl font-bold text-gray-800 group-hover:scale-110 transition-transform">
                      🔒
                    </div>
                    <div className="text-gray-600 mt-3 font-medium">Secure</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Ready to Transform Your Notes?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have revolutionized their productivity with Notenest's AI-powered collaborative platform.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(139, 92, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-violet-600 hover:bg-violet-700 text-white text-xl font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-3"
                onClick={() => navigate('/signup')}
              >
                Start Free Trial
                <Star className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 border-2 border-white/30 hover:border-violet-400 text-white hover:text-violet-300 text-xl font-bold rounded-xl transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Feather className="w-8 h-8 text-violet-600 mr-3" />
              <div className="text-3xl font-bold text-black">
                Note<span className="text-violet-600">nest</span>
              </div>
            </motion.div>
            <p className="text-gray-600 mb-8 text-lg">
              Transforming the way you think, collaborate, and create.
            </p>
            <div className="flex justify-center space-x-8 text-gray-500">
              <a href="#" className="hover:text-violet-600 transition-colors font-medium">Privacy</a>
              <a href="#" className="hover:text-violet-600 transition-colors font-medium">Terms</a>
              <a href="#" className="hover:text-violet-600 transition-colors font-medium">Support</a>
              <a href="#" className="hover:text-violet-600 transition-colors font-medium">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NoteNestLanding;