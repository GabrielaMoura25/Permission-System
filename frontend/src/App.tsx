import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import UserDetails from './components/UserDetails';
import Home from './components/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/user-details/:email' element={<UserDetails />} />
      </Routes>
    </Router>
  );
}