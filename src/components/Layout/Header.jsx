import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../services/authService';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          Run Off The Meal
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/recipes">All Recipes</Link>
          <Link to="/search">Search by Ingredients</Link>
          <Link to="/submit">Submit Recipe</Link>
          {user ? (
            <>
              <Link to="/admin">Admin</Link>
              <button className="btn-link" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Admin Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
