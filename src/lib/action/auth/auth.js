// src/lib/action/auth/auth.js
"use server";
import axiosInstance from "@/lib/axiosInstance";

export const login = async ({ username, email, password }) => {
  try {

    const data = {
      "username": username,
      "email" : email,
      "password": password
    }
    
    console.log("Login successful:", data);
    const res = await axiosInstance.post("https://url.koyeb.app/login", data);
    

    return res.data;


  } catch (err) {
    console.error("Login error:", err);
    return {
      message: "Login failed",
      error: err,
    };
  }
};

export const signup = async ({ username, email, password }) => {
  try {
    const res = await axiosInstance.post("https://url.koyeb.app/signup", {
      username,
      email,
      password,
    });

    console.log("Signup successful:", res.data);
    return res.data;
  } catch (err) {
    console.error("Signup error:", err);
    return {
      message: "Signup failed",
      error: err,
    };
  }
};
