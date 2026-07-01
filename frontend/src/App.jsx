import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleDetail from './pages/ArticleDetail';
import ArticleForm from './pages/ArticleForm';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/new" element={<ArticleForm />} />
          <Route path="/articles/:id/edit" element={<ArticleForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
