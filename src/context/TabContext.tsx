import { createContext, useContext, useState, ReactNode } from "react";

type TabContextType = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

// Context Provider
export const TabProvider = ({ children }: { children: ReactNode }) => {
    const [activeTab, setActiveTab] = useState("Home");

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabContext.Provider>
    );
};

// Custom hook to use the context
export const useTab = () => {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error("useTab must be used within a TabProvider");
    }
    return context;
};
