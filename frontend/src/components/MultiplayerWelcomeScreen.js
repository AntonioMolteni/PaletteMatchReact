// MultiplayerWelcomeScreen.js
import React, { useState } from 'react';

function MultiplayerWelcomeScreen({ onCreateRoom, onJoinRoom }) {
    const [roomIdInput, setRoomIdInput] = useState("");
    const [username, setUsername] = useState("");

    const handleJoinRoom = () => {
        if (roomIdInput.trim() !== "" && username.trim() !== "") {
            onJoinRoom(roomIdInput, username); // Pass the entered room ID and username to the parent component
        } else {
            console.log("Please enter a room ID and username.");
        }
    };

    const handleCreateRoom = () => {
        if (username.trim() !== "") {
            onCreateRoom(username); // Pass the entered username to the parent component
        } else {
            console.log("Please enter a username.");
        }
    };

    return (
        <div className="welcome-screen">
            <h1>Welcome to the Game</h1>
            <button onClick={handleCreateRoom}>Create New Room</button>
            <div>
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={handleJoinRoom}>Join Room</button>
            </div>
        </div>
    );
}

export default MultiplayerWelcomeScreen;
