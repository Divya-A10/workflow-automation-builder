import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Adjacency-list based DFS cycle finder to detect if graph is a Directed Acyclic Graph (DAG)
const checkIsDag = (nodes: any[], edges: any[]): boolean => {
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => {
    if (n && n.id) {
      adj[n.id] = [];
    }
  });

  edges.forEach((e) => {
    if (e && e.source && e.target) {
      if (adj[e.source] && adj[e.target]) {
        adj[e.source].push(e.target);
      }
    }
  });

  const state: Record<string, number> = {}; // 0: unvisited, 1: visiting, 2: visited
  nodes.forEach((n) => {
    if (n && n.id) {
      state[n.id] = 0;
    }
  });

  const hasCycle = (nodeId: string): boolean => {
    state[nodeId] = 1; // currently in recursion path
    const children = adj[nodeId] || [];
    for (const childId of children) {
      if (state[childId] === 1) {
        return true; // Back-edge found! A cycle exists.
      }
      if (state[childId] === 0) {
        if (hasCycle(childId)) {
          return true;
        }
      }
    }
    state[nodeId] = 2; // completely visited
    return false;
  };

  for (const node of nodes) {
    if (node && node.id && state[node.id] === 0) {
      if (hasCycle(node.id)) {
        return false; // contains cycle, so NOT a DAG
      }
    }
  }

  return true; // is a clean DAG
};

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      
      // Inject backend server endpoints easily in the Node.js preview loop
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/pipelines/parse' && req.method === 'POST') {
            let body = '';
            
            req.on('data', (chunk) => {
              body += chunk.toString();
            });

            req.on('end', () => {
              try {
                const payload = JSON.parse(body);
                const nodes = payload.nodes || [];
                const edges = payload.edges || [];
                
                const is_dag = checkIsDag(nodes, edges);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    num_nodes: nodes.length,
                    num_edges: edges.length,
                    is_dag,
                  })
                );
              } catch (err: any) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Malformed JSON payload: ' + err.message }));
              }
            });
          } else {
            next();
          }
        });
      },
    },
  };
});
