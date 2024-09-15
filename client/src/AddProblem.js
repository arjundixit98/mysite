import React, { useState } from "react";
import axios from "axios";
import "./stylesheets/addproblem.css";
function AddProblem() {
  const [problemName, setProblemName] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [testCasesCount, setTestCasesCount] = useState("");
  const [testCaseInput, setTestCaseInput] = useState("");
  const [testCaseExpectedOutput, setTestCaseExpectedOutput] = useState("");

  const handleSubmit = async () => {
    const payload = {
      problemName,
      problemDescription,
      testCasesCount,
      testCaseInput,
      testCaseExpectedOutput,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/problems/add-problem`,
        payload
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error received while sending data to server", error);
    }
  };

  return (
    <div className="add-prob-page">
      <h1>Add New Problem</h1>

      <label>
        Problem Name :
        <input
          type="text"
          value={problemName}
          onChange={(e) => setProblemName(e.target.value)}
          placeholder="Problem name"
        />
      </label>

      <br />

      <label>
        Number of Test Cases :
        <input
          type="text"
          value={testCasesCount}
          onChange={(e) => setTestCasesCount(e.target.value)}
          placeholder="Test case count"
        />
      </label>

      <br />
      <label>
        Description :
        <textarea
          rows={8}
          cols={70}
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
          placeholder="Provide description for problem"
        />
      </label>
      <br />
      <label>
        TestCase Input:
        <textarea
          rows={8}
          cols={70}
          value={testCaseInput}
          onChange={(e) => setTestCaseInput(e.target.value)}
          placeholder="Provide test case input"
        />
      </label>

      <br />
      <label>
        Testcase Output:
        <textarea
          rows={8}
          cols={70}
          value={testCaseExpectedOutput}
          onChange={(e) => setTestCaseExpectedOutput(e.target.value)}
          placeholder="Problem test case expected output"
        />
      </label>
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
export default AddProblem;
