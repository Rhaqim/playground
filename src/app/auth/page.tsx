"use client";

import React, { useState, useReducer } from "react";

import { SignUp, SignIn, Roles } from "@/types/auth.type";
import { useAuth } from "@/context/auth.context";

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
	const { signIn, signinGoogle } = useAuth();

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
		await signIn(loginState);
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
			{/* <button
				onClick={signinGoogle}
				className="w-full px-4 py-2 bg-red-500 rounded text-white transition duration-300 ease-in-out transform hover:scale-105"
			>
				Login with Google
			</button> */}
		</div>
	);
};

const Signup = () => {
	const { signUp, signupReferral } = useAuth();

	const [referralCode, setReferralCode] = useState("");

	const initalSignupState: SignUp = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		role: Roles.USER,
	};

	const [signupState, dispatch] = useReducer(
		(state: SignUp, action: Partial<SignUp>) => ({
			...state,
			...action,
		}),
		initalSignupState
	);

	const handleSignup = async () => {
		await signUp(signupState);
	};

	const handleSignupReferral = async () => {
		await signupReferral({ user: signupState, referral_code: referralCode });
	};

	return (
		<div>
			<input
				type="text"
				placeholder="First Name"
				value={signupState.first_name}
				onChange={e => dispatch({ first_name: e.target.value })}
				className="w-full px-4 my-2 py-2 rounded bg-gray-700 text-white focus:outline-none"
			/>
			<input
				type="text"
				placeholder="Last Name"
				value={signupState.last_name}
				onChange={e => dispatch({ last_name: e.target.value })}
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
			<input
				type="text"
				placeholder="Referral Code"
				value={referralCode}
				onChange={e => setReferralCode(e.target.value)}
				className="w-full px-4 my-2 py-2 rounded bg-gray-700 text-white focus:outline-none"
				required
			/>
			<button
				onClick={handleSignupReferral}
				className="w-full px-4 my-2 py-2 bg-blue-500 rounded text-white transition duration-300 ease-in-out transform hover:scale-105"
			>
				Signup
			</button>
			{/* <button className="w-full px-4 my-2 py-2 bg-red-500 rounded text-white transition duration-300 ease-in-out transform hover:scale-105">
				Signup with Google
			</button> */}
		</div>
	);
};
