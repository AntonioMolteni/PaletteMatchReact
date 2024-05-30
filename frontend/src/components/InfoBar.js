import React from 'react';
import { getLuminance } from './Grid'; // Assuming Grid.js is in the same directory

function InfoBar({ playerSessionId, currentPlayerSessionId, currentPlayerUsername, goalColor, roomId, onLockScore, cellSize, playerColor, playerScore}) {
    return (
        <div className="info-bar" style={{ padding: 0, display: 'flex', alignItems: 'center' }}> {/* Added display: flex to make children elements horizontal */}
            <div className="goal-cell cell" id="goal-cell" style={{
                backgroundColor: goalColor,
                boxShadow: `0px 0px 5px ${getLuminance(goalColor) > 0.5 ? 'black' : 'white'}`
            }}>
                <div className="column">
                    <div className="cell-text" style={{ color: getLuminance(goalColor) > 0.5 ? 'black' : 'white' }}>
                        <div>{currentPlayerSessionId === playerSessionId ? 'Your Turn' : `${currentPlayerUsername}'s Turn`}</div>
                        <div>Room Id: {roomId}</div>
                    </div>
                </div>
                
                {/* Goal Column */}
                <div className="column">
                    <div className="cell-text" style={{ color: getLuminance(goalColor) > 0.5 ? 'black' : 'white' }}>
                        <div>{goalColor}</div>
                    </div>
                </div>
                
                {/* Lock Score Button Column */}
                <div className="column" style={{ flexDirection: 'row', justifyContent: 'end' }}>
                    <div className="cell-text" style={{ color: getLuminance(goalColor) > 0.5 ? 'black' : 'white' }}>
                        {playerScore}%
                    </div>
                    
                    <button className="checkmark-button" onClick={onLockScore} style={{ padding: cellSize * 0.1 }}>
                        <svg version="1.1" width={cellSize * 0.8} height={cellSize * 0.8} viewBox="0 0 256 256" xmlSpace="preserve">
                            <g style={{strokeWidth: 0, fill: 'none', fillRule: 'nonzero', opacity: 1}} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                            {/* Outline */}
                            <path
                                d="M 33 78 c -2.303 0 -4.606 -0.879 -6.364 -2.636 l -24 -24 c -3.515 -3.515 -3.515 -9.213 0 -12.728 c 3.515 -3.515 9.213 -3.515 12.728 0 L 33 56.272 l 41.636 -41.636 c 3.516 -3.515 9.213 -3.515 12.729 0 c 3.515 3.515 3.515 9.213 0 12.728 l -48 48 C 37.606 77.121 35.303 78 33 78 z"
                                style={{ fill: getLuminance(goalColor) > 0.5 ? 'black' : 'white', strokeLinecap: 'round' }}
                            />
                            {/* Checkmark */}
                            <path
                                d="m 80.683594,14.142578 c -2.321793,0.04135 -4.304116,1.520335 -5.751606,3.22033 C 60.954342,31.337976 46.979232,45.315584 33,59.289062 26.362226,52.694349 19.81306,46.01086 13.105019,39.489002 10.192431,37.227643 5.4591202,37.910646 3.4089849,41.017108 c -1.8530383,2.564218 -1.6579394,6.415527 0.5974776,8.679706 4.2850427,4.366764 8.6650985,8.640691 12.9712595,12.988009 3.945744,3.928003 7.851287,7.898669 11.84845,11.772208 2.725864,2.166883 7.103233,1.75474 9.340705,-0.932006 C 54.242047,57.481819 70.301902,41.421714 86.332031,25.333984 87.377508,24.101936 87.86953,22.456386 87.847656,20.931641 87.882316,18.27468 86.19766,15.738949 83.75,14.714844 82.788839,14.294552 81.732707,14.08739 80.683594,14.142578 Z"
                                style={{ fill: playerColor, strokeLinecap: 'round' }}
                            />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
                {/* Lock Score Button */}
                
            {/* Add more data elements or buttons as needed */}
        </div>
    );
}

export default InfoBar;
