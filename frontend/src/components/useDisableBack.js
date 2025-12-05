import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useDisableBack() {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent navigating back
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };

    return () => {
      window.onpopstate = null;
    };
  }, [navigate]);
}
