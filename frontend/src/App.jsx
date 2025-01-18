import { ThemeProvider } from "./components/ThemeProvider";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <h1>Vite + React </h1>
      <Button>Click me</Button>
    </ThemeProvider>
  );
}

export default App;
