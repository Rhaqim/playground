'use client';

import React from "react";

import { ProtectedRoute } from "@/context/auth.context";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default Layout;
