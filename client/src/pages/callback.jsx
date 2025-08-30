import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      navigate('/');
    }
  }, [navigate, location]);

  return <div>Loading...</div>;
}

export default Callback;