import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAllowed(!!session);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] text-white flex items-center justify-center">
        Checking access...
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;