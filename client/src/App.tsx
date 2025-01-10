import { Switch, Route, useLocation, Redirect } from "wouter";
import { Home } from "@/pages/Home";
import { Search } from "@/pages/Search";
import { Login } from "@/pages/Login";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

function AppRoutes() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Redirect to login if not authenticated and trying to access protected routes
  if (!isAuthenticated && location !== '/login') {
    setLocation('/login');
    return null;
  }

  // Redirect to home if authenticated and trying to access login
  if (isAuthenticated && location === '/login') {
    setLocation('/');
    return null;
  }

  // Check for valid routes
  const validRoutes = ['/', '/search', '/login'];
  if (isAuthenticated && !validRoutes.includes(location)) {
    return <NotFound />;
  }

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        {!isAuthenticated ? (
          <>
            <Route path="/login" component={Login} />
            <Route>
              <Redirect to="/login" />
            </Route>
          </>
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/search" component={Search} />
          </>
        )}
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
          <Button
            className="mt-4 w-full"
            onClick={() => setLocation('/')}
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;