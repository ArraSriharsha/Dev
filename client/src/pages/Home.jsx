import React, { useState, useEffect } from 'react'
import { getHomeProblems, sendMessage } from '../services/api'
import Layout from '../components/Layout'
import { ArrowRight, Trophy, Users, Code, Loader, Loader2 } from 'lucide-react'
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

    return (
        <Layout>
            {/* Info Section */}
            <section id="home" className="py-20 bg-gradient-to-br from-white/80 to-red-100 md:py-32 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in">
                        Code, <span className="text-red-500">Compete</span> & Conquer
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-700 leading-relaxed">
                        Practice with thousands of coding challenges, enhance your skills,
                        and climb the global leaderboard.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <button 
                            onClick={() => navigate('/signin')}
                            className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Get Started
                        </button>
                        <button 
                            onClick={() => navigate('/problems')}
                            className="border-2 border-red-500 text-red-500 px-8 py-3 rounded-lg hover:bg-red-50 transform hover:scale-105 transition-all duration-300"
                        >
                            Explore Problems
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-bl from-red-100 to-white relative">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Code Arena?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group border-2 border-red-500 bg-white rounded-xl p-8 hover:shadow-lg hover:shadow-red-500 transition-all duration-300">
                            <div className="bg-red-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                                <Code className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Diverse Problem Set</h3>
                            <p className="text-gray-600 leading-relaxed">Practice with 1000+ problems across various difficulty levels and categories.</p>
                        </div>
                        <div className="group border-2 border-red-500 bg-white rounded-xl p-8 hover:shadow-lg hover:shadow-red-500 transition-all duration-300">
                            <div className="bg-red-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                                <Trophy className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Regular Contests</h3>
                            <p className="text-gray-600 leading-relaxed">Participate in weekly and biweekly contests to test your skills against others.</p>
                        </div>
                            <div className="group border-2 border-red-500 bg-white rounded-xl p-8 hover:shadow-lg hover:shadow-red-500 transition-all duration-300">
                            <div className="bg-red-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                                <Users className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Online Compiler</h3>
                            <p className="text-gray-600 leading-relaxed">Test your code with the online compiler to verify your test cases.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Problems Section */}
            <section className="py-20 bg-gradient-to-br from-white to-red-100">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Featured Problems</h2>
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
            <section id="categories" className="py-16 bg-gradient-to-bl from-red-100 to-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 font-roboto">Problem Categories</h2>
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
            <section id="about" className="py-16 bg-gradient-to-br from-white to-red-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">About Code Arena</h2>
                    <div className="max-w-4xl hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-300/50 mx-auto">
                        <div className="bg-white/60 backdrop-blur-lg border border-red-400 rounded-lg p-8 hover:shadow-lg hover:shadow-red-500 transition-all duration-300">
                            <p className="text-gray-700 text-lg mb-6">
                                Code Arena is a premier platform for competitive programming enthusiasts. We provide a space where programmers can practice, compete, and grow their skills through our extensive collection of coding challenges.
                            </p>
                            <p className="text-gray-700 text-lg mb-6">
                                Our mission is to make competitive programming accessible to everyone, from beginners to advanced coders. We believe in learning through practice and competition, which is why we offer a diverse range of problems and regular contests.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6 mt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-500 mb-2">1000+</div>
                                    <div className="text-gray-600">Coding Problems</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-500 mb-2">50K+</div>
                                    <div className="text-gray-600">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-500 mb-2">100+</div>
                                    <div className="text-gray-600">Daily Contests</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-gradient-to-bl from-red-100 to-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Get in Touch</h2>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-500 rounded-xl shadow-xl overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="bg-red-50 text-red-500 p-8">
                                    <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm text-red-500/80">Email</div>
                                                <div className="font-medium text-red-500">teamcodearena@gmail.com</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm text-red-500/80">Phone</div>
                                                <div className="font-medium text-red-500">+91 8143126615</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm text-red-500/80">Location</div>
                                                <div className="font-medium text-red-500">Hyderabad, India</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
                                    <form className="space-y-4" onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }}>
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="Your Username" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)} 
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <input 
                                                type="email" 
                                                placeholder="Your Email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)} 
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <textarea 
                                                placeholder="Your Message" 
                                                rows="4" 
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)} 
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none" 
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin w-5 h-5" />
                                                    Sending...
                                                </>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </button>
                                    </form>
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
