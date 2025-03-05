import React from 'react';
import { Navigate } from 'react-router-dom';

// Simulez la récupération de l'utilisateur authentifié et de son rôle
const getAuthenticatedUser = () => {
  return {
    token: localStorage.getItem('authToken'), // Stockez le token après authentification
    role: localStorage.getItem('userRole') // Stockez le rôle de l'utilisateur (Gestionnaire, Manager, Commercial)
  };
};

const PrivateRoute = ({ element: Element, allowedRoles, ...rest }) => {
  const user = getAuthenticatedUser();

  if (!user.token) {
    // Si l'utilisateur n'est pas authentifié, redirigez vers la page de connexion
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Si l'utilisateur n'a pas le rôle autorisé, redirigez vers une autre page (par exemple, la page d'accueil)
    return <Navigate to="/" />;
  }

  // Si l'utilisateur est authentifié et a le rôle correct, autorisez l'accès au composant
  return Element;
};

export default PrivateRoute;
