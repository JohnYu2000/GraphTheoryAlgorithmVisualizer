/* This file contains the Depth First Search algorithm. This file runs in a separate thread from the main thread. */
self.onmessage = (e) => {
    // Initialize Variables //
    const node_li = e.data[2];
    const adjacency_matrix = e.data[4];

    let visited = [];    // Stack tracks which nodes have been visited
    let neighbors = [];  // Stores the id's of the neighbors

    function depthFirstSearch(nodeId) {
        // -- Functions -- //
        function sleep(milliseconds) {  // Pauses the program
            const date = Date.now();
            let currentDate = null;
            do {
            currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        }

        function updateNode(color) {    // Sends data for main thread to update
            for (let n=0;n<node_li.length;n++) {
                if (node_li[n].id == nodeId) {
                    self.postMessage([n, color, null, null]);
                    break;
                }
            }
            sleep(e.data[5]);
        }

        // -- Function Starts Here -- //
        if (visited.includes(nodeId)) return;   // Backtrack if node was already visited
        visited.push(nodeId);
        updateNode("#FFA849");  // Sets node color indicating exploring

        neighbors.push([]); // Pushes an empty array
        for (let index=0;index<adjacency_matrix[nodeId].length;index++) {
            if (adjacency_matrix[nodeId][index] != Infinity) {
                neighbors[neighbors.length - 1].push(index);
            }
        }

        for (i of neighbors[neighbors.length - 1]) {
            depthFirstSearch(i);
        }
        neighbors.pop();
        updateNode("#858891");  // Sets node color indicating dead end
    }

    // -- Code Starts Here -- //
    depthFirstSearch(e.data[0]); // Invokes the function
    self.postMessage("terminate");  // Tells main thread to terminate web worker
};