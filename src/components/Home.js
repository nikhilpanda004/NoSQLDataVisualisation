import React, {useEffect, useRef, useState} from "react";
import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { NeoGraph } from "./NeoGraph";
import {auth, driver, Driver, Session} from 'neo4j-driver'

const NEO4J_URI =  process.env.REACT_APP_NEO4J_URI;
const NEO4J_USER = process.env.REACT_APP_NEO4J_USER;
const NEO4J_PASSWORD =  process.env.REACT_APP_NEO4J_PASSWORD;

function Home (props) {
    const queryArea = useRef();
    const [value, setValue] = useState('');
    const [query, setQuery] = useState('');
    const [vis, setVis] = useState(false);
    const [neo4jLabels, setNeo4jLabels] = useState(false);
    const [neo4jVisConfig, setNeo4jVisConfig] = useState(true);
    const [labels, setlabels] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState(new Set());
    const [selectedEdges, setSelectedEdges] = useState(new Set());

    useEffect(() => {
      const neo4j = require('neo4j-driver');
      const driver = neo4j.driver('bolt://3.95.149.64:7687',
                    neo4j.auth.basic('neo4j', 'explanation-minuses-height')); 
      var query = "Match (n) Return Distinct Labels(n) as Label";
      const session = driver.session({database:"neo4j"});

      // Fetching Label names
      session.run(query)
      .then((result) => {
        setlabels(result.records)
        // result.records.forEach((record) => {
        //     console.log(record.get('Label'));
        // });
        session.close();
      })
      .catch((error) => {
        console.error(error);
      });

      //Fetching Edge names
      query = "Match ()-[r]->() Return Distinct Type(r) as Edge";
      driver.session({database:"neo4j"}).run(query)
      .then((result) => {
        setEdges(result.records);
        driver.session({database:"neo4j"}).close();
      })
      .catch((error) => {
        console.error(error);
      });
      driver.close();
    }, []);

    //   useEffect(() => {
    // }, []);

    const handleChange = (event) => {
      setValue(event.target.value);
    };
  
    const handleSubmit = (event) => {
      if (value.length > 0)
      {
        setQuery(value);
        setVis(true);
      }
      event.preventDefault();
    };

    const handleLabelSelection = (event) => {
      //let tempQuery = value;
      // if (value.length > 0)
      //   tempQuery = tempQuery + "\n UNION \n";
      let [type, name] = event.target.id.split('-');
      switch(type.toLowerCase())
      {
        case 'label': let tempSelectedLabels = selectedLabels;
                      if (event.target.checked)
                        tempSelectedLabels.add(name);
                      else
                        tempSelectedLabels.delete(name);
                      setSelectedLabels(tempSelectedLabels);
                      break;
        case 'edge':  let tempSelectedEdges = selectedEdges;
                      if (event.target.checked)
                          tempSelectedEdges.add(name);
                      else
                          tempSelectedEdges.delete(name);
                      setSelectedEdges(tempSelectedEdges);
                      break; 
        default: break;       
      }
      queryBuilder();
    }

    const queryBuilder = () => {
      let queryText = "";
      if(selectedEdges.size < 1)
      {
        selectedLabels.forEach (function(value) {
          if(queryText !== '')
            queryText += ' OR ';
          queryText += "label:" + value;
        })
        queryText = "Match (label) Where " + queryText + " Return (label) Limit 25";
      }
      else if(selectedLabels.size < 1)
      {
        selectedEdges.forEach (function(value) {
          if(queryText !== '')
            queryText += '|';
          queryText += ':'+value;
        })
        queryText = "Match p=()-[" + queryText + "]->() Return (p) Limit 25";
      }
      else{
        let queryLabel1 = '';
        let queryLabel2 = '';
        let queryEdge = '';
        selectedLabels.forEach (function(value) {
          if(queryLabel1 !== '')
              queryLabel1 += ' OR ';
          queryLabel1 += "label1:" + value;
          if(queryLabel2!== '')
              queryLabel2 += ' OR ';
          queryLabel2 += "label2:" + value;
        })
        selectedEdges.forEach (function(value) {
          if(queryEdge !== '')
              queryEdge += '|';
          queryEdge += ':'+value;
        })
        queryText = "Match p=(label1)-[" + queryEdge + "]->(label2) Where " +  queryLabel1 + "   OR " + queryLabel1 + " Return p Limit 25"
      }
      setValue(queryText);
    } 

      return (
        <>
        <Form onSubmit={(event) => handleSubmit(event)} onReset={() => {setVis(false);  setValue('');}}>
          <Form.Group className="container"> 
            <Card className="card mt-3">
                <Card.Body>
                  <InputGroup>
                    <InputGroup.Text> Query: </InputGroup.Text>
                    <Form.Control as='textarea' ref={queryArea} value={value} onChange={(event) => handleChange(event)} />
                  </InputGroup>
                </Card.Body>
                <div className="d-flex flex-row">
                  <div className="d-block">
                  <Form.Group className="d-block flex-row">
                    <div className="d-flex flex-row mb-2">
                        <Button className="mx-3" type="submit" variant="secondary">Fetch</Button>
                        <Button className="mx-3" type="reset" variant="warning">Reset</Button>
                    </div>
                    <Form.Check className="mx-3 my-auto" type="switch" label="Labels" value={neo4jLabels} onChange={() => { setNeo4jLabels(!neo4jLabels)}}/>
                    <Form.Check className="mx-3 my-auto" type="switch" label="Default Config" defaultChecked value={neo4jVisConfig} onChange={() => { setNeo4jVisConfig(!neo4jVisConfig)}}/>
                  </Form.Group>
                  <Form.Group className="d-block flex-row mt-3">
                    <Form.Label className="mx-3">Labels:</Form.Label>
                    {
                      labels.map((labelrec) => {
                        let labelName = labelrec.get('Label')[0];
                        return (<Form.Check className="mx-3" id={"label-"+labelName} type="checkbox" label={labelName} value={true} onChange={(event) => handleLabelSelection(event)}/>)
                      })
                    }
                  </Form.Group>
                  <Form.Group className="d-block flex-row mt-3">
                    <Form.Label className="mx-3">Edges:</Form.Label>
                    {
                      edges.map((edgerec) => {
                        let edgeName = edgerec.get('Edge');
                        return (<Form.Check className="mx-3" id={"edge-"+edgeName} type="checkbox" label={edgeName} value={true} onChange={(event) => handleLabelSelection(event)}/>)
                      })
                    }
                  </Form.Group>
                  </div>
                  <NeoGraph
                    width={'100%'}
                    height={'600px'}
                    containerId={"id1"}
                    backgroundColor={"#b2beb5"}
                    neo4jUri={NEO4J_URI}
                    neo4jUser={NEO4J_USER}
                    neo4jPassword={NEO4J_PASSWORD}
                    neo4jCypherQuery={query}
                    neo4jCypherSubmit = {vis}
                    neo4jLabels = {neo4jLabels}
                    neo4jVisConfig = {neo4jVisConfig}
                    />
                </div>
            </Card>
          </Form.Group>
        </Form>
        {/* <Container className="mt-5">
            {
                // <NeoGraph
                //     width={'100%'}
                //     height={'600px'}
                //     containerId={"id1"}
                //     backgroundColor={"#b2beb5"}
                //     neo4jUri={NEO4J_URI}
                //     neo4jUser={NEO4J_USER}
                //     neo4jPassword={NEO4J_PASSWORD}
                //     neo4jCypherQuery={query}
                //     neo4jCypherSubmit = {vis}
                //     neo4jLabels = {neo4jLabels}
                //     neo4jVisConfig = {neo4jVisConfig}
                //     />
        
            }
          </Container> */}
        </>
      );
    }

  export default Home;