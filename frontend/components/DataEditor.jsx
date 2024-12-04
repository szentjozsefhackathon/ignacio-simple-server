import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataEditor = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/json')
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => console.error(error));
    }, []);

    const handleChange = (e, sectionIndex) => {
        const { name, value } = e.target;
        const updatedData = [...data];
        updatedData[sectionIndex][name] = value;
        setData(updatedData);
    };

    const handleSave = () => {
        axios.put('/api/json', data)
            .then(() => alert('Data saved successfully!'))
            .catch(error => console.error(error));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {data.map((section, index) => (
                <div key={index}>
                    <input 
                        type="text" 
                        name="title" 
                        value={section.title} 
                        onChange={(e) => handleChange(e, index)} 
                    />
                </div>
            ))}
            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
};

export default DataEditor;