// NavbarComponent.jsx
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isLogedIn");
    navigate("/login");
  };
  const isLoggedIn = localStorage.getItem("isLogedIn");
  return (
    <Navbar expand="lg" className="fixed-top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Jaya Abadi
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isLoggedIn ? (
            <>
              <Nav className="mx-auto">
                <Nav.Link as={NavLink} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/productPage">
                  Barang
                </Nav.Link>
                <NavDropdown title="Transaksi" id="basic-nav-dropdown">
                  <NavDropdown.Item as={NavLink} to="/barangMasuk">
                    Barang Masuk
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/barangKeluar">
                    Barang Keluar
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={NavLink} to="/service">
                  Service
                </Nav.Link>
                <NavDropdown title="Laporan" id="basic-nav-dropdown">
                  <NavDropdown.Item as={NavLink} to="/LapTM">
                    Laporan Barang Masuk
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/LapTK">
                    Laporan Barang Keluar
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/LapService">
                    Laporan Service
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={NavLink} to="/supplier">
                  Supplier
                </Nav.Link>
                <Nav.Link as={NavLink} to="/distributor">
                  Distributor
                </Nav.Link>
                <Nav.Link as={NavLink} to="/petugas">
                  Petugas
                </Nav.Link>
              </Nav>
              <div>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register">
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
