'use client';

import React from "react";

import { withAuth } from "@/context/auth.context";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return <div>{children}</div>;
};

export default withAuth(Layout);
