import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./stylesheets/loadproblem.css";
import Editor from "./Editor";
import TestCase from "./TestCase";
const LoadProblem = () => {
  const containerRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const { id: problemId } = useParams();
  const [codeOutput, setCodeOutput] = useState("");
  const [errorOutput, setErrorOutput] = useState("");
  if ((codeOutput || errorOutput) && containerRef.current) {
    const container = containerRef.current;
    setTimeout(() => {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }, 0);
  }
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [runtime, setRuntime] = useState("");
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/problems/get-problem`,
          { params: { id: problemId } }
        );
        console.log(data);

        setProblem(data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchProblem();
  }, []);

  return (
    <div className="load-problem-page">
      <main>
        <div className="problem-section">
          {problem ? (
            <div>
              <p className="problem-title">
                {problem.problemNumber} : {problem.name}
              </p>
              <p className="problem-desc">{problem.description}</p>
              <div className="testcase-sec">
                <div className="input">
                  <p className="problem-inp">Input:</p>
                  <p className="example">{problem.testCaseInputString}</p>
                </div>
                <div className="output">
                  <p className="problem-out">Output:</p>
                  <p className="example">
                    {problem.testCaseExpectedOutputString}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <h2>Loading..</h2>
          )}
        </div>
        <div ref={containerRef} className="right-container">
          <Editor
            problemId={problemId}
            setCodeOutput={setCodeOutput}
            setRuntime={setRuntime}
            setErrorOutput={setErrorOutput}
            setSubmitButtonClicked={setSubmitButtonClicked}
            height={"280px"}
            width={"670px"}
          />
          {problem && (
            <TestCase
              problemData={problem}
              codeOutput={codeOutput}
              runtime={runtime}
              errorOutput={errorOutput}
              submitButtonClicked={submitButtonClicked}
            />
          )}
        </div>
      </main>
    </div>
  );
};
export default LoadProblem;
