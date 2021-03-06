/**
 * Created by TimeWz667 on 17/04/2018.
 */
const tape = require("tape"),
    graph = require("../build/infergraph");

tape("nodes", function(test) {
    const g1 = graph.newGraph({A: 1, B: 2});

    test.deepEquals(g1.Attributes, {A: 1, B: 2});

    const n1 = g1.addNode("X");
    test.deepEquals(n1.get(), {id: "X"});
    test.equal(n1.attr("id"), "X");
    test.equal(n1.id, "X");

    const n2s = g1.addNodes(["Y", "Z"]);
    test.deepEquals(n2s.get(), [{id: "Y"}, {id: "Z"}]);
    n2s.attr("a", 5);
    test.deepEquals(n2s.attr("a"), [5, 5]);

    n2s.attr("a", null);
    test.deepEquals(n2s.attr("a"), [undefined, undefined]);

    const n3s = g1.addNodes([{id: "S", a: 2}, {id: "T", a: 3}]);
    test.deepEquals(n3s.get(), [{id: "S", a: 2}, {id: "T", a: 3}]);
    test.deepEquals(n3s.call(n => n.id), ["S", "T"]);

    n3s.attr("b", nod => nod.a * 2);
    test.deepEquals(n3s.attr("b"), [4, 6]);

    const n4s = g1.addNodes({U: {a: 2}, V: {a: 3}});
    test.deepEquals(n4s.get(), [{id: "U", a: 2}, {id: "V", a: 3}]);

    test.deepEquals(g1.getNode("X").get(), {"id": "X"});

    test.end();
});


tape("edges", function(test) {
    const g2 = graph.newGraph();

    g2.addEdge("A", "B");
    test.deepEquals(g2.Predecessor.A, {B: 0});
    test.deepEquals(g2.Predecessor.B, {A: 0});
    test.deepEquals(g2.Successor.A, {B: 0});
    test.deepEquals(g2.Successor.B, {A: 0});

    g2.addEdge("A", "B", 5);
    test.deepEquals(g2.Predecessor.A, {B: 5});
    test.deepEquals(g2.Predecessor.B, {A: 5});
    test.deepEquals(g2.Successor.A, {B: 5});
    test.deepEquals(g2.Successor.B, {A: 5});

    g2.addCycle(["S", "T", "U", "V"], 10);
    test.deepEquals(g2.Predecessor.S, {V: 10, T: 10});
    test.deepEquals(g2.Predecessor.T, {S: 10, U: 10});
    test.deepEquals(g2.Predecessor.U, {T: 10, V: 10});
    test.deepEquals(g2.Predecessor.V, {U: 10, S: 10});

    g2.linkCompletely(["W", "X", "Y", "Z"], 10);
    test.deepEquals(g2.Predecessor.W, {X: 10, Y: 10, Z: 10});
    test.deepEquals(g2.Predecessor.X, {W: 10, Y: 10, Z: 10});
    test.deepEquals(g2.Predecessor.Y, {X: 10, W: 10, Z: 10});
    test.deepEquals(g2.Predecessor.Z, {X: 10, Y: 10, W: 10});

    test.end();
});


tape("relations", function(test) {
    const g3 = graph.newGraph();

    g3.addCycle(["S", "T", "U", "V"]);

    test.deepEquals(g3.getNeighbourKeys("S"), ["T", "V"]);
    test.equal(g3.getDegree("T"), 2);

    test.equal(g3.getAvgDegree(), 2);

    test.end();
});


tape("clustering", function(test) {
    const g4 = graph.newGraph();

    g4.addEdge("A", "B");
    g4.addEdge("A", "C");
    g4.addCycle(["B", "C", "D", "E"]);

    test.equal(g4.getLocalClustering("A"), 1);
    test.equal(g4.getLocalClustering("B"), 1/3);
    test.equal(g4.getLocalClustering("D"), 0);
    test.equal(g4.getClusteringCoefficient(), 1/3);

    test.end();
});
