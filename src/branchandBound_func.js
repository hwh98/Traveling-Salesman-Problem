var glob_lowerbound = Infinity;// the best cost so far. 
var glob_tour;// solution tour
var origin_g;// original graph
var numofvertex;//number of vertex 
var numofmstTree=0;// number of mst tree.

/**
 * @desc the branch and bound function.
 * @param {bb_g} is a jsgraphs.WeightedGraph() object. It's the original graph for the branch and bound.
 * @return {glob_tour} is the tour solution of the TSP problem.
 * @returns {glob_loowerbound} is the cost of the solution.
 * @returns {numofmstTree} is the number of MST.
 */
function branchandBound(bb_g){ //bb_g is the global original graph.
    origin_g = _.cloneDeep(bb_g)
    numofvertex = bb_g.V;

    // MST
    var kruskal = new jsgraphs.KruskalMST(bb_g); 
    numofmstTree+=1;
    var mst = kruskal.mst;
    let mst_result = new jsgraphs.Graph(bb_g.V);
    let mst_cost = 0;
    //console.log("MST result - "+ mst.length+" edges generated in a " + bb_g.V +" vertexs graph.");
    for(let i=0; i < mst.length; ++i) { // iterate the MST edge to create the MST graph
        var e = mst[i];
        var v = e.either();
        var w = e.other(v);
        //console.log('(' + v + ', ' + w + '): ' + e.weight);
        mst_result.addEdge(w, v);
        mst_cost += e.weight;
    }
    //check MST edge connect every vertex together.
    if(oneTreeMST(mst_result)){ // valide one tree MST.
        if(istour(mst_result)){ // if the MST path is a tour, we calculate the cost.
            // check tour, and the tour cost 
            let tourfinalcost = calculatetourcost(mst_result, mst_cost);
            if(tourfinalcost < glob_lowerbound){
                //console.log("Update tour and cost.")
                glob_lowerbound = tourfinalcost;// update tour
                glob_tour = getTour(mst);
            }
        }
        else{ // not a tour so we rbanch
            //branch
            let branchVertex;// dthe vertex we will branch on 
            let adjacentVertex;// list of 3 adjacent vertexs connected to vertex
            [branchVertex, adjacentVertex] = findBranchVertex(mst_result) // find the vertex we want to branch on
            //recursion.
            bbRecursion(bb_g, branchVertex, adjacentVertex[0]);
            bbRecursion(bb_g, branchVertex, adjacentVertex[1]);
            bbRecursion(bb_g, branchVertex, adjacentVertex[2]);

        }
    }
    else{ // MST has more than one disconnected tree. Not a valid MST
        //console.log("No solution for this graph.")
    }    

    return [glob_tour, glob_lowerbound, numofmstTree]
}

/**
 * @desc the recursion funciton to branch and bound.
 * @param {recur_g} the recursion grapg - "bb_g" of the branchandBound() function. 
 * @param {b_vertex} is the vertex we will branch on 
 * @param {adjacent_vertex} is a list of adjacent vertex of the b_vertex. EX: [0, 1, 3]
 * @returns 
 */
function bbRecursion(recur_g, b_vertex, adjacent_vertex){
    //console.log("branch edge "+ b_vertex + " - " + adjacent_vertex)
    let storeEdge = recur_g.edge(b_vertex,adjacent_vertex).weight;// record the removed edge's weight.
    recur_g.edge(b_vertex, adjacent_vertex).weight = Infinity;

    // MST
    let kruskal = new jsgraphs.KruskalMST(recur_g); 
    numofmstTree+=1;

    let mst = kruskal.mst;
    let mst_result = new jsgraphs.Graph(recur_g.V);
    let mst_cost = 0;
    //console.log("MST result - "+ mst.length+" edges generated in a " + recur_g.V +" vertexs graph.");
    for(var i=0; i < mst.length; ++i) { // iterate the MST edge to create the MST graph
        var e = mst[i];
        var v = e.either();
        var w = e.other(v);
        //console.log('(' + v + ', ' + w + '): ' + e.weight);
        mst_result.addEdge(w, v);
        mst_cost += e.weight;
    }
    if (mst_cost!=Infinity){
        //console.log("MST is still possible to have tour.");
        if(oneTreeMST){ // 
            //console.log("MST generate one connected tree")
            //check if the MST result is a tour
            if(istour(mst_result)){ // if the MST path is a tour, we calculate the cost.
                // check tour, and the tour cost 
                let tourfinalcost = calculatetourcost(mst_result, mst_cost);
                if(tourfinalcost < glob_lowerbound){
                    //console.log("Update tour and cost.")
                    glob_lowerbound = tourfinalcost;// update tour
                    glob_tour = getTour(mst);
                }
                recur_g.edge(b_vertex, adjacent_vertex).weight = storeEdge; // reset the edge back
                return;
            }
            else{ // the MST edge is not a tour yet so we further branch
                //console.log("------recusor branch");
                let branchVertex;// dthe vertex we will branch on 
                let adjacentVertex;// list of 3 adjacent vertexs connected to vertex
                [branchVertex, adjacentVertex] = findBranchVertex(mst_result) // find the vertex we want to branch on
                //recursion.
                bbRecursion(recur_g, branchVertex, adjacentVertex[0]);
                bbRecursion(recur_g, branchVertex, adjacentVertex[1]);
                bbRecursion(recur_g, branchVertex, adjacentVertex[2]);
                recur_g.edge(b_vertex, adjacent_vertex).weight = storeEdge; // reset the edge back
                return;
            }
        }
        else{
            //console.log("MST generate more than one disconnected tree");
            recur_g.edge(b_vertex, adjacent_vertex).weight = storeEdge; // reset the edge back
            return;
        }
    }
    else{
        //console.log("infeasible MST")
        recur_g.edge(b_vertex, adjacent_vertex).weight = storeEdge; // reset the edge back
        return;
    }
}

/**
 * @desc The function to check if the edge of MST graph is tour. 
 * @param {g} is a jsgraphs.graph object generated from MST. Note that the g.adjList is a list of adjacent vertex for each vertex.
 *          If a 5 vertex graph is a tour, then g.adjList is like [ [ 1, 3 ], [ 0, 4 ], [ 4, 3 ], [ 2, 0 ], [ 1, 2 ] ]
 *          If a 8 vertex graph is not a tour, then g.adjList is like length of g [[ 7, 2 ], [ 7 ], [ 3, 0, 6 ], [ 2 ], [ 5 ], [ 7, 4 ], [ 2 ], [ 0, 1, 5 ]]
 * @returns {true} if all the connected(existing) edge in g is a tour
 * @returns {false} if the if all the connected(existing) edge in g is not a tour.
 */
function istour(fea_g){
    let onedegreevertex=0;// the one-degree edge counter.
    for(let v = 0; v<fea_g.adjList.length; ++v){ 
        if(fea_g.adjList[v].length!=2){ // check if number of adjacent node is 2.
            if( fea_g.adjList[v].length == 1 & onedegreevertex<2){
                onedegreevertex++;
            }
            else{
                //console.log("The connected edge is not a tour.");
                return false;    
            }
        }
    }
    //console.log("The connected ege is a tour.");
    return true;// all existing edge is a tour.
}

/**
 * @desc get the tour. This function will only be executed if the istour() return true.
 * @param {gett_g} gett_g is a sgraphs.KruskalMST.mst object directly generated from MST.
 * @returns {tourList} the list of tour EX: [ [ 1, 4 ], [ 1, 2 ], [ 3, 4 ], [ 0, 2 ], [ 0, 3 ] ]
 */
function getTour(gett_g){
    //console.log("Get the tour")
    let tourList = []
    let vertexFreq = new Array(parseInt(gett_g.length+1)).fill(0);// which two vertex is not connected by MST, we need it to form a tour.
    for(let i=0; i < gett_g.length; ++i) { // iterate the MST edge to create the MST graph
        let e = gett_g[i];
        let v = e.either();
        let w = e.other(v);
        vertexFreq[v]+=1;
        vertexFreq[w]+=1;
        tourList.push([v,w])
    }
    //add the edge of two not-yet connected vertex to form a tour
    let indexof = []// get the unconnected vertex's index.
    for(i = 0; i < vertexFreq.length; ++i){
        if(vertexFreq[i]==1){
            indexof.push(i)
        }    
    }
    tourList.push(indexof) // add the key 'unconnected' edge to the list

    //console.log(tourList)//console.log('(' + v + ', ' + w + '): ' + e.weight);
    return tourList
}

/**
 * @desc make sure the generated edge of MST connected all edge, which means MST yield only "one tree" rather than two disconnected tree. 
 *      A 4 vertex graph must have at least 3 edges to form a valid connected MST, 2 edges in such graph indicates the MST has many trees - not connected  
 * @param {g} is a jsgraphs.graph object generated from MST.
 * @returns {true} if the graph is perfectly connected.
 * @returns {false} if some part of the MST edges is not connected to others.
 */
 function oneTreeMST(one_g){
    let edge_count = 0;
    for(let i = 0; i<one_g.adjList.length; ++i){
        edge_count +=one_g.adjList[i].length
    }
    edge_count = edge_count/2;
    if(edge_count < one_g.V - 1){ // the g might contain more than one MST tree.
        //console.log("The graph of MST has multiple trees - not connected. WRONG MST");
        return false;
    }
    //console.log("Valid MST. The graph of MST has only one connected tree.");
    return true;
}

/**
 * @desc calcualte the total cost of the tour. This funciton will only be executed when oneTreeMST() return true.
 * @param {whole_g} is the original graph that is used to generated MST.
 * @param {mst_g} is the resulting MST graph.
 * @returns @returns {totalCost} is the cost of all edges in the MST adding the two edges that is waiting to be connected. 
 *          With the connection of two  remaining edges, we forms a tour.
 * @returns {mst_cost} is the total weight of the mst edge, which is in the {mst_g} graph. 
 */
function calculatetourcost(mst_g, mst_cost){
    let totalCost = mst_cost;
    let waitingvertex = [];// the two node waiting to be connected to form a tour.
    for(let v = 0; v < mst_g.adjList.length; ++v){ // iterate through the each vertex to find two one degree vertex(waitingvertex).
        if( mst_g.adjList[v].length == 1){
            waitingvertex.push(v);//record the vertex.
        }
    }
    totalCost += origin_g.edge(waitingvertex[0],waitingvertex[1]).weight;
    //console.log("The cost of this tour is "+ totalCost);
    return totalCost;
}

/**
 * @desc find the vertext that connect to many vertex - the vertex with maximum degree
 * @param {branch_g} is a jsgraphs.graph() object generated from MST.
 * @returns {branchingvertex} is the vertex we will branch in the following step EX: 1
 * @returns {adjacentvertex} is the list of 3 adjacent vertexs connected to vertex EX: [1, 3, 0]
 */
function findBranchVertex(branch_g){
    let branchingvertex;
    let maxdegree = -1;
    let adjacentvertex; // the adjacent vertex of the vertex we want to branch on 
    for(let v = 0; v < branch_g.adjList.length; ++v){ // iterate through the each vertex to find two one degree vertex(waitingvertex).
        if( branch_g.adjList[v].length > maxdegree){
            maxdegree = branch_g.adjList[v].length;
            branchingvertex = v;
        }
    }
    adjacentvertex = branch_g.adjList[branchingvertex];
    if(adjacentvertex.length>3){ // if the vertex has more than three connected edge, we will only keep three, because we only want 3 branch.
        adjacentvertex = [0,1,2].map(e=>adjacentvertex[e])
    }
    //console.log("so we will branch on vertex", branchingvertex);

    return [branchingvertex, adjacentvertex];
}
