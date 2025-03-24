import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const baseClass = "px-4 py-2 rounded-md transition-colors";
    return location.pathname === path
      ? `${baseClass} bg-primary text-white`
      : `${baseClass} text-primary hover:bg-primary/10`;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-semibold text-primary font-montserrat">
            Neuro-Divergent Study Helper
          </Link>
          <div className="flex space-x-2">
            <Link to="/" className={getLinkClass('/')}>
              Home
            </Link>
            <Link to="/about" className={getLinkClass('/about')}>
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 