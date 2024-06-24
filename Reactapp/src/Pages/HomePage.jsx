import { Box } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckToken } from "../axios/api";
import { authenticate, logout } from "../Redux/AuthSlice/authSlice";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Type } from "../CommonComp/type";

const flyToChatbot = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
`;

// Define keyframes for fade-in animation
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Define a styled component
const GreetingMessage = styled.p`
  font-size: 42px;
  font-weight: 700;
  opacity: 0;
  animation: ${fadeIn} 2s ease-out forwards;
`;

const AnimatedSpan = styled.span`
  display: inline-block;
  animation: ${flyToChatbot} 2s forwards;
`;

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth.isAuthenticated);
  // const user = useSelector((state) => state.auth.user);
  const [currentStringIndex, setCurrentStringIndex] = useState(0);

  const words = useMemo(
    () => [
      "Hello Recruiters !!!",
      "A Product of Pozent .",
      "Where we made Recruitment Easy .",
      "Chatbot is ready to assist you .",
    ],
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (!token) {
      navigate("/login");
      return;
    }

    CheckToken()
      .then((res) => {
        if (res.status === "Success") {
          dispatch(authenticate({ user: res.data }));
        } else {
          dispatch(logout());
          navigate("/login");
        }
      })
      .catch((err) => {
        dispatch(logout());
        navigate("/login");
      });
  }, [dispatch, navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentStringIndex((prevIndex) =>
        prevIndex === words.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(intervalId);
  }, [words]);

  return auth ? (
    <>
      <Box
        sx={{
          display: "flex",
          alignContent: "center",
          justifyContent: "space-evenly",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "65%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            paddingLeft: "100px",
            paddingBottom: "130px",
          }}
        >
          <div>
            <GreetingMessage className="greeting-message">
              Welcome to Talent Harbour Hub!
              <br />
              <AnimatedSpan
                style={{
                  paddingTop: "15px",
                  color: "#68eb44",
                }}
              >
                {/* <Type text={words[currentStringIndex]} /> */}
                <Type text={words[currentStringIndex]} />
              </AnimatedSpan>
            </GreetingMessage>
          </div>
        </Box>
        <Box sx={{ width: "35%" }}>
          {/* HomePage - */}
          <b>{/* {user.email} Username: {user.username} Role:{user.role} */}</b>
        </Box>
      </Box>
    </>
  ) : (
    <Box></Box>
  );
};

export default HomePage;
