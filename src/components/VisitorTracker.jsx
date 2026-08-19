import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPage, startHeartbeat } from "@/lib/visitorTracking";

export default function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPage(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const stop = startHeartbeat();
    return stop;
  }, []);

  return null;
}