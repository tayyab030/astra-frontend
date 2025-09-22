"use client";

import dynamic from "next/dynamic";
import type React from "react";

import { useState } from "react";

const SignupForm = dynamic(() => import("./SignupForm"));

export default function SignupPage() {
    return <SignupForm />;
}
