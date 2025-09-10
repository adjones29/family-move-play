import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, ArrowLeft, Chrome } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/(?=.*\d)/, 'Password must contain at least 1 number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'forgot-username';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp, resetPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const modeParam = searchParams.get('mode') as AuthMode;
    if (modeParam) {
      setMode(modeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', username: '', password: '', confirmPassword: '' },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    await signIn(values.email, values.password);
    setIsLoading(false);
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    await signUp(values.email, values.password, values.name, values.username);
    setIsLoading(false);
  };

  const handleForgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    await resetPassword(values.email);
    setIsLoading(false);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    setIsLoading(false);
  };

  const renderLogin = () => (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">FitFam</h1>
        <div className="flex justify-end">
          <button
            onClick={() => setMode('signup')}
            className="text-sm text-primary hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>

      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username or Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      placeholder="Enter your username or email"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'SIGNING IN...' : 'LOGIN'}
          </Button>
        </form>
      </Form>

      <div className="flex justify-between text-sm">
        <button
          onClick={() => setMode('forgot-password')}
          className="text-primary hover:underline"
        >
          Forgot Password?
        </button>
        <button
          onClick={() => setMode('forgot-username')}
          className="text-primary hover:underline"
        >
          Forgot Username?
        </button>
      </div>

      <div className="relative">
        <Separator className="my-6" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleGoogleAuth}
          disabled={isLoading}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
        <div className="flex justify-end">
          <button
            onClick={() => setMode('login')}
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>

      <Form {...signupForm}>
        <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
          <FormField
            control={signupForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={signupForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={signupForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      placeholder="Choose a username"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      type="password"
                      placeholder="Create a password"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <div className="text-xs text-muted-foreground">8+ chars, 1 number</div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={signupForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      type="password"
                      placeholder="Re-enter your password"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <Separator className="my-6" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleGoogleAuth}
          disabled={isLoading}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Sign up with Google
        </Button>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <button
            onClick={() => setMode('login')}
            className="text-sm text-primary hover:underline flex items-center"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Login
          </button>
        </div>
        
        <p className="text-center text-muted-foreground">
          Enter the email associated with your account and we'll send you a reset link.
        </p>
      </div>

      <Form {...forgotPasswordForm}>
        <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
          <FormField
            control={forgotPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'SENDING...' : 'Send Reset Link'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        If you signed up with Google or Apple, use those buttons on the Login page.
      </p>
    </div>
  );

  const renderForgotUsername = () => (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Recover Username</h1>
          <button
            onClick={() => setMode('login')}
            className="text-sm text-primary hover:underline flex items-center"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Login
          </button>
        </div>
        
        <p className="text-center text-muted-foreground">
          Enter the email associated with your account and we'll email your username.
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recovery-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="recovery-email"
              type="email"
              placeholder="Enter your email"
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          Send Username
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        If you used Google or Apple to sign up, your username may not be required to log in.
      </p>
    </div>
  );

  const renderContent = () => {
    switch (mode) {
      case 'login':
        return renderLogin();
      case 'signup':
        return renderSignup();
      case 'forgot-password':
        return renderForgotPassword();
      case 'forgot-username':
        return renderForgotUsername();
      default:
        return renderLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default Auth;