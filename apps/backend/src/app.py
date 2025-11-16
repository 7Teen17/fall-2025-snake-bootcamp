import asyncio
import time
import socketio
from aiohttp import web
from typing import Any, Dict


#from model import DQN
from game import Game

# Create a SocketIO server instance with CORS settings to allow connections from frontend
sio = socketio.AsyncServer(cors_allowed_origins="*")
# Create a web application instance
app = web.Application()
# Attach the socketio server to the web app
sio.attach(app)

# Basic health check endpoint - keep this for server monitoring
async def handle_ping(request: Any) -> Any:
    """Simple ping endpoint to keep server alive and check if it's running"""
    return web.json_response({"message": "pong"})


# TODO: Create a socketio event handler for when clients connect
@sio.event
async def connect(sid: str, environ: Dict[str, Any]) -> None:
    """Handle client connections - called when a frontend connects to the server"""
    print(f"Client connected: {sid}")
    # TODO: You might want to initialize game state here
    pass


# TODO: Create a socketio event handler for when clients disconnect
@sio.event
async def disconnect(sid: str) -> None:
    """Handle client disconnections - cleanup any resources"""
    print(f"Client disconnected: {sid}")
    # TODO: Clean up any game sessions or resources for this client
    pass


# TODO: Create a socketio event handler for starting a new game
@sio.event
async def start_game(sid: str, data: Dict[str, Any]) -> None:
    """Initialize a new game when the frontend requests it"""
    # TODO: Extract game parameters from data (grid_width, grid_height, starting_tick)

    # TODO: Create a new Game instance and configure it
    game = Game()
    await sio.save_session(sid, {"game": game})

    # TODO: If implementing AI, create an agent instance here
    # TODO: Save the game state in the session using sio.save_session()

    # TODO: Send initial game state to the client using sio.emit()
    await sio.emit("update", game.to_dict())
    # TODO: Start the game update loop
    asyncio.create_task(update_game(sid))


# TODO: Optional - Create event handlers for saving/loading AI models


# TODO: Implement the main game loop
async def update_game(sid: str) -> None:
    """Main game loop - runs continuously while the game is active"""
    try:
        async with sio.session(sid) as session:
            while True:
                game = session["game"]
                game.step()
                game.queue_change("RIGHT")
                print(game.to_dict())
                await sio.emit("update", game.to_dict())
                await asyncio.sleep(game.to_dict()["game_tick"])
    except Exception as e:
        print(f"Game loop error for {sid}: {e}")
    # TODO: Create an infinite loop
    # TODO: Check if the session still exists (client hasn't disconnected)
    # TODO: Get the current game and agent state from the session
    # TODO: Implement AI agentic decisions
    # TODO: Update the game state (move snake, check collisions, etc.)
    # TODO: Save the updated session
    # TODO: Send the updated game state to the client
    # TODO: Wait for the appropriate game tick interval before next update
    pass


# TODO: Helper function for AI agent interaction with game
async def update_agent_game_state(game: Game, agent: Any) -> None:
    """Handle AI agent decision making and training"""
    # TODO: Get the current game state for the agent
    # TODO: Have the agent choose an action (forward, turn left, turn right)
    # TODO: Convert the agent's action to a game direction
    # TODO: Apply the direction change to the game
    # TODO: Step the game forward one frame
    # TODO: Calculate the reward for this action
    # TODO: Get the new game state after the action
    # TODO: Train the agent on this experience (short-term memory)
    # TODO: Store this experience in the agent's memory
    # TODO: If the game ended:
    #   - Train the agent's long-term memory
    #   - Update statistics (games played, average score)
    #   - Reset the game for the next round
    pass


# TODO: Main server startup function
async def main() -> None:
    """Start the web server and socketio server"""
    app.router.add_get('/', handle_ping)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 8765)
    await site.start()
    print("Server started on http://localhost:8765")
    # Keep server running
    await asyncio.Event().wait()
    
    # TODO: Handle any errors gracefully
    pass


if __name__ == "__main__":
    asyncio.run(main())
