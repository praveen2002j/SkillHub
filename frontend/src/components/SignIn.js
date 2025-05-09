import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import GoogleAuth from "./googleAuth";
import { RiLoginBoxLine } from "react-icons/ri";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from 'lucide-react';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SignIn() {
  const Google_ = () => {
    window.open("http://localhost:5000/auth/google", "_self")
  }
  
  const [resData, setResData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [animationProgress, setAnimationProgress] = useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  async function postSignInInfoWithGoogle(inputData) {
    let datas = {
      email: inputData.user.email,
      password: "PAF2023@@",
    };
    const response = await axios({
      method: "post",
      url: "/api/v1/users/signin",
      data: datas
    });

///
    console.log("Login response:", response.data); // ✅ ADD HERE


    if (response.data !== null && response.data.status === "fail") {
      setSnackbarMessage(response.data.message);
      setSnackbarOpen(true);
    }

    if (response.data !== null && response.data.status === "success") {
      setResData(response.data);

      localStorage.setItem("psnUserId", response.data.payload.user.id);
      localStorage.setItem("psnUserFirstName", response.data.payload.user.firstName);
      localStorage.setItem("psnUserLastName", response.data.payload.user.lastName);
      localStorage.setItem("psnUserEmail", response.data.payload.user.email);
      localStorage.setItem("psnBio", response.data.payload.user.bio);
      localStorage.setItem("psnToken", response.data.payload.token);

      ////
      const userId = response.data.payload.user.id;
      const fullName = response.data.payload.user.firstName + ' ' + response.data.payload.user.lastName;
      localStorage.setItem('userId', userId);
      localStorage.setItem('fullName', fullName);
    


      navigate("/newsfeed");
    }
  }
  
  const handleAuth = (data) => {
    postSignInInfoWithGoogle(data)
  }
  
  let navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  async function postSignInInfo(inputData) {
    const response = await axios({
      method: "post",
      url: "/api/v1/users/signin",
      data: {
        email: inputData.email,
        password: inputData.password,
      },
    });

    if (response.data !== null && response.data.status === "fail") {
      setSnackbarMessage("Authentication failed");
      setSnackbarOpen(true);
    }

    if (response.data !== null && response.data.status === "success") {
      setResData(response.data);
      localStorage.setItem("psnUserId", response.data.payload.user.id);
      localStorage.setItem("psnUserFirstName", response.data.payload.user.firstName);
      localStorage.setItem("psnBio", response.data.payload.user.bio);
      localStorage.setItem("psnUserLastName", response.data.payload.user.lastName);
      localStorage.setItem("psnUserEmail", response.data.payload.user.email);
      localStorage.setItem("psnToken", response.data.payload.token);


      // ✅ Add these 2 lines:
      const userId = response.data.payload.user.id;
      const fullName = response.data.payload.user.firstName + ' ' + response.data.payload.user.lastName;
      localStorage.setItem('userId', userId);       // Used in MyLearningProgress
      localStorage.setItem('fullName', fullName);   // Optional for display

      navigate("/newsfeed");
    }
  }

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right,  #1e3a8a, #3b82f6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}>
          {/* Animated elements */}
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                backgroundColor: 'white',
                opacity: 0.08,
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${animationProgress / 100})`,
                transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: `${i * 0.05}s`
              }}
            />
          ))}
          
          {/* Decorative shapes */}
          {[...Array(5)].map((_, i) => (
            <div 
              key={`shape-${i}`}
              style={{
                position: 'absolute',
                borderRadius: '20%',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                width: `${Math.random() * 100 + 150}px`,
                height: `${Math.random() * 100 + 150}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg) scale(${animationProgress / 100})`,
                transition: 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: `${i * 0.1 + 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Logo and Title */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '2rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 1s, opacity 1s',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            marginRight: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <BookOpen size={32} style={{ color: '#3b82f6' }} />
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            margin: 0
          }}>SKILLHUB</h1>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.2s',
          padding: '2.5rem'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '0.5rem'
            }}>Welcome Back!</h2>
            <p style={{
              color: '#1e3a8a',
              fontSize: '1rem'
            }}>Sign in to continue your learning journey</p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {/* Google Auth button */}
            <div>
              <GoogleAuth handleAuth={handleAuth} />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1rem 0'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <div style={{ margin: '0 1rem', color: '#1e3a8a', fontSize: '0.875rem' }}>OR</div>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          <Formik
            validationSchema={schema}
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              postSignInInfo(values);
              setSubmitting(false);
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isInValid,
              errors,
            }) => (
              <Form
                noValidate
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <Row>
                  <Form.Group as={Col} md="12" controlId="signInEmail">
                    <Form.Label style={{ color: "#1e3a8a", fontWeight: '500', marginBottom: '0rem' }}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={touched.email && errors.email}
                      placeholder="Enter your email"
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        width: '100%'
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} md="12" controlId="signInPassword">
                    <Form.Label style={{ color: "#1e3a8a", fontWeight: '500' }}>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={touched.password && errors.password}
                      placeholder="Enter your password"
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        width: '100%'
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your password
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Button 
                  type="submit" 
                  style={{ 
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginTop: '0.5rem'
                  }}
                >
                  Sign In <RiLoginBoxLine />
                </Button>
                
                <div style={{ 
                  textAlign: "center", 
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <Link to='/signup' style={{ textDecoration: 'none' }}>
                    <Button style={{
                      background: '#059669',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1.5rem',
                      fontWeight: 'bold'
                    }}>
                      Create a New Account
                    </Button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignIn;
