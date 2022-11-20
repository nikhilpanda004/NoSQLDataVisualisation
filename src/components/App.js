import React from "react";
import { NeoGraph, ResponsiveNeoGraph } from "./NeoGraph";
import Home from "./Home"

// const NEO4J_URI =  "neo4j://44.202.250.148:7687"; //"neo4j://1a430677520bddec666b2bbf296ad118.neo4jsandbox.com:7687";
// const NEO4J_USER = "neo4j";
// const NEO4J_PASSWORD =  "chief-sleep-target";

const App = () => {
  return (
    <div>
      <Home />
    </div>
    // <div className="App" style={{ fontFamily: "Quicksand" }}>
    //   <h1>Output</h1>
    //   <NeoGraph
    //     width={1000}
    //     height={800}
    //     containerId={"id1"}
    //     neo4jUri={NEO4J_URI}
    //     neo4jUser={NEO4J_USER}
    //     neo4jPassword={NEO4J_PASSWORD}
    //     backgroundColor={"#b2beb5"}
    //   />
    // </div>
  );
};

export default App;