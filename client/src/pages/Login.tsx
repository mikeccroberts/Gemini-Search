import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginForm {
    username: string;
    password: string;
}

export function Login() {
    const [, setLocation] = useLocation();
    const { setIsAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<LoginForm>({
        username: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Invalid credentials');
            }

            setIsAuthenticated(true);
            setLocation('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-8">
                    <Logo className="w-16 h-16 mb-6" />
                    <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-200">
                        Welcome Back
                    </h1>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Username"
                                value={form.username}
                                onChange={(e) => setForm(prev => ({
                                    ...prev,
                                    username: e.target.value
                                }))}
                                disabled={isLoading}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => setForm(prev => ({
                                    ...prev,
                                    password: e.target.value
                                }))}
                                disabled={isLoading}
                                className="h-11"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
