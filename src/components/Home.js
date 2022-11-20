import React from "react";
import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { NeoGraph, ResponsiveNeoGraph } from "./NeoGraph";

const NEO4J_URI =  "neo4j://44.202.250.148:7687"; //"neo4j://1a430677520bddec666b2bbf296ad118.neo4jsandbox.com:7687";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD =  "chief-sleep-target";

class Home extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: '',
                    query: '',
                    vis: false,
                    neo4jLabels: false};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({query: event.target.value});
    }
  
    handleSubmit(event) {
      if (this.state.query.length > 0)
      {
        this.setState({value: this.state.query});
        this.setState({vis: !(this.state.vis)});
            //this.state.value = this.state.query;
            //this.state.vis = true;
      }
      event.preventDefault();
    }
  
    componentDidMount(){
      //this.state.value = 'Match n Return Distinct Labels(n)';
    }

    render() {
      return (
        <>
        <Form  onSubmit={this.handleSubmit} onReset={() => { this.setState({vis: !(this.state.vis)}) }}>
          <Form.Group className="container"> 
            <Card className="card mt-3">
                <Card.Body>
                  <InputGroup>
                    <InputGroup.Text> Query: </InputGroup.Text>
                    <Form.Control as='textarea' value={this.state.query} onChange={this.handleChange} />
                  </InputGroup>
                </Card.Body>
                <Card.Footer className="d-flex flex-row">
                  <Button className="me-3" type="submit" variant="secondary">Fetch</Button>
                  <Button className="me-3" type="reset" variant="warning">Reset</Button>
                  <Form.Check className="me-3 my-auto" type="switch" label="Labels" value={this.state.neo4jLabels} onChange={() => { this.setState({neo4jLabels: !(this.state.neo4jLabels)})}}/>
                </Card.Footer>
            </Card>
          </Form.Group>
        </Form>
        <Container className="mt-5">
            {
                <NeoGraph
                    width={'100%'}
                    height={'600px'}
                    containerId={"id1"}
                    neo4jUri={NEO4J_URI}
                    neo4jUser={NEO4J_USER}
                    neo4jPassword={NEO4J_PASSWORD}
                    backgroundColor={"#b2beb5"}
                    neo4jCypherQuery={this.state.value}
                    neo4jCypherSubmit = {this.state.vis}
                    neo4jLabels = {this.state.neo4jLabels}
                    />
        
            }
          </Container>
        </>
      );
    }
  }

  export default Home;