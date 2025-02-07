import React from 'react';
import "./App.css";
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayData from './DataPage';

function App() {
	//const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const [hasRendered, setHasRendered] = React.useState(false);

	const LaunchLogin = async () => {
		setLoading(true);
		try {
			const response = await axios.get('/login');
			/*if (!response.ok) {
				throw new Error('Failed to login')
			}*/
			const data = await response.data;
			window.location.replace(data);
			setLoading(false);

		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	React.useEffect(() => {
		if (!hasRendered) {
			setHasRendered(true);
		}
	}, [hasRendered]);

	return (
		<BrowserRouter>
			<Routes>
				<Route exact path="/" element={
					<div className="App">
						<header className="App-header">
							<h1>Aurify</h1>
							<button onClick={LaunchLogin} disabled={loading}>
								{loading ? "Redirecting..." : "login"}
							</button>
						</header>
					</div>}> 
				</Route>
				<Route path="/aurify" element={hasRendered ? < DisplayData /> : null}></Route>
			</Routes>    
		</BrowserRouter>
	);
}

export default App;
