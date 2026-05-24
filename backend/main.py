# VectorShift Pipeline Graph Validation Engine
# Author: Avanigadda Sai Divya Sree

"""
Technical Overview:
This module implements a production-grade validation gate for multi-step 
generative AI workflow graphs. It converts the visual node-and-edge layout 
payload into an adjacency list representation and implements an optimized, 
iterative stack-based Depth-First Search (DFS) to detect cyclic dependencies. 
Ensuring the graph is a Directed Acyclic Graph (DAG) prevents runtime execution 
deadlocks and infinite token-consumption loops.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any

app = FastAPI(
    title="VectorShift Pipeline Parser",
    description="Backend validation service for verifying workflow automation DAG structures.",
    version="1.0.0"
)

# Enable CORS so your React frontend can seamlessly communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your exact frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define precise Pydantic schemas reflecting the React Flow data structures
class NodeSchema(BaseModel):
    id: str
    type: str = Field(..., description="The architectural type of the node (e.g., customText, llm)")
    data: Dict[str, Any] = Field(default_factory=dict)

class EdgeSchema(BaseModel):
    id: str
    source: str = Field(..., description="The origin node ID of the directed edge")
    target: str = Field(..., description="The destination node ID of the directed edge")
    sourceHandle: str = Field(default="")
    targetHandle: str = Field(default="")

class PipelineRequest(BaseModel):
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


def verify_directed_acyclic_graph(nodes: List[NodeSchema], edges: List[EdgeSchema]) -> bool:
    """
    Verifies if the provided graph is a valid Directed Acyclic Graph (DAG) 
    using an iterative stack-based Depth-First Search (DFS) tracking system.
    """
    # Step 1: Build the Adjacency List
    # Map each source node ID to a list of its destination target node IDs
    adjacency_list: Dict[str, List[str]] = {node.id: [] for node in nodes}
    
    for edge in edges:
        # Prevent runtime crashes if front-end passes an edge containing an orphaned node ID
        if edge.source in adjacency_list and edge.target in adjacency_list:
            adjacency_list[edge.source].append(edge.target)

    # Step 2: Initialize State Trackers for Cycle Detection
    # 0 = UNVISITED, 1 = VISITING (On the current execution path), 2 = FULLY_PROCESSED
    visited_state: Dict[str, int] = {node.id: 0 for node in nodes}

    # Step 3: Iterative Stack-Based DFS Loop to avoid recursion limits
    for start_node in adjacency_list:
        if visited_state[start_node] == 0:
            # The stack will hold tuples of (current_node, child_index_to_explore)
            # This directly mirrors hardware execution stacks
            stack = [(start_node, 0)]
            
            while stack:
                curr_node, child_idx = stack.pop()
                
                # If this is the first time we are processing this node from the stack
                if child_idx == 0:
                    if visited_state[curr_node] == 1:
                        return False  # Back-edge detected! A circular loop exists.
                    if visited_state[curr_node] == 2:
                        continue      # Node already verified safe in a previous path
                    
                    # Mark the node as active on our current path execution stack
                    visited_state[curr_node] = 1
                
                # Explore the children of the current node
                children = adjacency_list[curr_node]
                
                if child_idx < len(children):
                    # Push the current node back onto the stack with its next child pointer incremented
                    stack.append((curr_node, child_idx + 1))
                    
                    # Push the next child onto the stack to step deeper into the graph path
                    next_child = children[child_idx]
                    if visited_state[next_child] != 2:  # Only explore if not completely processed
                        stack.append((next_child, 0))
                else:
                    # All down-stream children have been exhaustively checked and verified safe
                    visited_state[curr_node] = 2

    return True


@app.post("/pipelines/parse", response_model=PipelineResponse, status_code=status.HTTP_200_OK)
async def parse_pipeline(payload: PipelineRequest):
    """
    Main ingestion endpoint. Receives frontend React Flow graphs, processes layout properties, 
    and validates execution safety before deployment.
    """
    try:
        total_nodes = len(payload.nodes)
        total_edges = len(payload.edges)
        
        # Execute our stack-based DAG safety check
        is_valid_dag = verify_directed_acyclic_graph(payload.nodes, payload.edges)
        
        return PipelineResponse(
            num_nodes=total_nodes,
            num_edges=total_edges,
            is_dag=is_valid_dag
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Backend execution failure during graph parsing: {str(e)}"
        )


@app.get("/")
def read_root():
    return {"status": "online", "message": "VectorShift Fast API pipeline engine running."}


if __name__ == "__main__":
    import uvicorn
    # Automatically triggers hot-reloads on file changes during development.
    # Support running from either the repo root or the backend directory.
    app_path = "backend.main:app" if __package__ else "main:app"
    uvicorn.run(app_path, host="0.0.0.0", port=8000, reload=True)
