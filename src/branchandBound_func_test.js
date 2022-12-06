/**
 * Testing for the randomGraph.js &  BB_MST_func.js
 */

/**
 * @desc testing if the randomgraph() can return the randomgraph and set up the weight correctly.
 */
 function randomgraph_test(){
    console.log("Random graph Test")
    let test_numofvertex = 10;
    let test_g = new jsgraphs.WeightedGraph(test_numofvertex);
    g = randomgraph(test_g, test_numofvertex)
    console.assert(g.adj(4)[1].weight==g.adj(1)[3].weight, "random graph failed.")
}
/**
 * @desc testing if the branchandBound() is able to return the valid solution 
 */
function branchandbound_test(){
    console.log("Branch and bound algorithm Test:")
    let test_numofvertex = 5;
    let test_g = new jsgraphs.WeightedGraph(test_numofvertex);
    test_g.addEdge(new jsgraphs.Edge(0, 1, 12));
    test_g.addEdge(new jsgraphs.Edge(0, 2, 10));
    test_g.addEdge(new jsgraphs.Edge(0, 3, 19));
    test_g.addEdge(new jsgraphs.Edge(0, 4, 8));
    test_g.addEdge(new jsgraphs.Edge(1, 2, 3));
    test_g.addEdge(new jsgraphs.Edge(1, 3, 7));
    test_g.addEdge(new jsgraphs.Edge(1, 4, 2));
    test_g.addEdge(new jsgraphs.Edge(2, 3, 6));
    test_g.addEdge(new jsgraphs.Edge(2, 4, 20));
    test_g.addEdge(new jsgraphs.Edge(3, 4, 4));
    [bb_tour, tourcost] = branchandBound(test_g)
    console.assert(([1, 2].indexOf(bb_tour))&([3,4].indexOf(bb_tour))&([0,4].indexOf(bb_tour)), 'branch and bound test failed - tour')
    console.assert(tourcost==33, "branch and bound test failed - cost.")
}
/**
 * @desc tesing if the istour() will be able to identify whether the edge is a tour 
 */
function istour_test(){
    console.log("istour function Test:")
    let atour = new jsgraphs.Graph(6);
    atour.addEdge(0, 4);
    atour.addEdge(1, 5);
    atour.addEdge(2, 3);
    atour.addEdge(3, 4);
    atour.addEdge(0, 1);
    atour.addEdge(2, 5);
    console.assert(istour(atour)==true, "istour test failed - acutally is a tour")
    let nottour = new jsgraphs.Graph(5);
    nottour.addEdge(0, 1);
    nottour.addEdge(1, 4);
    nottour.addEdge(1, 3);
    nottour.addEdge(0, 2);
    console.assert(istour(nottour)==false, "istour test failed - acutally isn't a tour")
}
/**
 * @desc testing if the gettour_test() function can connect the left edge and return the correct tour edge 
 * 
 */
function gettour_test(){
    console.log("gettour fuction Test:")
    //create mst object to find tour
    let test_g = new jsgraphs.WeightedGraph(5);
    test_g.addEdge(new jsgraphs.Edge(0, 1, 12));
    test_g.addEdge(new jsgraphs.Edge(0, 2, 10));
    test_g.addEdge(new jsgraphs.Edge(0, 3, 19));
    test_g.addEdge(new jsgraphs.Edge(1, 2, 3));
    test_g.addEdge(new jsgraphs.Edge(1, 3, 7));
    test_g.addEdge(new jsgraphs.Edge(1, 4, 2));
    test_g.addEdge(new jsgraphs.Edge(2, 3, 6));
    test_g.addEdge(new jsgraphs.Edge(2, 4, 20));
    test_g.addEdge(new jsgraphs.Edge(3, 4, 4));
    let test_kruskal = new jsgraphs.KruskalMST(test_g); 
    let test_mst = test_kruskal.mst;
    let test_tour = getTour(test_mst)
    console.assert(([0, 3].indexOf(test_tour)) & ([3, 4].indexOf(test_tour))&([1, 4].indexOf(test_tour)),'gettour test failed')
}

/**
 * @desc testing if the oneTreeMST() function can identify if the resulting tree(edge list) of MST return two 
 *      disconnected tree or one connect tree, we will test it with a simple connected/disconnected edge list 
 */
function oneTreeMST_test(){
    console.log("oneTreeMST function Test:")
    //create mst object to find tour
    let twotree_g = new jsgraphs.Graph(5);
    twotree_g.addEdge(0, 2);
    twotree_g.addEdge(1, 3);
    twotree_g.addEdge(4, 3);
    console.assert(oneTreeMST(twotree_g)==false,'oneTreeMST test failed - actually is a disconnected graph')
    let ontree_g = new jsgraphs.Graph(5);
    ontree_g.addEdge(3, 2);
    ontree_g.addEdge(0, 1);
    ontree_g.addEdge(1, 3);
    ontree_g.addEdge(4, 3);
    console.assert(oneTreeMST(ontree_g)==true,'oneTreeMST test failed - actually is a connected graph')
}

/**
 * @desc testing if the calculatetourcost() can calcualte the correct cost of the tour.
 */
function calculatetourcost_test(){
    console.log("calculatetourcost function Test:")
    let test_g = new jsgraphs.WeightedGraph(5);
    test_g.addEdge(new jsgraphs.Edge(0, 1, 12));
    test_g.addEdge(new jsgraphs.Edge(0, 2, 10));
    test_g.addEdge(new jsgraphs.Edge(0, 3, 19));
    test_g.addEdge(new jsgraphs.Edge(1, 2, 3));
    test_g.addEdge(new jsgraphs.Edge(1, 3, 7));
    test_g.addEdge(new jsgraphs.Edge(1, 4, 2));
    test_g.addEdge(new jsgraphs.Edge(2, 3, 6));
    test_g.addEdge(new jsgraphs.Edge(2, 4, 20));
    test_g.addEdge(new jsgraphs.Edge(3, 4, 4));
    let test_kruskal = new jsgraphs.KruskalMST(test_g); 
    let mst = test_kruskal.mst;
    let mst_result = new jsgraphs.Graph(test_g.V);
    let mst_cost = 0;
    for(let i=0; i < mst.length; ++i) { // iterate the MST edge to create the MST graph
        let e = mst[i];
        let v = e.either();
        let w = e.other(v);
        mst_result.addEdge(w, v);
        mst_cost += e.weight;
    }    
    console.assert(calculatetourcost(mst_result, mst_cost)==38,"calculatetourcost test failed - whole tour cost wrong")
}
/**
 * 
 */
function findBranchVertex_test(){
    console.log("findbranchvertex function Test:")
    let test_g = new jsgraphs.WeightedGraph(5);
    test_g.addEdge(new jsgraphs.Edge(0, 1, 12));
    test_g.addEdge(new jsgraphs.Edge(0, 2, 10));
    test_g.addEdge(new jsgraphs.Edge(0, 3, 19));
    test_g.addEdge(new jsgraphs.Edge(0, 4, 8));
    test_g.addEdge(new jsgraphs.Edge(1, 2, 3));
    test_g.addEdge(new jsgraphs.Edge(1, 3, 7));
    test_g.addEdge(new jsgraphs.Edge(1, 4, 2));
    test_g.addEdge(new jsgraphs.Edge(2, 3, 6));
    test_g.addEdge(new jsgraphs.Edge(2, 4, 20));
    test_g.addEdge(new jsgraphs.Edge(3, 4, 4));
    let test_kruskal = new jsgraphs.KruskalMST(test_g); 
    let mst = test_kruskal.mst;
    let mst_result = new jsgraphs.Graph(test_g.V);
    let mst_cost = 0;
    for(let i=0; i < mst.length; ++i) { // iterate the MST edge to create the MST graph
        let e = mst[i];
        let v = e.either();
        let w = e.other(v);
        mst_result.addEdge(w, v);
        console.log('(' + v + ', ' + w + '): ' + e.weight)
        mst_cost += e.weight;
    }    
    console.assert(findBranchVertex(mst_result)[0]==4, "findbranchvertext test failed - wrong vertex.")
}
/**
 * The main testing function to go through all the testing
 */
function TestingBB(){
    console.log("---------Testing---------")
    randomgraph_test()
    branchandbound_test()
    istour_test()
    gettour_test()
    oneTreeMST_test()
    calculatetourcost_test()
    findBranchVertex_test()
    console.log("---------Testing end---------")
    return;
}

