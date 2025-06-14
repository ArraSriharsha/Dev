import React, { useState, useEffect } from 'react'
import { getHomeProblems, sendMessage, authCheck } from '../services/api'
import Layout from '../components/Layout'
import { ArrowRight, Trophy, Users, Code, Loader, Loader2, Send, Mail, Clock, MessageCircle, User, Cpu, Zap, BarChart, Star, Info } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const Home = () => {
    const navigate = useNavigate();
    const [featuredProblems, setFeaturedProblems] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [featuredLoading, setFeaturedLoading] = useState(false);
    // Static featured problems
    useEffect(() => {
        const fetchFeaturedProblems = async () => {
            setFeaturedLoading(true);
            const response = await getHomeProblems();
            setFeaturedProblems(response.data);
            setFeaturedLoading(false);
        };
        fetchFeaturedProblems();
        // Test toast
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = {
                username: name,
                email: email,
                message: message
            }
            if(!name || !email || !message) {
                toast.error('Please fill all the fields')
                return;
            }
            const response = await sendMessage(data);
            if (response.status === 200) {
                toast.success('Message sent successfully!')
                // Reset form fields
                setName('');
                setEmail('');
                setMessage('');
            } else {
                toast.error('Failed to send message')
            }
        } catch (error) {
            if(error.response.status === 401){
                toast.error('Please Sign in to send message')
            }
            else{
                toast.error('Failed to send message')
            }
        } finally {
            setIsLoading(false);
        }
    }
    const handleGetStarted = async () => {
        try{
            const response = await authCheck();
            if(response.data.message === "Token Found"){
                toast.success('You\'ve already Signed In!')
                navigate('/');
                }
            else{
                navigate('/signin');
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            toast.error('Error checking auth');
        }
    }
    return (
        <Layout>
            {/* Info Section */}
            <section id="home" className="min-h-[90vh] py-32 bg-gradient-to-br from-white/80 to-red-100 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-7xl font-bold mb-8 animate-fade-in">
                        Code, <span className="text-red-500">Compete</span> & Conquer
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gradient bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-gray-500 to-red-500 leading-relaxed">
                        Master competitive programming with real-time code execution, AI-powered learning, and a vibrant community of coders.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 mb-24">
                        <button 
                            onClick={() => handleGetStarted()}
                            className="bg-red-500 text-white px-10 py-4 rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                        >
                            Get Started
                        </button>
                        <button 
                            onClick={() => navigate('/problems')}
                            className="border-2 border-red-500 text-red-500 px-10 py-4 rounded-lg hover:bg-red-50 transform hover:scale-105 transition-all duration-300 text-lg"
                        >
                            Explore Problems
                        </button>
                    </div>

                    <div className="text-center py-14 max-w-3xl mx-auto mb-16">
                        <div className="relative h-30 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <h2 className="relative text-4xl md:text-5xl font-extrabold animate-gradient bg-gradient-to-r from-red-500 via-black to-red-500 bg-clip-text text-transparent bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 py-4">
                                Craft Your Coding Legacy
                            </h2>
                        </div>
                        <p className="text-2xl mt-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-gray-500 via-red-500 to-gray-500 font-light tracking-wide">
                            Transform your ideas into elegant solutions
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Code Editor */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                                {/* Editor Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="text-gray-400 text-sm ml-4">welcome.cpp</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">C++</span>
                                    </div>
                                </div>

                                {/* Code Content */}
                                <div className="p-4 font-mono text-sm h-[200px] overflow-y-auto">
                                    <pre className="text-gray-300 text-left">
                                        <code className="block text-left">{`#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to Code Arena!" << endl;
    cout << "Start your coding journey today." << endl;
    return 0;
}`}</code>
                                    </pre>
                                </div>

                                {/* Output Display */}
                                <div className="border-t border-gray-700">
                                    <div className="px-4 py-2 bg-gray-800 ">
                                        <span className="text-gray-400 text-sm">Output</span>
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-gray-400 text-sm">Ready</span>
                                        </div>
                                    </div>
                                    <div id="output-display" className="p-4 font-mono text-sm min-h-[100px] bg-gray-800/50">
                                        <div className="block text-left text-gray-400">Click 'Run Code' to see the output</div>
                                    </div>
                                </div>

                                {/* Editor Footer */}
                                <div className="px-4 py-3 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-gray-400 text-sm">Ready</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const outputDisplay = document.getElementById('output-display');
                                            outputDisplay.innerHTML = `
                                                <div class="animate-fade-in">
                                                    <div class="block text-left text-green-400 mb-2">Program executed successfully!</div>
                                                    <div class="block text-left text-gray-300">
                                                        Welcome to Code Arena!<br>
                                                        Start your coding journey today.
                                                    </div>
                                                </div>
                                            `;
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <span>Run Code</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className="space-y-6">
                            <div className="bg-white/80 backdrop-blur-sm border-2 border-red-500 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <Code className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Secure Code Execution</h3>
                                        <p className="text-gray-600">Run code safely in isolated Docker containers with real-time compilation</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">Docker</span>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Isolated</span>
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">Secure</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm border-2 border-red-500 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Smart Queue System</h3>
                                        <p className="text-gray-600">Efficient job processing with real-time status updates</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">Real-time</span>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Reliable</span>
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">Scalable</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm border-2 border-red-500 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
                                        <p className="text-gray-600">Get instant feedback and hints from our advanced AI assistant</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">Smart Hints</span>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">Code Analysis</span>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">24/7 Support</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Problems Section */}
            <section className="py-20 bg-gradient-to-bl from-red-100 to-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl text-gradient bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-black to-red-500 font-bold md:text-4xl font-bold">Featured Problems</h2>
                        <Link to="/problems" className="flex items-center text-red-500 hover:text-red-600 transition-colors underline">
                            View All <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                    {featuredLoading ? (
                        <div className="flex justify-center items-center">
                            <Loader2 className="animate-spin w-5 h-5" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-4 gap-6">
                            {featuredProblems.map((problem) => (
                                <Link
                                key={problem._id}
                                to={`/problems/${problem._id}`}
                                    className="group border-2 border-red-500 bg-white rounded-xl p-6 transition-all duration-300 hover:scale-105"
                                >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-lg group-hover:text-red-500 transition-colors">{problem.title}</h3>
                                    <DifficultyBadge difficulty={problem.difficulty} />
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3">{problem.description}</p>
                            </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Problem Categories Section */}
            <section id="categories" className="py-16 bg-gradient-to-br from-white to-red-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl text-gradient bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-black to-red-500 font-bold text-center mb-12 font-roboto">Problem Categories</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/60 backdrop-blur-lg border border-red-400 rounded-lg p-6 hover:scale-105 transition-all duration-300 group">
                            <div className="relative h-40 mb-6 overflow-hidden rounded-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-24 h-24 text-blue-500/50 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Data Structures</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Arrays & Strings</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Linked Lists</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Trees & Graphs</span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-sm text-gray-500">200+ Problems</span>
                                <span className="text-sm font-medium text-blue-500">Easy to Hard</span>
                            </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-lg border border-red-400 rounded-lg p-6 hover:scale-105 transition-all duration-300 group">
                            <div className="relative h-40 mb-6 overflow-hidden rounded-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 group-hover:from-green-500/30 group-hover:to-teal-500/30 transition-all duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-24 h-24 text-green-500/50 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Algorithms</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Dynamic Programming</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Greedy Algorithms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Search & Sort</span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-sm text-gray-500">300+ Problems</span>
                                <span className="text-sm font-medium text-green-500">Medium to Hard</span>
                            </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-lg border border-red-400 rounded-lg p-6 hover:scale-105 transition-all duration-300 group">
                            <div className="relative h-40 mb-6 overflow-hidden rounded-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-24 h-24 text-red-500/50 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Contest Problems</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Time Challenges</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Optimization</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Real-time Contests</span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-sm text-gray-500">150+ Problems</span>
                                <span className="text-sm font-medium text-red-500">Hard to Expert</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-16 bg-gradient-to-bl from-red-100 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 animate-gradient bg-gradient-to-r from-red-500 via-black to-red-500 bg-clip-text text-transparent">
                            About Code Arena
                        </h2>
                        <p className="text-xl text-gradient bg-clip-text text-transparent bg-gradient-to-r from-gray-500 via-red-500 to-gray-500">
                            Your journey to coding excellence starts here
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white/80 hover:shadow-lg hover:shadow-red-500 backdrop-blur-sm border-2 border-red-500 rounded-xl p-8 transition-all duration-300">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-red-50 p-6 rounded-xl">
                                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Code Arena is a premier platform for competitive programming enthusiasts. We provide a space where programmers can practice, compete, and grow their skills through our extensive collection of coding challenges.
                                        </p>
                                    </div>
                                    <div className="bg-red-50 p-6 rounded-xl">
                                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Vision</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Our mission is to make competitive programming accessible to everyone, from beginners to advanced coders. We believe in learning through practice and competition, which is why we offer a diverse range of problems and regular contests.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white border-2 border-red-500 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                                            <div className="text-4xl font-bold text-red-500 mb-2">1000+</div>
                                            <div className="text-gray-600">Coding Problems</div>
                                        </div>
                                        <div className="bg-white border-2 border-red-500 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                                            <div className="text-4xl font-bold text-red-500 mb-2">50K+</div>
                                            <div className="text-gray-600">Active Users</div>
                                        </div>
                                        <div className="bg-white border-2 border-red-500 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                                            <div className="text-4xl font-bold text-red-500 mb-2">100+</div>
                                            <div className="text-gray-600">Daily Contests</div>
                                        </div>
                                        <div className="bg-white border-2 border-red-500 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                                            <div className="text-4xl font-bold text-red-500 mb-2">24/7</div>
                                            <div className="text-gray-600">AI Support</div>
                                        </div>
                                    </div>
                                    <div className="bg-white border-2 border-red-500 rounded-xl p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">Ready to Start?</h3>
                                                <p className="text-gray-600">Begin your coding journey today</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                                <div className="text-red-500 font-semibold">Easy</div>
                                                <div className="text-sm text-gray-600">Beginner</div>
                                            </div>
                                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                                <div className="text-red-500 font-semibold">Medium</div>
                                                <div className="text-sm text-gray-600">Intermediate</div>
                                            </div>
                                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                                <div className="text-red-500 font-semibold">Hard</div>
                                                <div className="text-sm text-gray-600">Advanced</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-gradient-to-bl from-red-100 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 animate-gradient bg-gradient-to-r from-red-500 via-black to-red-500 bg-clip-text text-transparent">
                            Get in Touch
                        </h2>
                        <p className="text-xl text-gradient bg-clip-text text-transparent bg-gradient-to-r from-gray-500 via-red-500 to-gray-500">
                            Have questions? We're here to help!
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Contact Form */}
                            <div className="bg-white/80 backdrop-blur-sm border-2 border-red-500 rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Submit Your Feedback</h3>
                                    <p className="text-sm text-gray-600 mt-1">We'd love to hear from you</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                            rows="3"
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-lg font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex items-start gap-2">
                                            <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <Info className="h-3 w-3 text-red-500" />
                                            </div>
                                            <p className="text-sm text-red-600">For immediate assistance, use our AI assistant while solving problems.</p>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-6">
                                <div className="bg-white/80 backdrop-blur-sm border-2 border-red-500 rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <Mail className="h-4 w-4 text-red-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Email</h4>
                                                <p className="text-gray-600">teamcodearena@gmail.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <Clock className="h-4 w-4 text-red-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Response Time</h4>
                                                <p className="text-gray-600">Within 24 hours</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                            <Star className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">User Reviews</h3>
                                            <p className="text-white/80 text-sm">What our coders say</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white/10 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                                                ))}
                                            </div>
                                            <p className="text-sm text-white/80 mb-2">"The AI assistant is incredibly helpful. It's like having a mentor available 24/7!"</p>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-white/20"></div>
                                                <span className="text-sm font-medium">Alex K.</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                                                ))}
                                            </div>
                                            <p className="text-sm text-white/80 mb-2">"Best platform for competitive programming. The problem quality is excellent."</p>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-white/20"></div>
                                                <span className="text-sm font-medium">Sarah M.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </Layout>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            {icon}
            <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

const DifficultyBadge = ({ difficulty }) => {
    const getBadgeVariant = () => {
        switch (difficulty) {
            case "Easy": return "bg-green-500 hover:bg-green-600";
            case "Medium": return "bg-yellow-500 hover:bg-yellow-600";
            case "Hard": return "bg-red-500 hover:bg-red-600";
            default: return "bg-gray-500";
        }
    };

    return (
        <span className={`${getBadgeVariant()} text-white text-xs px-2 py-1 rounded-full`}>
            {difficulty}
        </span>
    );
};

export default Home;
