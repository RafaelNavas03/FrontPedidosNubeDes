const { Header, Content, Footer } = Layout;
import {
  Layout,
  Menu,
  Row,
  Col,
  Image,
  Dropdown,
  Button,
  Badge,
  theme,
  Breadcrumb,
  Tooltip,
} from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MapComponent from "./components/MapaUbicacion";
import Carrusel from "./components/pruebaCarrusel";
import MenuNavBar from "./components/MenuNavBar";
import ProfileEditor from "./components/EditarUser";
import LoginForm from "./components/Login";
import RegisterForm from "./components/registro";
import AdminMenu from './components/adminmenu';
import React, { useState } from 'react';

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const renderContent = () => {
    const storedToken = localStorage.getItem("token");
    if (user || storedToken) {
      return <AdminMenu />;
    }
    return <LoginForm onLogin={handleLogin} />;
  };

  return (
    <Router>
      <Layout>
        <Content>
          <div>
            <Routes>
              {/* Ruta principal para mostrar Carrusel */}
              <Route path="/" element={<Carrusel />} />

              {/* Rutas para otras secciones */}
              <Route path="/Mapa" element={<MapComponent />} />
              <Route path="/Carrusel" element={<Carrusel />} />
              <Route path="/Menu" element={<MenuNavBar />} />
              <Route path="/perfil" element={<ProfileEditor />} />
              <Route path="/home" element={<AdminMenu />} />

              {/* Rutas para autenticación */}
              <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
              <Route path="/registro" element={<RegisterForm />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
