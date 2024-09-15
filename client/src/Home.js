import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddProblem from "./AddProblem";
import ViewProblems from "./ViewProblems";
import LoadProblem from "./LoadProblem";
import "./stylesheets/home.css";
import DefaultEditor from "./DefaultEditor";

function Home() {
  return (
    <Router>
      <div className="nav-bar">
        <Link className="nav-links" to={"/"}>
          Home
        </Link>
        <Link className="nav-links" to={"/view-problem-set"}>
          Problem Set
        </Link>
        <Link className="nav-links" to={"/add-problem"}>
          Add Problem
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<DefaultEditor />} />
        <Route path="/view-problem-set" element={<ViewProblems />} />
        <Route path="/load-problem/:id" element={<LoadProblem />} />
        <Route path="/add-problem" element={<AddProblem />} />
      </Routes>
    </Router>
  );
}

export default Home;
