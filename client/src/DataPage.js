import React from 'react';
import axios from 'axios';

const DisplayData = () => {
    const [user, setUser] = React.useState("");
    const [showUser, setShowUser] = React.useState(false);
    const [dataRetrieved, setDataRetrieved] = React.useState(false);
    
    const GetUserData = async () => {
        setShowUser(false);
        console.log('Trying to get User Data');
        try {
            const response = await axios.get('/userData')
            console.log(response.data);
            setShowUser(true);
            setUser(response.data);     
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        GetUserData();
        if (!dataRetrieved) {
            setDataRetrieved(true);
        }
    }, [dataRetrieved]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Aurify</h1>
                {showUser && <p>{user}</p>}       
            </header>
        </div>
    ); 
};

export default DisplayData;