import React from 'react';
import axios from 'axios';
import "./App.css";
import { PieChart, Pie, Cell } from 'recharts';

const DisplayData = () => {
    const [user, setUser] = React.useState("");
    const [userTop, setUserTop] = React.useState("");
    
    const GetUserData = async () => {
        try {
            const response = await axios.get('/userData')
            setUser(response.data);
            console.log('User Data Success');
        } catch (error) {
            console.log(error);
        }
    };

    const GetUserTopData = async () => {
        try {
            const response = await axios.get('/userTopData');
            const countDict = {};  
            response.data.forEach((value) => {
            countDict[value] = (countDict[value] || 0) + 1;
            });
     
            const sortedData = Object.entries(countDict)
                .sort(([, A], [, B]) => B - A)
                .slice(0,6)
                .map(([key, value]) => ({
                    name: key.includes('alternative') ? key.replace('alternative', 'alt') : key,
                    value: value
                  }));
            setUserTop(sortedData);
            console.log('User Top Data Success');
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        GetUserData();
        GetUserTopData();
    }, []);

    const RADIAN = Math.PI / 180;
    const renderCustomisedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text 
        className="pie-text"
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {userTop[index].name}
      </text>
    );
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00CFFF', '#008042'];

    return (
        <div className="App">
            <header className="App-header">
                <h1>Aurify</h1>
                {user && <p>{user}</p>}
           
                {userTop && Object.keys(userTop).length > 0 && (
                //<ResponsiveContainer width="100%" height="300px">
                    <PieChart width={700} height={700}>
                        <Pie
                            data={userTop}
                            //innerRadius={120}
                            //outerRadius={180}
                            //paddingAngle={5}
                            outerRadius={180}
                            dataKey="value"
                            fill="green"
                            label={renderCustomisedLabel}
                            cornerRadius={5}
                            >
                            {userTop.map((entry, index) => (
                                <Cell key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                                //stroke="none"
                                strokeWidth={1.5} 
                               // strokeOpacity={0.4}
                                
                             />
                            ))}
                        </Pie>
                    </PieChart>
                //</ResponsiveContainer>
                )}
         
            </header>
            
        </div>
      );
};

export default DisplayData;