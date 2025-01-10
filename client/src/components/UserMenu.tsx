import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

export function UserMenu() {
    const { logout } = useAuth();
    const [location] = useLocation();

    // Don't render anything on search page
    if (location.startsWith('/search')) {
        return null;
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Logout"
        >
            <LogOut className="h-5 w-5" />
        </Button>
    );
}