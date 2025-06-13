import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, PieChart, Shield, Zap, Users, Star, ArrowRight, DollarSign, BarChart, Target, CheckCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Landing = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const features = [{
    icon: TrendingUp,
    title: "Smart Analytics",
    description: "Get detailed insights into your spending patterns with advanced charts and reports."
  }, {
    icon: PieChart,
    title: "Visual Reports",
    description: "Beautiful charts and graphs that make understanding your finances effortless."
  }, {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is stored locally and never shared with third parties."
  }, {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with modern technology for instant responses and seamless experience."
  }, {
    icon: Target,
    title: "Budget Tracking",
    description: "Set budgets for different categories and track your progress in real-time."
  }, {
    icon: BarChart,
    title: "Expense Categories",
    description: "Organize your expenses with customizable categories for better organization."
  }];
  const testimonials = [{
    name: "Sarah Johnson",
    role: "Financial Advisor",
    content: "This tool has revolutionized how I track my personal expenses. The insights are incredible!",
    rating: 5
  }, {
    name: "Mike Chen",
    role: "Small Business Owner",
    content: "Perfect for managing both personal and business expenses. Clean interface and powerful features.",
    rating: 5
  }, {
    name: "Emma Davis",
    role: "Student",
    content: "Finally, a budgeting app that's actually easy to use. Love the visual reports!",
    rating: 5
  }];
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* SEO Meta Tags are handled in index.html */}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" style={{
          transform: `translateY(${scrollY * 0.5}px)`
        }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{
          transform: `translateY(${scrollY * -0.3}px)`
        }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
              ✨ New: Advanced Analytics Dashboard
            </Badge>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight flex items-center justify-center gap-4 md:text-6xl">
              <DollarSign className="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
              Master Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take control of your expenses with our intelligent tracking system. 
              Get insights, set budgets, and achieve your financial goals with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button onClick={() => navigate('/app')} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Tracking Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button variant="outline" size="lg" onClick={scrollToFeatures} className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">$2M+</div>
                <div className="text-gray-600">Tracked Expenses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">User Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to take control of your finances in one beautiful, easy-to-use platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Add Your Expenses</h3>
              <p className="text-gray-600 leading-relaxed">
                Quickly log your daily expenses with our intuitive interface. Categorize and tag for better organization.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Track & Analyze</h3>
              <p className="text-gray-600 leading-relaxed">
                Watch your spending patterns emerge with beautiful charts and detailed analytics that provide real insights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Achieve Your Goals</h3>
              <p className="text-gray-600 leading-relaxed">
                Set budgets, monitor progress, and make informed decisions to reach your financial objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their financial lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of users who have already taken control of their financial future. 
            Start your journey today with our powerful expense tracking platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={() => navigate('/app')} size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2 text-sm opacity-75">
              <CheckCircle className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Expense Tracker Pro
            </h3>
            <p className="text-gray-400 mb-6">
              Your intelligent financial companion for smarter money management.
            </p>
            
            <div className="flex justify-center space-x-6 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2024 Expense Tracker Pro. Built with ❤️ for better financial futures.
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;