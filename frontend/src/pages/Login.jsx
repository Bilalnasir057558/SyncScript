import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import API from "../api/axios";

export default function Login() {
  // 1. State for input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2. State for error messages
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on submit
    setError(""); // Clear previous errors

    // 3. Validation Logic
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail && !trimmedPassword) {
      setError("Email and Password cannot be empty.");
      setEmail("");
      setPassword("");
      return;
    }
    else if (!trimmedPassword) {
      setError("Password cannot be empty.");
      setPassword("");
      setEmail("");
      return;
    }
    else if (!trimmedEmail) {
      setError("Email cannot be empty.");
      setPassword("");
      setEmail("");
      return;
    }

    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setPassword("");
      return;
    }

    try {
      const response = await API.post("/login", {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      console.log("Login Success:", response.data);

      // Example: redirect or store user
      alert("Login successful!");

    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Server error. Try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F4F9] p-4 relative">
      <div className="bg-[#062F47] w-full max-w-[900px] h-[500px] rounded-[40px] flex items-center justify-center shadow-2xl">

        <div className="bg-white w-full max-w-[340px] p-10 rounded-[30px] shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#062F47] mb-1">SyncScript</h2>
          <p className="text-[10px] text-gray-400 mb-6 uppercase tracking-wider">
            Return to your intellectual sanctuary.
          </p>

          {/* 4. Form Submission */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* 5. Error Message Display */}
            {error && (
              <p className="text-red-500 text-[11px] font-medium mt-1">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-2 flex items-center justify-center gap-2">
              Sign In <span>→</span>
            </Button>
          </form>

          <p className="text-[11px] mt-4 text-gray-500">
            New to SyncScript?{" "}
            <span className="font-bold text-[#062F47] cursor-pointer hover:underline">
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}