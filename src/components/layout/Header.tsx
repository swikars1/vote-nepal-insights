import { Link, useLocation } from "react-router-dom";
import { BarChart3, Users, PieChart, Menu, X, Languages } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Dashboard", labelNp: "ड्यासबोर्ड", icon: BarChart3 },
  { path: "/candidates", label: "Candidates", labelNp: "उम्मेदवारहरू", icon: Users },
  { path: "/analytics", label: "Analytics", labelNp: "विस्तृत विश्लेषण", icon: PieChart },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "np" : "en");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground leading-tight">
              {t("निर्वाचन डाटा", "Election Data")}
            </span>
            <span className="text-xs text-muted-foreground">{t("नेपाल चुनाव ड्यासबोर्ड", "Nepal Election Insight")}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{language === "en" ? item.label : item.labelNp}</span>
                </Link>
              );
            })}
          </nav>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="ml-4 gap-2 text-xs font-semibold"
          >
            <Languages className="h-4 w-4" />
            {language === "en" ? "नेपाली" : "English"}
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="gap-2 text-xs font-semibold h-9"
          >
            <Languages className="h-4 w-4" />
            {language === "en" ? "NP" : "EN"}
          </Button>

          <button
            className="p-2 rounded-lg hover:bg-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card p-4 animate-slide-in-bottom">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{language === "en" ? item.label : item.labelNp}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
