import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          {language === "en" ? "Oops! Page not found" : "उप! पृष्ठ फेला परेन"}
        </p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {language === "en" ? "Return to Home" : "गृह पृष्ठमा फर्कनुहोस्"}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
