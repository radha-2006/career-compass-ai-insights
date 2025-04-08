
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-purple/10 p-4 rounded-full">
            <BriefcaseIcon className="h-12 w-12 text-brand-purple" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oops! This career path doesn't exist
        </p>
        <p className="text-gray-600 mb-8">
          The page you're looking for couldn't be found. Let's get you back on track.
        </p>
        <Button asChild className="bg-brand-purple hover:bg-brand-purple/90">
          <Link to="/">
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
