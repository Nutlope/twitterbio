import Link from "next/link";
import React from "react";
import Layout from "../../components/layout";

const Dashboard = () => {
  return (
    <Layout>
      <div className="flex justify-center w-full min-h-screen">
        <div className="flex flex-col flex-1 bg-gray-800 sm:p-6 lg:flex-row lg:space-x-10">
          <div className="flex justify-between px-2 bg-gray-900 sm:rounded-xl lg:flex-col lg:px-4 lg:py-10">
            <nav className="flex flex-row items-center space-x-2 lg:flex-col ">
              <Link
                className="inline-flex justify-center p-4 rounded-md smooth-hover text-white/50 hover:bg-gray-800 hover:text-white"
                href="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:h-6 sm:w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </Link>

              <Link
                className="inline-flex justify-center p-4 text-white bg-gray-800 rounded-md"
                href="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:h-6 sm:w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </Link>
              <Link
                className="inline-flex justify-center p-4 rounded-md smooth-hover text-white/50 hover:bg-gray-800 hover:text-white"
                href="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:h-6 sm:w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Link>
            </nav>
            <div className="flex flex-row items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
              <Link
                className="inline-flex justify-center p-4 rounded-md smooth-hover text-white/50 hover:bg-gray-800 hover:text-white"
                href="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:h-6 sm:w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                className="inline-flex justify-center p-4 rounded-md smooth-hover text-white/50 hover:bg-gray-800 hover:text-white"
                href="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:h-6 sm:w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex-1 px-2 sm:px-0">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-extralight text-white/50">Dashboard</h3>
              <div className="inline-flex items-center space-x-2">
                <Link
                  className="p-2 bg-gray-900 rounded-md smooth-hover text-white/50 hover:text-white"
                  href="/"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </Link>
                <Link
                  className="p-2 bg-gray-900 rounded-md smooth-hover text-white/50 hover:text-white"
                  href="/"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-10 mb-10 sm:mb-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="relative flex flex-col items-center px-4 py-10 space-y-2 bg-gray-900 rounded-md cursor-pointer hover:smooth-hover group hover:bg-gray-900/80 sm:py-20">
                <img
                  className="object-cover object-center w-20 h-20 rounded-full"
                  src="https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="gaming"
                />
                <h4 className="text-2xl font-bold text-center text-white capitalize">
                  Hamza
                </h4>
                <p className="text-white/50">Authenticated</p>
                <p className="absolute inline-flex items-center text-xs top-2 text-white/20">
                   Online{" "}
                  <span className="block w-2 h-2 ml-2 bg-red-400 rounded-full group-hover:animate-pulse"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
