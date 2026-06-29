import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

import bgImage from '@/assets/images/BGImg.jpg';
import { TextField } from '@/components/controls/text-field';
import { AppButton } from '@/components/controls/app-button';
import { AppAlert } from '@/components/controls/app-alert';
import { loginSchema, LoginRequest } from '@/types/auth';
import { useLogin } from '@/hooks/api/authAPIHooks';

/**
 * Authentication Login Page
 * Features a split layout with a background image and glassmorphism form.
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    control,
    handleSubmit,
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginRequest) => {
    login(data, {
      onSuccess: () => {
        // Redirect to dashboard on success
        navigate('/dashboard');
      },
    });
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content Container */}
      <div className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left Side: Branding (Desktop Only) */}
        <div className="hidden flex-col justify-center px-12 md:flex">
          <div className="max-w-md">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white lg:text-6xl">
              Evo<span className="text-[#FFBF00]">ria</span>
            </h1>
            <p className="text-xl text-gray-300"> 
              Welcome back! Manage your events, attendees, and analytics with the
              most powerful ticketing platform.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-background/30 p-8 shadow-xl backdrop-blur-md">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">Sign In</h2>
              <p className="mt-2 text-gray-300">Enter your credentials to access your account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <AppAlert
                variant="error"
                message={error instanceof Error ? error.message : 'Invalid email or password. Please try again.'}
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="email"
                    label="Email"
                    placeholder="Enter Your Email"
                    prefixIcon={Mail}
                    error={fieldState.error?.message ?? ""}
                    disabled={isPending}
                    className="bg-white/10 text-white placeholder:text-gray-400 focus:ring-2 focus-visible:ring-[#FFBF00]/30 focus:border-transparent"
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Password"
                    placeholder="Enter Your Password"
                    prefixIcon={Lock}
                    error={fieldState.error?.message ?? ""}
                    disabled={isPending}
                    className="bg-white/10 text-white placeholder:text-gray-400 focus:ring-2 focus-visible:ring-[#FFBF00]/30 focus:border-transparent"
                  />
                )}
              />

              <AppButton
                type="submit"
                className="w-full cursor-pointer bg-[#FFBF00] text-[#0A2463] py-6 text-lg font-bold uppercase tracking-wide"
                isLoading={isPending}
              >
                Sign In
              </AppButton>
           
            </form>

            <div className="mt-8 flex items-center justify-between">
              <AppButton variant="link" className="px-0 cursor-pointer text-sm text-gray-300 hover:text-[#FFBF00]">
                Forgot Password?
              </AppButton>
              <AppButton variant="link" className="px-0 cursor-pointer text-sm text-gray-300 hover:text-[#FFBF00]">
                Reset Password
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
