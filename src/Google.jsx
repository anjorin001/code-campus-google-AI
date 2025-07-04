import React, { useState } from "react";
import SearchBar from "./components/SearchBar";

const CodeCampus = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null); 
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const cx = import.meta.env.VITE_GOOGLE_CX;
  const hfToken = import.meta.env.VITE_HUGGINGFACE_TOKEN;
  console.log(hfToken)
  console.log(data)
  const handleSearch = async (search) => {
    try {
      if (!search) return;

      setLoading(true);
      setError(null);
      setSummary(null); 

      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
          search
        )}&key=${apiKey}&cx=${cx}`
      );

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setData(data);
    } catch (err) {
      console.error("ERROR:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

const handleSummarize = async () => {
  if (!data?.items?.[0]?.snippet) return;

const context = `${data.items[0].title} - ${data.items[0].snippet}`;
;
  setLoading(true);
  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: context,
        }),
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        setSummary("Summarize not available at the moment (Unauthorized).");
      } else {
        setSummary("Summarize not available at the moment.");
      }
      throw new Error(`Summary request failed with status ${res.status}`);
    }

    const result = await res.json();
    setSummary(result?.[0]?.summary_text || "No summary returned.");
  } catch (err) {
    console.error("Summary Error:", err);
    setError(err);
    if (!summary) {
      setSummary("Summarize not available at the moment.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="codecampus-container">
      <header className="codecampus-header">
        <h1 className="codecampus-logo">CodeCampus</h1>
      </header>
      
      <main className="codecampus-main">
        <SearchBar onSearch={handleSearch} />
        
        {loading && (
          <div className="loading-container">
            <div className="gemini-loader"></div>
          </div>
        )}
        
        {data && (
          <div className="summary-section">
            <button 
              onClick={handleSummarize} 
              className="summarize-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Summarizing...
                </>
              ) : (
                "Summarize This Result"
              )}
            </button>
            
            {summary && (
              <div className="summary-container">
                <h3>📝 Summary:</h3>
                <p>{summary}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="search-results">
          {data?.items?.map((item, index) => (
            <div key={index} className="search-result">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <h2>{item.title}</h2>
              </a>
              <p className="result-url">{item.displayLink}</p>
              <p className="result-snippet">{item.snippet}</p>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="codecampus-footer">
        <p>© {new Date().getFullYear()} CodeCampus - Search powered by Google API</p>
        <p>~ANJORIN</p>
      </footer>
    </div>
  );
};

export default CodeCampus;