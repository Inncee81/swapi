import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import ReactJson from "react-json-view";

function App() {
  const [endpoint, setEndpoint] = useState("");
  const [currentData, setCurrentData] = useState();

  const handleClick = (apiEndpoint) => {
    fetch(`/api/${apiEndpoint}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentData(data);
        setEndpoint(apiEndpoint);
      })
      .catch((err) => console.log(err));
  };

  const renderData = () => {
    if (typeof currentData === "object") {
      return (
        <>
          {/* <ReactJson
            style={{ width: "53%", maxHeight: "340px", textAlign: "left" }}
            src={currentData.result.properties}
            name={false}
            theme="bright:inverted"
            indentWidth={10}
            enableClipboard={false}
            enableAdd={false}
            enableDelete={false}
            displayDataTypes={false}
            displayObjectSize={false}
            collapseStringsAfterLength={false}
          /> */}
          <pre>{JSON.stringify(currentData, null, 2)}</pre>
        </>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    handleClick("people/1");
  }, []);

  return (
    <div className="App">
      <div className="row yellow">
        <div className="app-header">
          <h1>SWAPI</h1>
          <p>The Star Wars API</p>
          <p>
            <Link to="/about">(...looking for swapi.co?)</Link>
          </p>
        </div>
      </div>
      <div className="content-container">
        <div className="row">
          <div>
            <p>All the Star Wars data you've ever wanted:</p>
            <p>
              <b>Planets, Spaceships, Vehicles, People, Films and Species</b>
            </p>
            <h4>Now with The Force Awakens data!</h4>
          </div>
        </div>

        <div className="row">
          <hr />
          <h1>Try it now!</h1>
          <div className="input-group">
            <span className="input-group-addon">
              https://rec-swapi.herokuapp.com/api/
            </span>
            <input
              className="input-group-control"
              type="text"
              placeholder="people/1/"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-primary"
                onClick={() => handleClick(endpoint)}
              >
                request
              </button>
            </span>
          </div>
          <small>
            Need a hint? try{" "}
            <Link to="" onClick={() => handleClick("people/1")}>
              <i>people/1/</i>
            </Link>{" "}
            or{" "}
            <Link to="" onClick={() => handleClick("planets/3")}>
              <i>planets/3/</i>
            </Link>{" "}
            or{" "}
            <Link to="" onClick={() => handleClick("starships/9")}>
              <i>starships/9/</i>
            </Link>
          </small>
          <p className="result-header">Result:</p>
          <div className="json-content">
            <div className="well">{renderData()}</div>
          </div>
        </div>

        <div className="bottom-row">
          <div>
            <h4>What is this?</h4>
            <p>
              The Star Wars API, or "swapi" (Swah-pee) is the world's first
              quantified and programmatically-accessible data source for all the
              data from the Star Wars canon universe!
            </p>
            <p>
              We've taken all the rich contextual stuff from the universe and
              formatted into something easier to consume with software. Then we
              went and stuck an API on the front so you can access it all!
            </p>
          </div>
          <div>
            <h4>How can I use it?</h4>
            <p>
              All the data is accessible through our HTTP web API. Consult our{" "}
              <Link to="/docs">documentation</Link> if you'd like to get
              started.
            </p>
          </div>
          <div>
            <h4>What happened with old swapi.co?</h4>
            <p>
              swapi.co is not supported and maintained anymore. But since so
              many projects and tutorials used it as their educational
              playground, this is an "unofficial" branch
            </p>
          </div>
        </div>
        <hr />

        <div className="footer">
          <div>
            Originially by Paul Hallett | Refactored and Maintained by Ryan
            Curtis &copy;{new Date().getFullYear()}
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}

export default App;
