
/**
 * @desc create a random graph 
 * @param {init_g} the jsgraphs.WeightedGraph() object.
 * @param {numofvertex} how many vertex to create in this graph.
 * @returns {random_g}
 */
function randomgraph(init_g, numofvertex){
    for(let i = 0; i<numofvertex-1; ++i){
        for(let toVertex = i+1; toVertex < numofvertex; ++toVertex){
            console.log("Generating random graph");
            let randomweight = Math.floor((Math.random()*100))+1;
            init_g.addEdge(new jsgraphs.Edge(i, toVertex, randomweight));
        }
    }
    return init_g
}