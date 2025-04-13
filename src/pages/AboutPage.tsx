
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Leaf, Shield, Sparkles, BookOpen, Heart } from "lucide-react";

const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="space-y-12"
      >
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            About Plant Doc
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Empowering plant enthusiasts with AI-driven diagnostics and care recommendations
          </p>
          <Separator className="max-w-md mx-auto" />
        </section>

        {/* Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              At Plant Doc, we believe that everyone deserves a thriving garden. Our mission is to democratize plant care knowledge by leveraging cutting-edge AI technology to provide accurate plant disease diagnostics and personalized care recommendations.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether you're a seasoned gardener or just starting your plant journey, Plant Doc is here to help you nurture your green companions back to health and prevent future issues.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-muted rounded-lg p-8 shadow-md"
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Leaf className="h-10 w-10 text-primary" />, text: "Plant Health" },
                { icon: <Shield className="h-10 w-10 text-primary" />, text: "Disease Prevention" },
                { icon: <Sparkles className="h-10 w-10 text-primary" />, text: "Smart Diagnosis" },
                { icon: <Heart className="h-10 w-10 text-primary" />, text: "Care Guidance" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-2">
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary">How Plant Doc Works</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              A seamless experience from diagnosis to treatment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Upload",
                desc: "Take a clear photo of your plant showing the affected areas and upload it to our platform.",
                color: "from-green-50 to-emerald-100",
                delay: 0.2,
              },
              {
                title: "Analyze",
                desc: "Our AI powered by Google Gemini analyzes the image and identifies potential diseases or issues.",
                color: "from-blue-50 to-indigo-100",
                delay: 0.4,
              },
              {
                title: "Treat",
                desc: "Receive detailed diagnosis, treatment steps, and care recommendations tailored to your plant.",
                color: "from-purple-50 to-violet-100",
                delay: 0.6,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step.delay, duration: 0.5 }}
              >
                <Card className={`h-full p-6 bg-gradient-to-br ${step.color} border-none shadow-md`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center text-lg font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technology */}
        <section className="bg-muted rounded-xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-primary text-center">Our Technology</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Google Gemini AI",
                description: "Advanced image recognition for accurate plant disease identification",
                icon: <Sparkles className="h-6 w-6 text-primary" />,
              },
              {
                title: "Supabase",
                description: "Secure data storage and authentication for personalized recommendations",
                icon: <Shield className="h-6 w-6 text-primary" />,
              },
              {
                title: "React & TypeScript",
                description: "Fast, responsive interface for seamless user experience",
                icon: <BookOpen className="h-6 w-6 text-primary" />,
              },
              {
                title: "Plant Database",
                description: "Extensive knowledge base of plants, diseases, and care guidelines",
                icon: <Leaf className="h-6 w-6 text-primary" />,
              },
            ].map((tech, index) => (
              <Card key={index} className="p-5 bg-background border border-border">
                <div className="flex flex-col space-y-3">
                  <div className="bg-primary/10 p-3 rounded-full w-fit">
                    {tech.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{tech.title}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Get Started CTA */}
        <section className="text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold text-primary">Ready to help your plants thrive?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of your plant and get expert care recommendations in seconds.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="/diagnose" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 transition-colors"
            >
              <Check className="h-5 w-5" />
              Diagnose Your Plant
            </a>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
};

export default AboutPage;
