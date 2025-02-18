import React from 'react';
import axios from 'axios';
import "./App.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DisplayData = () => {
    const [user, setUser] = React.useState("");
    const [userTop, setUserTop] = React.useState("");
    const [radius, setRadius] = React.useState("");
    
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
                    name: transformKey(key),
                    value: value
                  }));
            setUserTop(sortedData);
            console.log('User Top Data Success');
        } catch (error) {
            console.log(error);
        }
    };

    function transformKey(key){
        const replacements = {
            'alternative': 'alt',
            'psychedelic': 'psyc'
        }

        for (const [original, replacement] of Object.entries(replacements)) {
            if (key.includes(original)) {
                return key.replace(original, replacement);
            }
        }
        
        return key;
    }

    React.useEffect(() => {
        GetUserData();
        GetUserTopData();
    }, []);

    const RADIAN = Math.PI / 180;
    const renderCustomisedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const nameParts = userTop[index].name.split(' ');
    const shouldSplit = nameParts.length === 2 && (nameParts[0].length > 5 || nameParts[1].length > 5);

    return (
        <text 
        className="pie-text"
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {shouldSplit ? (
                nameParts.map((part, i) => (
                    <tspan x={x} dy={i === 0 ? 0 : '0.8em'} key={i}>{part}</tspan>
                ))
            ) : (
                userTop[index].name
            )}
      </text>
    );
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00CFFF', '#008042'];

    React.useEffect(() => {
        const updateRadius = () => {
        setRadius(parseInt(getComputedStyle(document.documentElement).getPropertyValue("--pie-radius"), 10));
        };
    
        updateRadius();
        window.addEventListener("resize", updateRadius);
        return () => window.removeEventListener("resize", updateRadius);
    }, []);
    
    return (
        <div className="App">
            <header className="App-header">
                <h1>Aurify</h1>
                {user && <p>{user}</p>}
            </header>
            <div className="pie" >
                {userTop && Object.keys(userTop).length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                    <Pie
                                        data={userTop}
                                        outerRadius={radius}
                                        dataKey="value"
                                        label={renderCustomisedLabel}
                                        cornerRadius={5}
                                        >
                                        {userTop.map((entry, index) => (
                                            <Cell key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                            //stroke="none"
                                            //strokeWidth={1.2} 
                                            //strokeOpacity={0.4}
                                        />
                                        ))}
                                    </Pie>
                            </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
      );
};

export default DisplayData;