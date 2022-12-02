import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Neovis from "neovis.js/dist/neovis.js";
import {ErrorBoundary} from "react-error-boundary";

const NeoSchema = (props) => {
  const {
    backgroundColor,
    neo4jUri,
    neo4jUser,
    neo4jPassword,
  } = props;

  useEffect(() => {
    const neo4j = require('neo4j-driver');
    const driver = neo4j.driver('neo4j://44.202.250.148:7687',
                  neo4j.auth.basic('neo4j', 'chief-sleep-target')); 
    var query = "Match (n) Return Distinct Labels(n) as Label"
    session.run(query, params)
    .then((result) => {
      result.records.forEach((record) => {
          console.log(record.get('Label'));
      });
      session.close();
      driver.close();
    })
    .catch((error) => {
      console.error(error);
    });
  }, [neo4jUri, neo4jUser, neo4jPassword]);
}

export { NeoSchema };