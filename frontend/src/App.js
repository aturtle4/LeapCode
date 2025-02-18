import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Home from './Components/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path = '/' element = {<Navigate to='/login' />} />
        <Route path = '/login' element = {<Login />} />
        <Route path = '/signUp' element = {<SignUp />} />
        <Route path = '/home' element = {<Home />} />
      </Routes>
    </div>
  );
}

export default App;
