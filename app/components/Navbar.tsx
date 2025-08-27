import React from "react";
import Head from "next/head";
import Image from "next/image";

const Navbar = () => {
  return (
    <>
      <Head>
        <title>Agilance AI</title>
        <meta
          name="description"
          content="AI-powered chest pain assessment tool"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="">
        {/* <!-- Hero Section --> */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* <!-- Logo --> */}
              <div className="flex-shrink-0">
                <Image src="/logo.png" alt="Logo" width="250" height="70" />
              </div>

              {/* <!-- Nav Links --> */}
              <nav className="hidden md:flex space-x-8">
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-blue-600"
                >
                  How It Works
                </a>
                <a href="#learn" className="text-gray-700 hover:text-blue-600">
                  Learn
                </a>
                <a
                  href="#doctors"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Talk to a Doctor
                </a>
                <a
                  href="#dashboard"
                  className="text-gray-700 hover:text-blue-600"
                >
                  My Appointments
                </a>
                <a
                  href="#doctors"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Assessment
                </a>
              </nav>

              {/* <!-- Login/Signup --> */}
              <div className="hidden md:flex space-x-4">
                <a
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Navbar;
