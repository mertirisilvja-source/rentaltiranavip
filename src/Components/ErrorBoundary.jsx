import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-black px-4 text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-gray-500 dark:text-white/60">An unexpected error occurred. Please try again.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = "/";
            }}
            className="mt-6 rounded-xl bg-[#caa24a] px-6 py-3 font-semibold text-black hover:brightness-110"
          >
            Go to Homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
