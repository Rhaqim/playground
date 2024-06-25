"use client";

import React, { useState, useReducer } from "react";

import { SignUp, SignIn } from "@/types/auth.type";
import { routes } from "@/service/api/routes";

const AuthPage = () => {
	const [active, setActive] = useState("login");
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-black">
			<div className="flex mb-8 space-x-4">
				<button
					className={`${
						active === "login" ? "bg-blue-500" : "bg-gray-700"
					} px-4 py-2 rounded transition duration-300 ease-in-out transform ${
						active === "login" ? "scale-110" : "scale-100"
					}`}
					onClick={() => setActive("login")}
				>
					Login
				</button>
				<button
					className={`${
						active === "signup" ? "bg-blue-500" : "bg-gray-700"
					} px-4 py-2 rounded transition duration-300 ease-in-out transform ${
						active === "signup" ? "scale-110" : "scale-100"
					}`}
					onClick={() => setActive("signup")}
				>
					Signup
				</button>
			</div>
			<div className="bg-gray-800 p-8 rounded shadow-lg w-80">
				{active === "login" ? <Login /> : <Signup />}
			</div>
		</div>
	);
};

export default AuthPage;

const Login = () => {
	const initialLoginState: SignIn = {
		email: "",
		password: "",
	};

	const [loginState, dispatch] = useReducer(
		(state: SignIn, action: Partial<SignIn>) => ({
			...state,
			...action,
		}),
		initialLoginState
	);

	const handleLogin = async () => {
		try {
			await routes.signin(loginState);
		} catch (error) {
			console.log(error);
		}
	};

	const handleGoogleLogin = async () => {
		try {
			await routes.googleLogin();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="space-y-4">
			<input
				type="text"
				placeholder="Email"
				value={loginState.email}
				onChange={e => dispatch({ email: e.target.value })}
				className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
			/>
			<input
				type="password"
				placeholder="Password"
				value={loginState.password}
				onChange={e => dispatch({ password: e.target.value })}
				className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
			/>
			<button
				onClick={handleLogin}
				className="w-full px-4 py-2 bg-blue-500 rounded text-white transition duration-300 ease-in-out transform hover:scale-105"
			>
				Login
			</button>
			<button
				onClick={handleGoogleLogin}
				className="w-full px-4 py-2 bg-red-500 rounded text-white transition duration-300 ease-in-out transform hover:scale-105"
			>
				Login with Google
			</button>
		</div>
	);
};

const Signup = () => {
	const initalSignupState: SignUp = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	};

	const [signupState, dispatch] = useReducer(
		(state: SignUp, action: Partial<SignUp>) => ({
			...state,
			...action,
		}),
		initalSignupState
	);

	const handleSignup = async () => {
		try {
			await routes.signup(signupState);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<input
				type="text"
				placeholder="First Name"
				value={signupState.firstName}
				onChange={e => dispatch({ firstName: e.target.value })}
				className="w-full px-4 my-2 py-2 rounded bg-gray-700 text-white focus:outline-none"
			/>
			<input
				type="text"
				placeholder="Last Name"
				value={signupState.lastName}
				onChange={e => dispatch({ lastName: e.target.value })}
				className="w-full px-4 my-2 py-2 rounded bg-gray-700 text-white focus:outline-none"
			/>
			<input
				type="text"
				placeholder="Email"
				value={signupState.email}
				onChange={e => dispatch({ email: e.target.value })}
				className="w-full px-4 my-2 py-2 rounded bg-gray-700 text-white focus:outline-none"
			/>
			<input
				type="password"
				placeholder="Password"
				value={signupState.password}
				onChange={e => dispatch({ password: e.target.value })}
				className="w-full px-4 my-2 py-2 rounded bg-gray-700 text-white focus:outline-none"
			/>
			<button
				onClick={handleSignup}
				className="w-full px-4 my-2 py-2 bg-blue-500 rounded text-white transition duration-300 ease-in-out transform hover:scale-105"
			>
				Signup
			</button>
			<button className="w-full px-4 my-2 py-2 bg-red-500 rounded text-white transition duration-300 ease-in-out transform hover:scale-105">
				Signup with Google
			</button>
		</div>
	);
};
