import { useState } from "react";
import {useNavigate} from "react-router";
import axios from "axios";

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formDate, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return null;
        }

        setErrors({});
        setLoading(true);

        try {
            const response = await axios.post(
                '/http://localhost:3000/api/v1/users/register',
                formData
            );
            console.log(response.data);
            setStatusMessage(response.ok ? 'User registered successfully' : 'Registration failed')
        } catch {
            setStatusMessage('Network error');
        } finally {
            setLoading(false);
        }
    }

    const validate = () => {
        let newErrors = {};
        if(!formData.username) newErrors.username = 'Username is required';
        if(!/^[^\s@]+@[\s@]+\.[\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
        if(!formData.fullName) newErrors.fullName = 'Full name is required';
        if(formData.password.length < 8) newErrors.password = 'Password must be at least 6 characters';
        return newErrors;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F4F9] p-4 relative">
              <div className="bg-[#062F47] w-full max-w-220 h-125 rounded-[40px] flex items-center justify-center shadow-2xl">
                
                <div className="bg-white w-full max-w-85 p-10 rounded-[30px] shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-[#062F47] mb-1">SyncScript</h2>
                  <p className="text-[10px] text-gray-400 mb-6 uppercase tracking-wider">
                    Create an account for effective research collaboration
                  </p>
        
                  {/* 4. Form Submission */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-700">USERNAME</label>
                      <Input 
                        type="text" 
                        name="username"
                        placeholder="john123" 
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.username && (
                        <p className="text-red-600 text-sm mt-2">{errors.username}</p>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-700">FULL NAME</label>
                      <Input 
                        type="text" 
                        name="fullName"
                        placeholder="E.g. Dr. Julian Vane" 
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.fullName && (
                        <p className="text-red-600 text-sm mt-2">{errors.fullName}</p>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-700">EMAIL</label>
                      <Input 
                        type="email" 
                        name="email"
                        placeholder="j.vane@university.edu" 
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.email && (
                        <p className="text-red-600 text-sm mt-2">{errors.email}</p>
                    )}
        
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-700">PASSWORD</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.password && (
                        <p className="text-red-600 text-sm mt-2">{errors.password}</p>
                    )}
        
                    <Button type="submit" disabled={loading} className="w-full mt-2 flex items-center justify-center gap-2">
                      {loading ? 'Creating...' : 'Create Account'} <span>→</span>
                    </Button>

                    {statusMessage && (
                        <p className="text-green-600" text-md>{statusMessage}</p>
                    )}
                  </form>
        
                  <p className="text-[11px] mt-4 text-gray-500">
                    Already have an account?{" "}
                    <button onClick={() => navigate('/login')} className="font-bold text-[#062F47] cursor-pointer hover:underline">
                      Log In here
                    </button>
                  </p>
                </div>
              </div>
            </div>
    )
}