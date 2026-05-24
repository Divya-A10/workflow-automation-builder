VectorShift Workflow Automation Workspace & Validation EngineA production-grade, highly reactive visual pipeline builder paired with an optimized graph-theoretic validation backend. This workspace allows users to design complex, multi-step generative AI workflows using a unified node abstraction framework, featuring dynamic parameter parsing and defensive edge verification.
## 🚀 Technical Highlights & Core Architecture ## 
1.Unified Node Abstraction (BaseNode.tsx)To avoid code duplication and boilerplate layout logic across individual node interfaces, the frontend implements a single, parameter-driven <BaseNode /> container. This handles:
* Uniform modern borders, drop-shadow feedback on focus, and quick deletion hooks. 
* Consistent header layouts featuring categorized Tailwind accent themes and lucide-react iconography.
* Dynamic mapping of input/output data ports (reactflow handles) with visual connection labels.
2. Reactive Edge Tokenizer (TextNode.tsx)The Text Template node incorporates an active JavaScript regular expression tracking system:Token Matching: Evaluates template fields for unique parameters wrapped in double curly braces:
```bash
$$\{\{\s*([a-zA-Z_\$][a-zA-Z0-9_\$]*)\s*\}\}
````
* Dynamic Handle Spawning: For every unique variable matched, the frontend dynamically mounts a corresponding left-aligned target <Handle />.
* Vertical Layout Distribution: Spaced cleanly using dynamic vertical percentage offsets to ensure zero structural overlap regardless of parameter volume.
* Organic Resizing: The layout container expands vertically and horizontally based on row-and-line text complexity to ensure maximum scannability.
3. Stack-Based DFS Cycle Interceptor (main.py)
* To prevent infinite token-consumption loops, runtime thread exhaustion, and execution stalling from circular visual routing, the FastAPI backend evaluates incoming graph maps prior to compilation.Adjacency 
* List Construction: Normalizes the frontend node configurations and directional edge coordinates into a high-performance adjacency list lookup.
* State Array Tracking: Traces every path using a classical three-state graph vertex coloring matrix: 0 (Unvisited), 1 (Visiting/Active on current stack), and 2 (Fully Processed / Verified Safe).Iterative Loop Implementation: Utilizes a custom iterative, stack-based Depth-First Search (DFS) traversal rather than raw recursion. This protects the backend memory space against stack-overflow crashes on exceptionally large or deep user workflow trees.Fallback Gate Resiliency: The client submit component incorporates an offline JavaScript DFS fallback engine. If network layers experience a partition, local verification automatically intercepts back-edges seamlessly, providing inline error diagnostics.

# 🛠️ Local Deployment & System Verification

Run the full stack locally using two isolated terminal windows:🐍 Backend Gateway SetupEnsure you have Python installed, then navigate to your backend folder:
```Bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000 --host 127.0.0.1
```
* Status Indicator: Verify the terminal prints: INFO: Uvicorn server running on http://127.0.0.1:8000API 
* Documentation: Interactive OpenAPI/Swagger schemas can be audited live at http://127.0.0.1:8000/docs.⚛️ 
* Frontend Client SetupNavigate to your frontend folder in a new terminal window:
```Bash
cd frontend
npm install
npm run dev
```
Status Indicator: Click the local network link (typically http://localhost:5173 or http://localhost:3000) to view the interactive whiteboard.

# 🧪 Step-by-Step E2E Verification Blueprint

* To test the end-to-end integration seamlessly, reconstruct the following operational profiles:Scenario A: Linear AI Pipeline (Happy Path)
* Drag an Input Source block onto the grid canvas. Define its variable identifier field as User Topic.
* Drag a Text Template block to the middle. Input the prompt context string:Write a professional 500-word blog post about {{ User Topic }}. Make sure the tone is {{ Tone Selection }}.
* Verify that two new input handle circles instantly spawn on the left border of the card labeled User Topic and Tone Selection.
* Drag a Gemini LLM block and an Output Dest block to the right.Draw connection lines linking the nodes in a straight sequence.
* Click Submit and Validate Pipeline.Expected System Output: An alert will confirm validation success. 
* Dismissing it opens a custom diagnostic summary modal displaying a green safety badge: Nodes: 4, Edges: 3, Is DAG: Yes.Scenario B: Circular Deadlock Catchment (Negative Path)
* Draw an intentional back-edge line linking your terminal Output Dest block directly back to an upstream input handle on your Input Source block.
- Click Submit and Validate Pipeline.Expected System Output: The validation engine intercepts the circular dependency immediately. The UI opens a red alert modal declaring "Pipeline Error (Cycle Detected)", indicating that is_dag is false and execution has been blocked for safety.
## 📁 System Component LayoutCode snippet
```bash
├── backend/
│   └── main.py             # FastAPI App, Pydantic Request Schemas, Stack-Based DFS
└── frontend/
    └── src/
        ├── components/
        │   ├── BaseNode.tsx  # Unified Visual Wrapper Component for all 9 node options
        │   └── submit.tsx    # SubmitButton Component, Offline Fallback DFS Engine, Analytics Modal
        ├── nodes/
        │   ├── inputNode.tsx  # Core Input Component
        │   ├── textNode.tsx   # Regex Dynamic Handle Evaluation Node
        │   ├── llmNode.tsx    # Twin-Input Gemini Processor Node
        │   └── outputNode.tsx # Terminal Pipeline Destination Node
        └── store.ts          # Centralized Zustand Pipeline Global State Store
```