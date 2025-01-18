import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="text-xl font-bold">North Chat</div>
            <div>
              <Button variant="ghost" asChild>
                <Link to="/about">About</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-8xl font-bold mb-8">North Chat</h1>
          <Button asChild size="lg">
            <Link to="/chat">Start Chatting with Friends</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 North Chat. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
