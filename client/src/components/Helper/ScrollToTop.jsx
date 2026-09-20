// src/helpers/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the window to the top instantly on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "instant" to prevent jittery smooth scrolling on page loads
    });
  }, [pathname]);

  return null; // This component doesn't render any UI
};

export default ScrollToTop;