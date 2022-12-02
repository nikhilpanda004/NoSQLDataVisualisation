import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import NeoVis from "neovis.js/dist/neovis.js";
import {ErrorBoundary} from "react-error-boundary";
//import 'vis-network/styles' // 'vis-network/styles'
import { Network } from "vis-network";

const NeoGraph = (props) => {
  const {
    width,
    height,
    containerId,
    backgroundColor,
    neo4jUri,
    neo4jUser,
    neo4jPassword,
    neo4jCypherQuery,
    neo4jCypherSubmit,
    neo4jLabels,
    neo4jVisConfig
  } = props;

  const visRef = useRef();
  const queryResultSpan = useRef();
  let vis;
  useEffect(() => {

    const config = {
      containerId: visRef.current.id,
			neo4j: {
				serverUrl: 'bolt://0e079bbb.databases.neo4j.io', //'bolt://3.95.149.64:7687',
				serverUser: 'neo4j',
				serverPassword:  'nvDO1aeIzIDHo_TcCZC73tp2hA_1PqHrZUO_zvDhZvA', //'explanation-minuses-height',
        // driverConfig: { 
        //   encrypted: "ENCRYPTION_ON",
        //   trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"
        //   }
			},
      visConfig: (neo4jVisConfig)? {} : {
        nodes: {
          shape: 'square',
          //title: (node) => { return visRef.current.vis.objectToTitleHtml(node) }
        },
        edges: {
          arrows: {
            to: {enabled: true}
          }
        },
        interaction: {
          dragNodes:true,
          dragView: true,
          hideEdgesOnDrag: false,
          hideEdgesOnZoom: false,
          hideNodesOnDrag: false,
          hover: true,
          hoverConnectedEdges: true,
          keyboard: {
            enabled: false,
            speed: {x: 10, y: 10, zoom: 0.02},
            bindToWindow: true,
            autoFocus: true,
          },
          multiselect: false,
          navigationButtons: true,
          selectable: true,
          selectConnectedEdges: true,
          tooltipDelay: 0,
          zoomSpeed: 1,
          zoomView: true
        },
      },
      labels: (neo4jVisConfig)? {
        Person: {
          label: neo4jLabels ? "name" : "",
          title: "<b><i>NODE 3</i></b>",
        },
        Movie: {
          label: neo4jLabels ? "title" : ""
        },
      } : {
        Person: {
          label: neo4jLabels ? "name" : "",
          group: "born",
          title: "born",
          shape: 'circle'
        },
        Movie: {
          label: neo4jLabels ? "title" : "",
          group: "released",
          title: "released",
        },
        User: {
          label: 'name'
        }
      },
      relationships: (neo4jVisConfig)? {
        ACTED_IN: {
          label: neo4jLabels ? "roles" : ""
        },
        DIRECTED: {
          label: neo4jLabels ? "directed" : "",
        },
        REVIEWED: {
          label: neo4jLabels ? "summary" : "",
        },
        PRODUCED: {

        },
        WROTE: {
          
        },
        FOLLOWS: {
        }
      } : {
        ACTED_IN: {
          label: neo4jLabels ? "roles" : "",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              //title: visRef.current.id.objectToTitleHtml
            },
          }
        },
        DIRECTED: {
          label: neo4jLabels ? "directed" : "",
        },
        // RATED: {
        //   value: "rating",
        //   // [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
        //   //     function: {
        //   //       label: (edge) => {
        //   //           return visRef.current.id.nodeToHtml(edge, undefined);
        //   //       }
        //   //     },
        //   // }
        // }
        FOLLOWS: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              label: 'Follows'
              //title: visRef.current.id.objectToTitleHtml
            },
          }
        },
        REVIEWED: {
          label: neo4jLabels ? "summary" : "",
        },
        PRODUCED: {

        },
        WROTE: {
          
        }
      },
      initialCypher: "Match (n) return n limit 0",
    };
    visRef.current.vis = new NeoVis(config);
    if (neo4jCypherQuery.length > 0)
    {
      visRef.current.vis.clearNetwork();
      visRef.current.vis.render();
      //console.log(visRef.current.vis['nodes'].length);
  }
  }, [neo4jUri, neo4jUser, neo4jPassword, neo4jLabels, neo4jVisConfig]);

  useEffect(() => {
    if (neo4jCypherSubmit)
    {
      if (visRef.current.vis  != null && neo4jCypherQuery.length > 0)
      {
        visRef.current.vis.clearNetwork();
        visRef.current.vis.renderWithCypher(neo4jCypherQuery);
        //console.log(visRef.current.vis.nodes.length);
      }
    }
    else
    {
      visRef.current.vis.clearNetwork();
    }
  }, [neo4jCypherSubmit, neo4jCypherQuery, neo4jLabels, neo4jVisConfig]);

  return (
    <>
    <span ref={queryResultSpan}></span>
    <div
      id={containerId}
      ref={visRef}
      style={{
        width: `${width}`,
        height: `${height}`,
        backgroundColor: `${backgroundColor}`,
      }}
    />
    </>
  );
};

NeoGraph.defaultProps = {
  width: '600px',
  height: '600px',
  backgroundColor: "#d3d3d3",
};

// NeoGraph.propTypes = {
//   width: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   containerId: PropTypes.string.isRequired,
//   neo4jUri: PropTypes.string.isRequired,
//   neo4jUser: PropTypes.string.isRequired,
//   neo4jPassword: PropTypes.string.isRequired,
//   backgroundColor: PropTypes.string,
// };

export { NeoGraph };




// viz.registerOnEvent("completed", (e)=>{ 
//   viz["_network"].on("click", (event)=>{ 
//       console.log(event.nodes[0]);
//   });
// });