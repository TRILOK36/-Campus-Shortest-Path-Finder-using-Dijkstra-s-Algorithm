const fs=require('fs');
const D=require('docx');
const {Document,Packer,Paragraph,TextRun,ImageRun,Table,TableRow,TableCell,WidthType,AlignmentType,HeadingLevel,LevelFormat,BorderStyle,ShadingType,PageBreak,Footer,Header,PageNumber,TableOfContents,ExternalHyperlink}=D;
const FONT="Times New Roman", URL="https://claude.ai/artifact/DAR5H4uWUDbcLQJu79nN2P";
const code=fs.readFileSync('dijkstra.py','utf8').split('\n');
const trace=JSON.parse(fs.readFileSync('trace.json','utf8'));
const logo=fs.readFileSync('/mnt/user-data/uploads/1000698388.png');
const fig=fs.readFileSync('campus_graph.png');
const W=9026; // A4 with 1" margins
const P=(t,o={})=>new Paragraph({spacing:{after:120,line:340},alignment:o.al||AlignmentType.JUSTIFIED,...o.p,children:(Array.isArray(t)?t:[t]).map(x=>typeof x==='string'?new TextRun({text:x,font:FONT,size:24,...(o.r||{})}):x)});
const B=(t)=>new TextRun({text:t,bold:true,font:FONT,size:24});
const H1=t=>new Paragraph({heading:HeadingLevel.HEADING_1,pageBreakBefore:true,children:[new TextRun({text:t,font:FONT})]});
const H2=t=>new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun({text:t,font:FONT})]});
const bl=t=>new Paragraph({numbering:{reference:'b',level:0},spacing:{after:80,line:320},children:(Array.isArray(t)?t:[t]).map(x=>typeof x==='string'?new TextRun({text:x,font:FONT,size:24}):x)});
const nl=(t,r='n')=>new Paragraph({numbering:{reference:r,level:0},spacing:{after:80,line:320},children:[new TextRun({text:t,font:FONT,size:24})]});
const ctr=(t,o={})=>new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:o.after??120},children:[new TextRun({text:t,font:FONT,size:o.size||24,bold:o.bold,italics:o.i,color:o.color})]});
const bd={style:BorderStyle.SINGLE,size:4,color:"808080"};const bds={top:bd,bottom:bd,left:bd,right:bd};
function tbl(head,rows,widths){
  const cell=(t,w,h)=>new TableCell({width:{size:w,type:WidthType.DXA},borders:bds,margins:{top:60,bottom:60,left:100,right:100},
    shading:h?{type:ShadingType.CLEAR,fill:"F2E3C0",color:"auto"}:undefined,
    children:[new Paragraph({children:[new TextRun({text:String(t),font:FONT,size:22,bold:h})]})]});
  return new Table({width:{size:widths.reduce((a,b)=>a+b),type:WidthType.DXA},columnWidths:widths,
    rows:[new TableRow({tableHeader:true,children:head.map((h,i)=>cell(h,widths[i],true))}),...rows.map(r=>new TableRow({children:r.map((c,i)=>cell(c,widths[i],false))}))]});
}
const gap=()=>new Paragraph({spacing:{after:120},children:[]});
const caption=t=>ctr(t,{i:true,size:22,after:200});
const codeBlock=lines=>lines.map(l=>new Paragraph({spacing:{after:0,line:250},shading:{type:ShadingType.CLEAR,fill:"F3F3F3",color:"auto"},children:[new TextRun({text:l===''?' ':l,font:"Courier New",size:18})]}));

// ---- COVER
const cover=[
 new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:300},children:[new ImageRun({type:'png',data:logo,transformation:{width:440,height:76},altText:{title:"Sandip University",description:"Sandip University logo",name:"logo"}})]}),
 ctr("School of Computer Science and Engineering (SOCSE)",{size:26,bold:true,after:60}),
 ctr("Micro Project Report",{size:26,after:400}),
 ctr("on",{i:true,after:200}),
 ctr("CAMPUS SHORTEST PATH FINDER",{size:40,bold:true,color:"C00000",after:60}),
 ctr("USING DIJKSTRA'S ALGORITHM",{size:34,bold:true,color:"C00000",after:400}),
 ctr("Submitted in partial fulfilment of the requirements of the course",{i:true,after:60}),
 ctr("B.Tech – Computer Science and Engineering (AI & ML)",{bold:true,after:360}),
 tbl(["Student Full Name","Permanent Registration Number (PRN)"],[
  ["Shahu Trilok Sanjay","250105231072"],["Himanshu Bhupendra Gurav","250105231093"],["Chaudhary Kunal Ranjit","250105231114"],["Dubey Aman Mukesh","250105231131"]],[5000,4026]),
 gap(),gap(),
 ctr("Guided by: Darshan Ahire",{bold:true,after:60}),
 ctr("School: SOCSE   |   Course: CSE AI & ML   |   Branch: B.Tech",{after:60}),
 ctr("Sandip University",{bold:true,size:26,after:60}),
];
// ---- CERTIFICATE / ACK / ABSTRACT
const front=[
 new Paragraph({pageBreakBefore:true,alignment:AlignmentType.CENTER,spacing:{after:300},children:[new TextRun({text:"CERTIFICATE",bold:true,size:32,font:FONT})]}),
 P("This is to certify that the micro project report entitled “Campus Shortest Path Finder using Dijkstra's Algorithm” is a bona fide work carried out by Shahu Trilok Sanjay (PRN 250105231072), Himanshu Bhupendra Gurav (PRN 250105231093), Chaudhary Kunal Ranjit (PRN 250105231114) and Dubey Aman Mukesh (PRN 250105231131), students of B.Tech Computer Science and Engineering (AI & ML), School of Computer Science and Engineering, Sandip University."),
 P("The work was carried out under my guidance and, to the best of my knowledge, has not been submitted elsewhere for any other course or award."),
 gap(),gap(),gap(),
 new Paragraph({spacing:{after:60},children:[new TextRun({text:"Guide: Prof. Darshan Ahire",bold:true,font:FONT,size:24})]}),
 new Paragraph({spacing:{after:600},children:[new TextRun({text:"School of Computer Science and Engineering, Sandip University",font:FONT,size:24})]}),
 new Paragraph({spacing:{after:60},children:[new TextRun({text:"Signature of Guide: ____________________          Signature of HOD: ____________________",font:FONT,size:24})]}),
 new Paragraph({spacing:{after:60},children:[new TextRun({text:"Date: ____ / ____ / ________",font:FONT,size:24})]}),

 new Paragraph({pageBreakBefore:true,alignment:AlignmentType.CENTER,spacing:{after:300},children:[new TextRun({text:"ACKNOWLEDGEMENT",bold:true,size:32,font:FONT})]}),
 P("We express our sincere gratitude to our guide, Darshan Ahire, for his valuable guidance, constant encouragement and constructive feedback throughout this micro project."),
 P("We thank the School of Computer Science and Engineering, Sandip University, for providing the academic environment and resources required to complete this work. We are also grateful to our classmates and families for their support."),
 P("Team members: Shahu Trilok Sanjay, Himanshu Bhupendra Gurav, Chaudhary Kunal Ranjit, Dubey Aman Mukesh.",{al:AlignmentType.LEFT}),

 new Paragraph({pageBreakBefore:true,alignment:AlignmentType.CENTER,spacing:{after:300},children:[new TextRun({text:"ABSTRACT",bold:true,size:32,font:FONT})]}),
 P("Finding the quickest way between two places is a problem every student, visitor and staff member faces on a large campus. This project models the campus as a weighted, undirected graph in which buildings are nodes and walkways are edges weighted by their length in metres. Dijkstra's algorithm, implemented with a binary min-heap priority queue, is used to compute the shortest route between any two buildings."),
 P("The project delivers three things: a Python implementation of the algorithm, a worked and verified example on a 10-node, 16-edge campus model, and an interactive website that lets a user choose a start and destination and watch the algorithm settle one building at a time. The shortest route from the Main Gate to the Hostel is found to be Main Gate → Library → Canteen → Hostel with a total distance of 470 m. The approach runs in O((V + E) log V) time and can be extended to real campus maps."),
 P([B("Keywords: "),"Dijkstra's algorithm, shortest path, weighted graph, priority queue, campus navigation."],{al:AlignmentType.LEFT}),

 new Paragraph({pageBreakBefore:true,alignment:AlignmentType.CENTER,spacing:{after:300},children:[new TextRun({text:"TABLE OF CONTENTS",bold:true,size:32,font:FONT})]}),
 new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}),
];

// ---- BODY
const body=[
 H1("1. Introduction"),
 P("A university campus is a network of buildings connected by roads and footpaths. New students, visitors and even regular staff often need to travel between departments, the library, the canteen or the hostel, and the shortest route is not always the most obvious one. A digital path finder removes this guesswork."),
 P("Route finding is a classic application of graph theory. Once a map is turned into a graph, the question “what is the shortest way from A to B?” becomes the single-source shortest path problem, which Dijkstra's algorithm solves efficiently and exactly when all distances are non-negative."),
 H2("1.1 Motivation"),
 bl("Large campuses have many buildings and multiple possible routes between them."),
 bl("Printed maps show connections but do not tell the user which route is shortest."),
 bl("The problem is a compact, practical way to apply data structures and algorithms learned in the AI & ML curriculum."),
 H2("1.2 Scope"),
 P("The project covers modelling the campus as a graph, implementing Dijkstra's algorithm, verifying results on sample queries, and presenting the algorithm through an interactive website. The distances used in the model are illustrative and can be replaced with surveyed distances."),

 H1("2. Problem Statement and Objectives"),
 P([B("Problem statement: "),"Given a set of campus locations and the walkways that connect them, find the shortest path and its total length between any chosen source and destination."]),
 H2("2.1 Objectives"),
 nl("Represent the campus as a weighted undirected graph.","n1"),
 nl("Implement Dijkstra's algorithm using a priority queue.","n1"),
 nl("Return both the route (sequence of buildings) and the total distance.","n1"),
 nl("Verify correctness with worked examples and hand traces.","n1"),
 nl("Build a website that explains the algorithm and lets users run it step by step.","n1"),

 H1("3. Background and Theory"),
 H2("3.1 Graphs"),
 P("A graph G = (V, E) consists of a set of vertices V and a set of edges E. In a weighted graph every edge carries a number, its weight. Here the vertices are campus buildings, the edges are walkways, and the weights are distances in metres. Because a walkway can be walked in both directions, the graph is undirected."),
 H2("3.2 Shortest path problem"),
 P("For a source s and a destination t, the shortest path is the path from s to t whose edge weights add up to the smallest possible total. When every weight is non-negative, this problem can be solved greedily."),
 H2("3.3 Priority queue"),
 P("A priority queue always gives back the item with the smallest key. Dijkstra's algorithm needs to repeatedly pick the unsettled node with the smallest tentative distance, so a min-heap is a natural fit. Python's heapq module provides one, with push and pop each costing O(log n)."),
 H2("3.4 Why not other algorithms?"),
 tbl(["Algorithm","Handles negative weights","Time complexity","Use here"],[
  ["Breadth-First Search","No (counts edges only)","O(V + E)","Not suitable, ignores distances"],
  ["Dijkstra (heap)","No","O((V + E) log V)","Best fit for campus distances"],
  ["Bellman-Ford","Yes","O(V · E)","Unnecessary, slower"],
  ["Floyd-Warshall","Yes","O(V³)","Computes all pairs, overkill for one query"],
  ["A* search","No","Depends on heuristic","Useful with coordinates, future scope"]],[2200,2100,2000,2726]),

 H1("4. Dijkstra's Algorithm"),
 H2("4.1 Idea"),
 P("Dijkstra's algorithm grows a set of “settled” nodes whose shortest distance from the source is final. At each step it settles the closest unsettled node and then checks whether going through that node gives a shorter route to any of its neighbours. This checking step is called relaxation."),
 P("An analogy: drop a stone in a pond at the source. The ripple reaches nearer places first, so the first time the ripple touches the destination it has travelled by the shortest route."),
 H2("4.2 Steps"),
 nl("Set dist[source] = 0 and dist[v] = infinity for every other node v.","n2"),
 nl("Put (0, source) into the min-heap.","n2"),
 nl("Remove the entry with the smallest distance, (d, u). If u is already settled, skip it. Otherwise mark u as settled.","n2"),
 nl("For each neighbour v of u with edge weight w: if d + w < dist[v], set dist[v] = d + w, record prev[v] = u and push (dist[v], v) into the heap.","n2"),
 nl("Stop when the destination is settled or the heap is empty.","n2"),
 nl("Rebuild the route by following prev[] from the destination back to the source and reversing it.","n2"),
 H2("4.3 Pseudocode"),
 ...codeBlock(["function Dijkstra(Graph, source, target):","    for each vertex v: dist[v] = INF; prev[v] = none","    dist[source] = 0","    heap = MinHeap(); heap.push((0, source))","    while heap is not empty:","        (d, u) = heap.pop_min()","        if u is settled: continue","        mark u settled","        if u == target: break","        for each (v, w) in neighbours(u):","            if d + w < dist[v]:","                dist[v] = d + w; prev[v] = u","                heap.push((dist[v], v))","    return path via prev[], dist[target]"]),
 gap(),
 H2("4.4 Correctness (sketch)"),
 P("When a node u is settled, dist[u] is already the true shortest distance. Suppose a shorter route to u existed. It would have to leave the settled region through some unsettled node x with dist[x] ≥ dist[u], since u was the minimum. Adding non-negative remaining edges cannot make the route shorter than dist[u], which is a contradiction. This is why negative weights must not be used."),
 H2("4.5 Complexity"),
 tbl(["Measure","Value","Reason"],[
  ["Time","O((V + E) log V)","Each edge may cause one heap push; each push or pop costs O(log V)"],
  ["Space","O(V + E)","Adjacency list plus dist, prev and heap"],
  ["For this campus","V = 10, E = 16","Result is computed instantly"]],[1800,2300,4926]),

 H1("5. System Design"),
 H2("5.1 Campus graph model"),
 P("The campus is represented by 10 nodes and 16 undirected edges. Weights are approximate walking distances in metres."),
 tbl(["#","Location","Directly connected to (distance in m)"],[
  ["1","Main Gate","Admin Block (120), Library (150), Parking (90)"],
  ["2","Admin Block","Main Gate (120), SOCSE Block (160), Library (110)"],
  ["3","SOCSE Block","Admin Block (160), Canteen (130), Auditorium (110)"],
  ["4","Auditorium","SOCSE Block (110), Sports Ground (150)"],
  ["5","Sports Ground","Canteen (190), Auditorium (150), Hostel (140)"],
  ["6","Library","Main Gate (150), Admin Block (110), Canteen (140), Workshop (170)"],
  ["7","Canteen","Library (140), SOCSE Block (130), Workshop (100), Sports Ground (190), Hostel (180)"],
  ["8","Parking","Main Gate (90), Workshop (200)"],
  ["9","Workshop","Library (170), Parking (200), Canteen (100), Hostel (210)"],
  ["10","Hostel","Sports Ground (140), Workshop (210), Canteen (180)"]],[600,2000,6426]),
 gap(),
 new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:60},children:[new ImageRun({type:'png',data:fig,transformation:{width:560,height:348},altText:{title:"Campus graph",description:"Campus graph with shortest path highlighted",name:"graph"}})]}),
 caption("Figure 5.1: Campus graph with the shortest path from Main Gate to Hostel highlighted"),
 H2("5.2 Data structure"),
 P("The graph is stored as an adjacency list: a dictionary mapping each building to another dictionary of its neighbours and distances. This uses memory proportional to the number of walkways and lets the algorithm visit the neighbours of a node in time proportional to their count."),
 H2("5.3 Overall flow"),
 tbl(["Stage","Description"],[
  ["Input","User selects a source and a destination building"],
  ["Processing","Dijkstra's algorithm with a min-heap computes dist[] and prev[]"],
  ["Output","Ordered list of buildings on the route and the total distance in metres"],
  ["Presentation","Console output (Python) and highlighted route on the website"]],[2200,6826]),

 H1("6. Implementation"),
 H2("6.1 Technology used"),
 bl("Python 3 with the standard heapq module for the priority queue."),
 bl("Matplotlib for drawing the campus graph figure."),
 bl("HTML, CSS and JavaScript (single file, no libraries) for the interactive website."),
 H2("6.2 Python source code"),
 ...codeBlock(code),
 gap(),
 H2("6.3 Program output"),
 P("Running the program on three sample queries produced the following output:"),
 ...codeBlock(["Main Gate -> Hostel: Main Gate -> Library -> Canteen -> Hostel (470 m)","Parking -> Auditorium: Parking -> Main Gate -> Admin Block -> SOCSE Block -> Auditorium (480 m)","Library -> Sports Ground: Library -> Canteen -> Sports Ground (330 m)"]),
 gap(),

 H1("7. Worked Example and Results"),
 H2("7.1 Trace: Main Gate to Hostel"),
 P("The table shows the order in which buildings are settled and which tentative distances improve at each step."),
 tbl(["Step","Settled node","Distance (m)","Distances improved"],trace,[700,2000,1500,4826]),
 gap(),
 P("When the Hostel is settled with distance 470 m, following the predecessors backwards gives Hostel ← Canteen ← Library ← Main Gate. The Hostel is reached through the Canteen (290 + 180 = 470 m) rather than through the Workshop (290 + 210 = 500 m) or the Sports Ground (480 + 140 = 620 m)."),
 H2("7.2 Summary of test queries"),
 tbl(["Source","Destination","Shortest path","Distance (m)"],[
  ["Main Gate","Hostel","Main Gate → Library → Canteen → Hostel","470"],
  ["Parking","Auditorium","Parking → Main Gate → Admin Block → SOCSE Block → Auditorium","480"],
  ["Library","Sports Ground","Library → Canteen → Sports Ground","330"]],[1600,1700,4426,1300]),
 gap(),
 P("All three results were confirmed by hand by listing the alternative routes and comparing their totals. For example, Library to Sports Ground via the Canteen is 140 + 190 = 330 m, which beats the route through the Main Gate, Admin Block, SOCSE Block and Auditorium (150 + 120 + 160 + 110 + 150 = 690 m)."),

 H1("8. Explanatory Website"),
 P("To make the algorithm easy to understand, a companion website was built. It is a single responsive page that works on phones and laptops and supports light and dark themes."),
 P([B("Website link: "),new ExternalHyperlink({link:URL,children:[new TextRun({text:URL,style:"Hyperlink",font:FONT,size:24,color:"0563C1",underline:{}})]})],{al:AlignmentType.LEFT}),
 H2("8.1 Features"),
 tbl(["Feature","What it does"],[
  ["Campus map","Shows the 10 buildings and 16 walkways with distances on each edge"],
  ["Source and destination selectors","Lets the user choose any two buildings"],
  ["Find shortest path","Runs the algorithm with animation and highlights the final route in red"],
  ["Step button","Advances one settled node at a time so each decision can be studied"],
  ["Live distance table","Shows the current distance, predecessor and status of every building"],
  ["Explanation sections","Describe the algorithm steps, complexity and applications in plain language"]],[3000,6026]),
 gap(),
 H2("8.2 How to use the website"),
 nl("Open the link in any modern browser.","n3"),
 nl("Choose a starting building in “From” and a destination in “To”.","n3"),
 nl("Press “Find shortest path” for an animated run, or press “Step” repeatedly to move one building at a time.","n3"),
 nl("Read the message below the map and the distance table to see which distances were improved.","n3"),
 nl("Press “Reset” to start again.","n3"),
 H2("8.3 Design notes"),
 P("The website uses the university's red and gold colours. Gold nodes are settled, the red node is the one being processed, and the final route is drawn as a thick red line. The JavaScript implementation follows the same logic as the Python program and gives the same distances, for example 470 m from the Main Gate to the Hostel."),

 H1("9. Advantages, Limitations and Future Scope"),
 H2("9.1 Advantages"),
 bl("Gives the exact shortest route, not an approximation."),
 bl("Efficient enough for large maps, thanks to the heap."),
 bl("Simple to understand, implement and visualise."),
 H2("9.2 Limitations"),
 bl("Distances are static; live conditions such as crowds or closed paths are not considered."),
 bl("Does not work with negative edge weights."),
 bl("The current model uses illustrative distances instead of surveyed values."),
 H2("9.3 Future scope"),
 bl("Load real distances from a campus survey or GPS data."),
 bl("Add A* search with straight-line distance as a heuristic to speed up large maps."),
 bl("Support accessibility options, for example ramps-only or covered walkways."),
 bl("Turn the website into a mobile app with turn-by-turn directions and live location."),
 bl("Add time-based weights so that the route changes when paths are crowded."),

 H1("10. Conclusion"),
 P("This project showed how a practical problem, finding the quickest route on a campus, can be solved by turning the map into a weighted graph and applying Dijkstra's algorithm. The Python implementation returned correct routes and distances that were checked by hand, and the interactive website makes the working of the algorithm visible step by step."),
 P("Through the project, the team gained hands-on experience with graph representation, priority queues, algorithm analysis and presenting technical ideas on the web. The same approach can be extended to real campus data and to other navigation problems."),

 H1("References"),
 nl("E. W. Dijkstra, “A note on two problems in connexion with graphs,” Numerische Mathematik, vol. 1, pp. 269–271, 1959.","n4"),
 nl("T. H. Cormen, C. E. Leiserson, R. L. Rivest and C. Stein, Introduction to Algorithms, 4th ed., MIT Press, 2022.","n4"),
 nl("S. Russell and P. Norvig, Artificial Intelligence: A Modern Approach, 4th ed., Pearson, 2021.","n4"),
 nl("Python Software Foundation, “heapq – Heap queue algorithm,” Python 3 documentation, https://docs.python.org/3/library/heapq.html.","n4"),
 nl("R. Sedgewick and K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011.","n4"),
];

const doc=new Document({
 creator:"SOCSE Sandip University",title:"Campus Shortest Path Finder using Dijkstra's Algorithm",
 features:{updateFields:true},
 styles:{default:{document:{run:{font:FONT,size:24}}},
  paragraphStyles:[
   {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:32,bold:true,font:FONT,color:"000000"},paragraph:{spacing:{before:0,after:240},outlineLevel:0}},
   {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:26,bold:true,font:FONT,color:"1F1F1F"},paragraph:{spacing:{before:240,after:120},outlineLevel:1}}]},
 numbering:{config:[
  {reference:'b',levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  {reference:'n',levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},{reference:'n1',levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},{reference:'n2',levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},{reference:'n3',levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},{reference:'n4',levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]}]},
 sections:[{
  properties:{page:{size:{width:11906,height:16838},margin:{top:1440,bottom:1440,left:1440,right:1440}}},
  headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"C9973A",space:4}},children:[new TextRun({text:"Campus Shortest Path Finder using Dijkstra's Algorithm  |  Sandip University",font:FONT,size:18,color:"555555"})]})]})},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Page ",font:FONT,size:20}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:20})]})]})},
  children:[...cover,...front,...body]}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('/mnt/user-data/outputs/Campus_Shortest_Path_Finder_Report.docx',b);console.log('ok')});
