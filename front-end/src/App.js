import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import Login from './components/login';
import Dashboard from './components/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
