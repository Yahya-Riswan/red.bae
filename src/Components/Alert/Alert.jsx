import React, { useEffect, useState } from 'react';
import './style.css';

function Alert({ state, content }) {
    const [pop, setPop] = useState(true);
    const [stat, setStat] = useState('');

    useEffect(() => {
        setStat(state || 'success');

        const timer = setTimeout(() => {
            setPop(false);
        }, 4000);

        return () => clearTimeout(timer); 
    }, []); 

    return (
        <div className={`alert ${stat}s ${pop ? 'open' : 'close'}`}>
            <h1>{content}</h1>
        </div>
    );
}

export default Alert;
