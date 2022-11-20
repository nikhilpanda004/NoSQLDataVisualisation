import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Neovis from "neovis.js/dist/neovis.js";
import {ErrorBoundary} from "react-error-boundary";

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
    neo4jLabels
  } = props;

  const visRef = useRef();
  let vis;
  useEffect(() => {
    const config = {
      containerId: visRef.current.id,
			neo4j: {
				serverUrl: neo4jUri,
				serverUser: neo4jUser,
				serverPassword: neo4jPassword,
        // driverConfig: { 
        //   encrypted: "ENCRYPTION_ON",
        //   trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"
        //   }
			},
      visConfig: {
        nodes: {
          shape: 'square'
        },
        edges: {
          arrows: {
            to: {enabled: true}
          }
        },
      },
      labels: {
        Actor: {
          label: neo4jLabels ? "name" : "",
          value: "imdbId",
          group: "bornIn",
          [Neovis.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              color: "#97c2fc",
              //shape: "dot",
              //size: 25,
              font: {
                "background": "none",
                "strokeWidth": "0",
                "size": 12,
                "color": "black"
              }
            },
        }
        },
        Movie: {
          label: neo4jLabels ? "title" : "",
          value: "imdbRating",
          group: "year",
          [Neovis.NEOVIS_ADVANCED_CONFIG]: {
              static: {
                shape: 'triangle'
              }
          }
        },
        Director: {
          label: neo4jLabels ? "name" : "",
        },
        Genre: {
          label: neo4jLabels ? "name" : "",
        },
        Person: {
          label: neo4jLabels ? "name" : "",
          value: "imdbId",
          group: "bornIn",
          [Neovis.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              color: "#97c2fc",
              //shape: "dot",
              //size: 25,
              font: {
                "background": "none",
                "strokeWidth": "0",
                "size": 12,
                "color": "black"
              }
            },
        }
        },
        User: {
          label: 'name'
        }
      },
      relationships: {
        ACTED_IN: {
          label: neo4jLabels ? "role" : "",
          [Neovis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: visRef.current.id.objectToTitleHtml
            },
          }
        },
        DIRECTED: {
          label: neo4jLabels ? "directed" : "",
        },
        RATED: {
          value: "rating",
          // [Neovis.NEOVIS_ADVANCED_CONFIG]: {
          //     function: {
          //       label: (edge) => {
          //           return visRef.current.id.nodeToHtml(edge, undefined);
          //       }
          //     },
          // }
        }
      },
      initialCypher: "Match (n) return n limit 0",
    };
    visRef.current.vis = new Neovis(config);
    if (neo4jCypherQuery != null)
        visRef.current.vis .render();
  }, [neo4jUri, neo4jUser, neo4jPassword, neo4jLabels]);

  useEffect(() => {
    if (neo4jCypherSubmit)
    {
      if (visRef.current.vis  != null && neo4jCypherQuery.length > 0)
      {
        visRef.current.vis.clearNetwork();
        visRef.current.vis.renderWithCypher(neo4jCypherQuery);
      }
    }
    else
    {
      visRef.current.vis.clearNetwork();
    }
  }, [neo4jCypherSubmit, neo4jCypherQuery, neo4jLabels]);

  return (
    <div
      id={containerId}
      ref={visRef}
      style={{
        width: `${width}`,
        height: `${height}`,
        backgroundColor: `${backgroundColor}`,
      }}
    />
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
