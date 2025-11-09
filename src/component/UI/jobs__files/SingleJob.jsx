// App.jsx
import { useState, useMemo, useEffect } from "react";
import Sidebar from './../../DashBoard_files/Dash__components/Sidebar';
import ContentArea from "../../DashBoard_files/Dash__components/ContentPage";

// 
const TAGS = ["overview", "customers", "orders", "settings"];
// Example: content data you want to show per tag
const CONTENT_BY_TAG = {
    overview: { title: "Overview", body: "KPIs and quick stats." },
    customers: { title: "Customers", body: "Customer list and segments." },
    orders: { title: "Orders", body: "Recent orders and fulfillment." },
    settings: { title: "Settings", body: "Profile, preferences, and security." },
};

export default function SinglePage() {
    const [activeTag, setActiveTag] = useState("overview");
    // (Optional) If you need to fetch when the tag changes:
    const [loading, setLoading] = useState(false);
    const [remoteData, setRemoteData] = useState(null);
    const [error, setError] = useState(null);
    // 
    useEffect(() => {
        // Simulate fetch on tag change
        let isCancelled = false;
        setLoading(true);
        setError(null);
        setRemoteData(null);

        // Replace with a real fetch() based on activeTag
        const timer = setTimeout(() => {
            if (isCancelled) return;
            // Simulated data per tag
            setRemoteData({ message: `Fetched data for "${activeTag}"` });
            setLoading(false);
        }, 500);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [activeTag]);

    // Content to display falls back to static map, plus remoteData if available
    const content = useMemo(() => {
        const base = CONTENT_BY_TAG[activeTag] ?? { title: "", body: "" };
        return {
            ...base,
            extra: remoteData?.message ?? null,
        };
    }, [activeTag, remoteData]);


    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    return (
        <div style={{ display: "grid grid-col-2 w-full h-full p-8 rounded ", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
            <Sidebar tags={TAGS} activeTag={activeTag} onChange={setActiveTag} capitalize={capitalize} />
            <ContentArea loading={loading} error={error} content={content} />
        </div>
    );   
}
//


// 


