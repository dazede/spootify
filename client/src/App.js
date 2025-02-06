import React from 'react';
import "./App.css";
import axios from 'axios';

function App() {
    //const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const LaunchLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/login');
            console.log(response);
            /*if (!response.ok) {
                throw new Error('Failed to login')
            }*/
            const data = await response.data;
            window.location.replace(data);
            //const tryCallback = await axios.get('/callback');
            //console.log(tryCallback);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const GetUserData = async () => {
        console.log('Trying to get User Data');
        try {
            const response = await axios.get('/userData')
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Aurify</h1>
                <button onClick={LaunchLogin} disabled={loading}>
                    {loading ? "Redirecting..." : "login"}
                </button>
                <button onClick={GetUserData}>
                    {"get data"}
                </button>
            </header>
        </div>
    );
}

export default App;
