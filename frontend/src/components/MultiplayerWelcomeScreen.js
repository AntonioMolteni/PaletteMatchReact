// MultiplayerWelcomeScreen.js
import React, { useState } from 'react';

function MultiplayerWelcomeScreen({ onCreateRoom, onJoinRoom }) {
    const [roomIdInput, setRoomIdInput] = useState("");

    const handleJoinRoom = () => {
        if (roomIdInput.trim() !== "") {
            onJoinRoom(roomIdInput); // Pass the entered room ID to the parent component
        } else {
            console.log("Please enter a room ID.");
        }
    };

    const handleCreateRoom = () => {
        onCreateRoom(); // Notify the parent component to create a new room
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
                <button onClick={handleJoinRoom}>Join Room</button>
            </div>
        </div>
    );
}

export default MultiplayerWelcomeScreen;
