
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Daily Planner</h1>
        <p className="text-xl text-gray-600 mb-6">Organize your day efficiently with our time-block planner</p>
        
        <Link to="/planner">
          <Button size="lg" className="gap-2">
            <Calendar className="h-5 w-5" />
            Open Daily Planner
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
