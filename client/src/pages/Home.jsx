import React, { useState, useEffect } from 'react'
import { getHomeProblems } from '../services/api'
import Layout from '../components/Layout'
import { ArrowRight, Trophy, Users, Code } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
    const [featuredProblems, setFeaturedProblems] = useState([]);
    // Static featured problems
    useEffect(() => {
        const fetchFeaturedProblems = async () => {
            const response = await getHomeProblems();   
            setFeaturedProblems(response.data);
        };
        fetchFeaturedProblems();
    }, []);

    return (
        <Layout>
            {/* Info Section */}
            <section className="py-16 bg-gradient-to-b from-white to-gray-200 md:py-24 text-center">
                <h2 className="text-3xl md:text-5xl  font-bold mb-6">
                    Code,Compete <span className="text-red-500">& Conquer</span>
                </h2>
                <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-oj-gray">
                    Practice with thousands of coding challenges, enhance your skills, 
                    and climb the global leaderboard.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button size="lg" className="bg-red-500 rounded-md hover:bg-red-500/90 text-white px-8" onClick={() => navigate('/signin')}>
                        Get Started
                    </button>
                    <button size="lg" variant="outline" className="border-2 border-red-500 rounded-md bg-white text-red-500 hover:bg-red-100 px-8" onClick={() => navigate('/problems')}>
                        Explore Problems 
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gradient-to-b from-gray-200 to-white rounded-lg">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Code Arena?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className=" hover:scale-105 bg-white/60 backdrop-blur-lg border border-red-400 rounded-lg hover:shadow-md hover:border-red-500 transition-all duration-300">  
                        <FeatureCard 
                            icon={<Code className="w-12 h-12 text-red-500" />}
                            title="Diverse Problem Set"
                            description="Practice with 1000+ problems across various difficulty levels and categories."
                        />
                         </div>
                         <div className=" hover:scale-105 bg-white/60 backdrop-blur-lg border border-red-400 rounded-lg hover:shadow-md hover:border-red-500 transition-all duration-300">
                        <FeatureCard
                            icon={<Trophy className="w-12 h-12 text-red-500" />}
                            title="Regular Contests"
                            description="Participate in weekly and biweekly contests to test your skills against others."
                        />
                        </div>
                        <div className=" hover:scale-105 bg-white/60 backdrop-blur-lg border border-red-400 rounded-lg hover:shadow-md hover:border-red-500 transition-all duration-300">
                        <FeatureCard
                            icon={<Users className="w-12 h-12 text-red-500" />}
                            title="Online Compiler"
                            description="Test your code with the online compiler to verify your test cases."
                        />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Problems Section */}
            <section className="py-16 bg-gradient-to-b from-white to-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl px-4 font-bold">Featured Problems</h2>
                    <Link to="/problems" className="flex items-center px-3 text-red-500 hover:underline">
                        View All <ArrowRight className="ml-1 h-4 w-4"/>
                    </Link> 
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 px-6">
                    {featuredProblems.map((problem)  => (
                        <Link 
                            key={problem._id}
                            to={`/problems/${problem._id}`}
                            className="border rounded-lg px-4 p-2 hover:border-red-500 hover:shadow-md transition-all bg-white"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg">{problem.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{problem.description.substring(0, 100)}...</p>
                                </div>
                                <DifficultyBadge difficulty={problem.difficulty} />
                            </div>
                        </Link>
                    ))}
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
