import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { DisplayNameModal } from "./components/DisplayNameModal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerProfile } from "./hooks/useQueries";
import { AdminTab } from "./pages/AdminTab";
import { Dashboard } from "./pages/Dashboard";
import { TrackerTab } from "./pages/TrackerTab";
import { UserTab } from "./pages/UserTab";

type Tab = "dashboard" | "admin" | "user" | "tracker";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const [showNameModal, setShowNameModal] = useState(false);

  useEffect(() => {
    if (
      !isInitializing &&
      !profileLoading &&
      identity &&
      profile !== undefined
    ) {
      if (profile === null || !profile.name?.trim()) {
        setShowNameModal(true);
      }
    }
  }, [identity, profile, isInitializing, profileLoading]);

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "admin":
        return <AdminTab />;
      case "user":
        return <UserTab />;
      case "tracker":
        return <TrackerTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1">{renderPage()}</div>
      <Footer />
      <DisplayNameModal
        open={showNameModal}
        onClose={() => setShowNameModal(false)}
      />
      <Toaster
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border",
            title: "text-foreground",
            description: "text-muted-foreground",
          },
        }}
      />
    </div>
  );
}
