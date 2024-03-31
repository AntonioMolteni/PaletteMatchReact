import React, { useState, useEffect } from 'react';
import * as Colyseus from "colyseus.js";
import Grid from './Grid';

import '../style/Multiplayer.css';
import MultiplayerWelcomeScreen from './MultiplayerWelcomeScreen';

function Multiplayer() {
    // Initialize state to hold room state
    const [roomState, setRoomState] = useState(null);
    const [room, setRoom] = useState(null);
    const [joinRoomId, setJoinRoomId] = useState("")
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

    
    // Define an async function to handle asynchronous logic
    

        const connectToRoom = async () => {
            try {
                // Connect to the Colyseus server
                // const client = new Colyseus.Client('ws://10.0.1.31:2567');
                // const client = new Colyseus.Client('ws://192.168.0.192:2567');
                const client = new Colyseus.Client('ws://localhost:2567');

                // Join or create a room
                let room;
                if (joinRoomId === "create") {
                    room = await client.create("my_room");
                    console.log("room created with id:", room.id)
                } else {
                    room = await client.joinById(joinRoomId)
                }
                console.log(room.sessionId, "joined", room.name);
                setRoom(room);

                // Listen for state changes in the room
                room.onStateChange((state) => {
                    console.log(room.name, "has new state:", state);
                    // Update React state with new room state
                    setRoomState(prevState => ({
                        ...prevState,
                        ...state
                    }));
                });
                // Listen for errors in the room
                room.onError((code, message) => {
                    console.log(client.id, "couldn't join", room.name);
                });

                // Listen for leaving events
                room.onLeave((code) => {
                    console.log(client.id, "left", room.name);
                });
            } catch (e) {
                console.log("JOIN ERROR", e);
            }
        };
    useEffect(() => {
        // Call the async function
        connectToRoom();

        // Clean up on component unmount
        return () => {
        };
    }, [joinRoomId]); // Run effect only once on component mount

    const lockScore = () => {
        // Send a message to the room to lock the score
        if (room) {
            room.send("lockScore");
        }
    };

    const handleJoinRoom = (roomId) => {
        setJoinRoomId(roomId);
        setShowWelcomeScreen(false);
    };

    const handleCreateRoom = () => {
        setJoinRoomId("create"); // Set joinRoomId to "create" to create a new room
        setShowWelcomeScreen(false); // Hide the welcome screen when creating a room
    };

    // button move handler
    useEffect(() => {
        const detectKeydown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight','w','s','a','d'].includes(e.key)) {
                e.preventDefault();
                console.log(e.key)
                switch (e.key) {
                    case 'ArrowUp':
                    case 'w':
                        room.send("move", { up: true });
                        break;
                    case 'ArrowDown':
                    case 's':
                        room.send("move", { down: true });
                        break;
                    case 'ArrowLeft':
                    case 'a':
                        room.send("move", { left: true });
                        break;
                    case 'ArrowRight':
                    case 'd':
                        room.send("move", { right: true });
                        break;
                }
            }
        };

        const detectSwipe = (e) => {
            const touchStartX = e.touches[0].clientX;
            const touchStartY = e.touches[0].clientY;
            let touchEndX, touchEndY;

            const touchMoveListener = (moveEvent) => {
                touchEndX = moveEvent.touches[0].clientX;
                touchEndY = moveEvent.touches[0].clientY;
            };

            const touchEndListener = () => {
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                if (room) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        if (deltaX > 0) {
                            room.send("move", { right: true });
                        } else {
                            room.send("move", { left: true });
                        }
                    } else {
                        if (deltaY > 0) {
                            room.send("move", { down: true });
                        } else {
                            room.send("move", { up: true });
                        }
                    }
                }

                document.removeEventListener('touchmove', touchMoveListener);
                document.removeEventListener('touchend', touchEndListener);
            };

            document.addEventListener('touchmove', touchMoveListener);
            document.addEventListener('touchend', touchEndListener);
        };

        document.addEventListener('keydown', detectKeydown);
        document.addEventListener('touchstart', detectSwipe);

        // Clean up event listener on component unmount
        return () => {
            document.removeEventListener('keydown', detectKeydown);
            document.removeEventListener('touchstart', detectSwipe);
        };
    }, [room]); // Add room as a dependency

    if (showWelcomeScreen) {
        return (
            <MultiplayerWelcomeScreen
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoom}
                roomId={joinRoomId}
                setRoomId={setJoinRoomId}
            />
        );
    }

    return (
        <div>
            {roomState && (
                <div className="multiplayer">
                    <Grid
                        numRows={roomState.numRows}
                        numColumns={roomState.numColumns}
                        grid={roomState.grid}
                        player={roomState.players.get(room.sessionId)}
                        goalColor={roomState.goalColor}
                        roomId={room.id}
                        currentPlayerSessionId={roomState.currentPlayerSessionId}
                        onLockScore = {lockScore}
                    />
                </div>
            )}
        </div>
    );
}


export default Multiplayer;