import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("/current-user").then((response) => {
            if (response.data) {
                setUser(response.data);
            }
        });
    }, []);

    return (
        <>
            <Navbar />
            <h1>Welcome {user ? user.username : "Guest"}</h1>
        </>
    );
}

export default Home;
