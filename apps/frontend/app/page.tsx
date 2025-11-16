"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface GameState {
  grid_width: number;
  grid_height: number;
  game_tick: number;
  snake: Array<{ x: number; y: number }>;
  food: { x: number; y: number };
  score: number;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | undefined>(undefined);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // TODO: variables for tracking the snake attributes

  useEffect(() => {
    if (socketRef.current === undefined) {
      socketRef.current = io("localhost:8765");

      const onConnect = () => {
        socketRef.current?.emit("start_game", {
          // TODO: data about initial game setup
        });
      };

      const onUpdate = (data: unknown) => {
        //console.log("Received update:", data);
        // TODO: update the snake and food state based on data from server
        setGameState(data as GameState);
      };

      socketRef.current.on("connect", onConnect);
      socketRef.current.on("update", onUpdate);

      return () => {
        socketRef.current?.off("connect", onConnect);
        socketRef.current?.off("update", onUpdate);
      };
    }
  }, []); // socket stuff

  // TODO: function to draw the data to the screen

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas) {
      console.warn("Canvas element is not available");
      return;
    }

    if (!context) {
      console.warn("Canvas 2D context is not available");
      return;
    }

    if (!gameState) {
      console.warn("Game state is not available");
      return;
    }
    console.log("Drawing game state:", gameState);
    // Ensure grid dimensions are valid numbers > 0
    const gw = Number(gameState.grid_width) || 0;
    const gh = Number(gameState.grid_height) || 0;
    if (gw <= 0 || gh <= 0) {
      console.warn(
        "Invalid grid size:",
        gameState.grid_width,
        gameState.grid_height
      );
      return;
    }

    // Use the displayed size so CSS scaling won't make math wrong
    const displayRect = canvas.getBoundingClientRect();
    const displayWidth = Math.max(1, displayRect.width);
    const displayHeight = Math.max(1, displayRect.height);
    const pixelsPerSquareWidth = canvas.width / gameState.grid_width;
    const pixelsPerSquareHeight = canvas.height / gameState.grid_height;

    // Clear and draw
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";

    for (let i = 0; i < gameState.grid_height; i++) {
      for (let j = 0; j < gameState.grid_width; j++) {
        context.fillRect(
          j * pixelsPerSquareWidth,
          i * pixelsPerSquareHeight,
          pixelsPerSquareWidth - 2,
          pixelsPerSquareHeight - 2
        );
      }
    }

    gameState.snake.forEach((segment) => {
      context.fillStyle = "green";
      context.fillRect(
        segment.x * pixelsPerSquareWidth,
        segment.y * pixelsPerSquareHeight,
        pixelsPerSquareWidth - 2,
        pixelsPerSquareHeight - 2
      );
    });

    context.fillStyle = "red";
    context.fillRect(
      gameState.food.x * pixelsPerSquareWidth,
      gameState.food.y * pixelsPerSquareHeight,
      pixelsPerSquareWidth - 2,
      pixelsPerSquareHeight - 2
    );

    const observer = new MutationObserver(() => {
      // TODO: handle redwaring on theme change
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [gameState]); // redraw

  useEffect(() => {
    const handleResize = () => {
      // TODO: maybe manage canvas on resize
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // resize

  return (
    <div className="absolute top-17 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        // width={/* TODO: canvas width */}
        width={1920}
        height={1080}
        // height={/* TODO: canvas height */}
        style={{ position: "absolute", border: "none", outline: "none" }}
        className="w-full h-full"
      />
      <div className="absolute rounded-lg p-8 w-fit flex flex-col items-center shadow-md backdrop-blur-md bg-background-trans">
        <span className="text-primary text-3xl font-extrabold mb-2 text-center">
          CSAI Student
        </span>
      </div>
    </div>
  );
}
