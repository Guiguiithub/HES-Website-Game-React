import React, { useRef } from "react";
import { main } from "../scripts/game";

const Game = props => {
    const canvasRef = useRef(null)
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    return <canvas ref={canvasRef}{...props} />
}

export default Game;