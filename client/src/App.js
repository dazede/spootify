import React from 'react';
import "./App.css";

function App() {
    //const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const LaunchLogin = async () => {
        setLoading(true);

        try {
            const response = await fetch('/login');
            if (!response.ok) {
                throw new Error('Failed to login')
            }
            const data = await response.json();
            console.log(data);
            window.location.replace(data)
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Aurify</h1>
                <button onClick={LaunchLogin} disabled={loading}>
                    {loading ? "Redirecting..." : "login"}
                </button>
            </header>
        </div>
    );
}

export default App;
