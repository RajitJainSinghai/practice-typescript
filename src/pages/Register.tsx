import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.email, data.password, data.name);
      toast.success('Registration successful!');

      // ✅ Redirect to the selected gym's booking page or default to '/gyms'
      const redirectPath = location.state?.from || '/gyms';
      navigate(redirectPath);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message); // ✅ Error ko dikhana
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Name"
            {...formRegister('name')}
            className="border border-gray-300 p-3 w-full rounded-lg"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...formRegister('email')}
            className="border border-gray-300 p-3 w-full rounded-lg"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            {...formRegister('password')}
            className="border border-gray-300 p-3 w-full rounded-lg"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            {...formRegister('confirmPassword')}
            className="border border-gray-300 p-3 w-full rounded-lg"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 w-full rounded-lg"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      {/* Login Option */}
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
