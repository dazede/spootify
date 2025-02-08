import React from 'react';
import axios from 'axios';

const DisplayData = () => {
    const [user, setUser] = React.useState("");
    const [userTop, setUserTop] = React.useState("");
    const [dataRetrieved, setDataRetrieved] = React.useState(false);
    
    const GetUserData = async () => {
        console.log('Trying to get User Data');
        try {
            const response = await axios.get('/userData')
            console.log(response.data);
            setUser(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const GetUserTopData = async () => {
        console.log('Trying to get User Top Data');
        try {
            const response = await axios.get('/userTopData');
            console.log(response.data);
            setUserTop(response.data);
        } catch (error) {
            console.log(error);
        }
    };


    React.useEffect(() => {
        GetUserData();
        GetUserTopData();
        if (!dataRetrieved) {
            setDataRetrieved(true);
        }
    }, [dataRetrieved]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Aurify</h1>
                {dataRetrieved && <p>{user}</p>}
                {dataRetrieved && <p>{user}</p>}       
            </header>
        </div>
    ); 
};

export default DisplayData;