import axios from "axios";
import React, { useState } from "react";
import { Navbar, Container, Nav, Button, Modal, Form } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./nav.css";

const MyNav = ({ currentUser, setCurrentUser, storage }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = () => {
    storage.clear();
    setCurrentUser(null);
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">
          Pin it <FaMapMarkerAlt style={{ color: "red", marginTop: "-3px" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {currentUser ? (
              <>
                <h3
                  className="text-warning mx-4"
                  style={{
                    fontSize: "1.3rem",
                    marginBottom: "0",
                    marginTop: "6px",
                  }}
                >
                  Welcome, {currentUser}
                </h3>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" onClick={() => setShowLogin(true)}>
                  Login
                </Button>
                <Button variant="success" onClick={() => setShowRegister(true)}>
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        <Register show={showRegister} onHide={() => setShowRegister(false)} />
        <Login
          show={showLogin}
          onHide={() => setShowLogin(false)}
          setCurrentUser={setCurrentUser}
          storage={storage}
        />
      </Container>
    </Navbar>
  );
};

function Register(props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clear = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/signup", formData);
      console.log(res);
      clear();
      setRegisterError(false);
      setRegisterSuccess(true);
    } catch (error) {
      console.log(error);
      setRegisterSuccess(false);
      setRegisterError(true);
    }
  };
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create an account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Your Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="User name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {registerSuccess && (
          <p className="text-success">
            Account created successfully. Please login to continue.
          </p>
        )}
        {registerError && (
          <p className="text-danger">Something went wrong. Please try again.</p>
        )}
      </Modal.Body>
    </Modal>
  );
}

function Login(props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/user/signin", formData);
      props.storage.setItem("user", data.result.name);
      props.setCurrentUser(data.result.name);
      props.onHide();
    } catch (error) {
      console.log(error);
      setLoginError(true);
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {loginError && (
          <p className="text-danger my-2">Invalid email or password</p>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default MyNav;
