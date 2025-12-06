import React from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Users, Sprout, Farm, TrendingUp, Shield, HeartHandshake, Globe } from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: HeartHandshake,
      title: "Farmer First",
      description: "We prioritize farmer welfare and ensure they receive fair compensation for their produce."
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Strict quality controls and standards for all agricultural products on our platform."
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Promoting sustainable farming practices and environmental responsibility."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Leveraging technology to revolutionize traditional farming practices."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-green-900/10 pattern-dots"></div>
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-green-100 rounded-full px-4 py-2 mb-6">
              <Leaf className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Our Story</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-6">
              Cultivating Tomorrow's Agriculture
            </h1>
            <p className="text-xl text-green-700 max-w-2xl mx-auto">
              Krishi Sarjana is more than just a platform - it's a movement to empower farmers 
              and revolutionize agriculture through digital innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/10 rounded-3xl transform rotate-3"></div>
              <img 
                src="/images/farmers_in_field.jpg"
                alt="Farmers in field"
                className="relative rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-green-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                Founded in 2025, Krishi Sarjana emerged from a simple yet powerful vision: 
                to bridge the gap between farmers and consumers while promoting sustainable 
                agriculture practices.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We're committed to empowering farmers with technology, ensuring fair prices, 
                and making quality produce accessible to all. Through our platform, we're 
                building a future where agriculture is more efficient, sustainable, and 
                profitable for farmers.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-green-600 font-bold text-4xl mb-2">10K+</h3>
                  <p className="text-gray-600">Farmers Empowered</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-green-600 font-bold text-4xl mb-2">50+</h3>
                  <p className="text-gray-600">Districts Covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Our Values</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              These core principles guide everything we do at Krishi Sarjana
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <value.icon className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16 bg-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              A dedicated group of professionals working towards agricultural innovation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <div key={member} className="bg-green-800/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="w-24 h-24 bg-green-700 rounded-full mx-auto mb-4">
                  <img
                    src="/api/placeholder/96/96"
                    alt="Team member"
                    className="rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Team Member {member}</h3>
                <p className="text-green-100 text-center">Position</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Us in Revolutionizing Agriculture
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking to expand your reach or a consumer seeking 
            quality produce, we invite you to be part of our growing community.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-white text-green-700 rounded-lg font-medium text-lg 
                    shadow-lg hover:shadow-green-900/30 hover:bg-green-50 
                    transform transition duration-300 hover:-translate-y-1"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Pattern Background */}
      <style jsx>{`
        .pattern-dots {
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;