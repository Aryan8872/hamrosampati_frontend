import { useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo/hamrosampati_logo.png";
import InputField from "../components/input-fields/InputField";
import { useAuth } from "../context/AuthContext";
import { signUpJoiSchema } from "../schemas/registerSchema";
import { RegisterDataType } from "../types/payloadType";




const TheSignUp = () => {
  const [formData, setFormData] = useState<RegisterDataType>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "USER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const { error } = signUpJoiSchema.extract(name).validate(value);
    setErrors(prev => ({
      ...prev,
      [name]: error ? error.details[0].message : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error: validationError } = signUpJoiSchema.validate(formData, { abortEarly: false });
    if (validationError) {
      const fieldErrors: Record<string, string> = {};
      validationError.details.forEach(detail => {
        const field = detail.path[0] as string;
        fieldErrors[field] = detail.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result?.success) {
        setTimeout(() =>
          toast.success('Registered successfully!', {
            position: "top-right",
            autoClose: 2000,
          }), 20)
      } else {
        setTimeout(() => toast.error(result?.error || "Registration failed"), 20)
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50  to-gray-100">
      <div className="container mx-auto px-4 py-2 md:py-12 ">

        <div className="flex flex-col md:flex-row rounded-2xl shadow-xl overflow-scroll bg-white max-w-6xl mx-auto">
          {/* Signup Form (Left) */}
          <div className="w-full md:w-1/2 order-1 md:order-1 px-6 py-9 sm:px-10 sm:py-9">
            <div className="max-w-md mx-auto">
              <div className="flex h-[20%]  w-full mb-3 justify-center">
                <img className="w-[20%] h-full object-cover" src={logo} />
              </div>

              <div className="w-full flex flex-col items-center text-center md:text-left">
                <h2 className="text-3xl font-ManropeBold text-gray-800 mb-2">Get Started Now</h2>
                <p className="text-gray-400 text-base font-ManropeRegular mb-8">Enter your credentials to get started</p>
              </div>

              <div className="flex mb-8 w-full rounded-xl bg-gray-100">
                <Link to="/login" className={`flex-1 text-center py-2 rounded-xl font-semibold transition-colors ${window.location.pathname === "/login" ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-blue-700"}`}>Sign In</Link>
                <Link to="/signup" className={`flex-1 text-center py-2 rounded-xl font-semibold transition-colors ${window.location.pathname === "/signup" ? "bg-white shadow" : "text-gray-500 hover:text-blue-700"}`}>Signup</Link>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-1 py-2 ">
        
                  <InputField
                    icon={<FaUser className="text-gray-400" />}
                    type="text"
                    name="fullName"
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.fullName}
                    styles="pl-10"
                  />
                </div>

                <div className="space-y-1">
          
                  <InputField
                    icon={<FaEnvelope className="text-gray-400" />}
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    styles="pl-10"
                  />
                </div>

                <div className="space-y-2 py-2">
          
                  <div className="relative">
                    <InputField
                      icon={<FaLock className="text-gray-400" />}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      label="Password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.password}
                      styles="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <IoEyeOff size={18} className="text-gray-400" />
                      ) : (
                        <IoEye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 py-2">
         
                  <InputField
                    icon={<FaPhone className="text-gray-400" />}
                    type="tel"
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="98XXXXXXXX"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.phoneNumber}
                    styles="pl-10"
                  />
                </div>

                <div className="py-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Hero Image Section (Right) */}
          <div className="hidden md:block md:w-1/2 order-2 md:order-2 relative bg-blue-600">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90 p-12 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-white mb-4">HamroSampati</h1>
              <p className="text-xl text-blue-100 mb-8">Your Gateway to Perfect Properties</p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/30">
                      <svg className="h-4 w-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-base text-blue-50">Access exclusive property listings</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/30">
                      <svg className="h-4 w-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-base text-blue-50">Save your favorite properties</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/30">
                      <svg className="h-4 w-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-base text-blue-50">Connect with trusted agents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheSignUp;