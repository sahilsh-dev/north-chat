import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Canvas } from "@react-three/fiber";
import { Scene, SpinningLogo } from "@/components/HomeScene";

export default function Home() {
	return (
		<div
			className={`relative w-full h-screen bg-black text-white overflow-hidden`}
		>
			<header className="absolute top-2 left-0 right-0 z-10 p-4">
				<nav className="flex justify-between items-center max-w-6xl mx-auto">
					<div className="flex items-center">
						<div className="hidden sm:block w-20 h-20">
							<Canvas camera={{ position: [0, 0, 5] }}>
								<ambientLight intensity={0.5} />
								<pointLight position={[10, 10, 10]} />
								<SpinningLogo />
							</Canvas>
						</div>
						<span className="text-2xl font-bold">North Chat</span>
					</div>
					<ul className="flex space-x-6">
						<li>
							<Link to="/about" className="hover:text-gray-300">
								About
							</Link>
						</li>
						<li>
							<Link to="/contact" className="hover:text-gray-300">
								Contact
							</Link>
						</li>
						<li>
							<a
								href="https:github.com/sahilsh-dev/north-chat"
								className="hover:text-gray-300"
								target="_blank"
							>
								Github
							</a>
						</li>
					</ul>
				</nav>
			</header>
			<div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 mt-12 sm:mt-0 px-4 w-full max-w-4xl">
				<h1 className="text-3xl md:text-6xl font-bold mb-8 max-w-4xl mx-auto">
					Real-Time Conversations Made Effortless
				</h1>
				<h2 className="text-xl mb-10">
					Engage your visitors instantly with our intuitive live chat platform.
				</h2>
				<Button
					className="font-medium py-3 px-6 transition duration-300"
					asChild
				>
					<Link to="/chat">Start Chatting</Link>
				</Button>
			</div>
			<Canvas
				shadows
				camera={{ position: [30, 30, 30], fov: 40 }}
				className="absolute inset-0"
			>
				<Scene />
			</Canvas>
		</div>
	);
}
