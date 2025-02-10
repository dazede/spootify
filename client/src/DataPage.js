import React from 'react';
import axios from 'axios';

const DisplayData = () => {
    const [user, setUser] = React.useState("");
    const [userTop, setUserTop] = React.useState("");
    const [userDataRetrieved, setUserDataRetrieved] = React.useState(false);
    const [userTopDataRetrieved, setUserTopDataRetrieved] = React.useState(false);
    
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
            const countDict = {};  
            response.data.forEach((value) => {
            countDict[value] = (countDict[value] || 0) + 1;
            });
        
            setUserTop(countDict);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        GetUserData();
        if (!userDataRetrieved) {
            setUserDataRetrieved(true);
        }
    }, [userDataRetrieved]);

    React.useEffect(() => {
        GetUserTopData();
        if (!userTopDataRetrieved) {
            setUserTopDataRetrieved(true);
        }
    }, [userTopDataRetrieved]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Aurify</h1>
                {userDataRetrieved && <p>{user}</p>}

                {userTopDataRetrieved && Object.keys(userTop).length > 0 && (
                <section>
                    <ul>
                        {Object.entries(userTop)
                        .sort(([, valueA], [, valueB]) => valueB - valueA)
                        .slice(0, 6)
                        .map(([key, value]) => (
                            <li key={key}>{`${key}: ${value}`}</li>
                        ))}
                    </ul>
                </section>
                )}
            </header>
        </div>
      );
};

export default DisplayData;