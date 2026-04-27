import { useState } from "react";
import { useNavigate } from "react-router";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../api/auth.api.js";
import { useAuth } from "../context/auth.context.js";

export default function Login() {
  const { setUser } = useAuth(); // for setting user after login
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setStatusMessage("");
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password.trim()
      });

      console.log("Login Success:", response.data);
      setStatusMessage("Login successful");
      setUser(response.data);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        setStatusMessage(err.response.data.message || "Login failed");
      } else {
        setStatusMessage("Server error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F4F9] p-4 relative">
      <div className="bg-[#062F47] w-full max-w-220 h-140 rounded-[40px] flex items-center justify-center shadow-2xl p-6">

        <div className="bg-white w-full max-w-100 max-h-130 px-6 py-8 rounded-[30px] shadow-lg text-center overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#062F47] mb-1">SyncScript</h2>
          <p className="text-[12px] text-gray-500 mb-4 uppercase">
            Return to your intellectual sanctuary.
          </p>

          {/* 4. Form Submission */}
          <form onSubmit={handleLogin} className="flex flex-col text-left gap-5">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">EMAIL</label>
              <Input
                type="email"
                name="email"
                placeholder="name@university.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {errors.email && (
              <p className="text-red-600 text-sm mb-4">{errors.email}</p>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">PASSWORD</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {errors.password && (
              <p className="text-red-600 text-sm mb-4">{errors.password}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2">
              {loading ? "Signing..." : "Sign In"}
            </Button>

            {statusMessage && (
              <p className={`text-sm rounded-lg px-4 py-3 mt-2 border ${statusMessage.includes("successful") ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"}`}>{statusMessage}</p>
            )}
          </form>

          <p className="text-[11px] mt-2 text-gray-500">
            New to SyncScript?{" "}
            <button onClick={() => navigate("/register")} className="font-bold text-[#062F47] cursor-pointer hover:underline">
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}