import { useEffect, useState } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/types';
import { signInWithGoogle, signOut, getCurrentUser } from '@/lib/auth/googleAuth';
import { useExtensionStore } from '@/store/useExtensionStore';

export default function LoginButton() {
  const { user, isAuthenticated, setUser, setAuthenticated } = useExtensionStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    getCurrentUser().then((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setAuthenticated(true);
      }
    });
  }, [setUser, setAuthenticated]);

  const handleLogin = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    
    if (result.success && result.user) {
      setUser(result.user);
      setAuthenticated(true);
    } else {
      console.error('[LoginButton] Login failed:', result.error);
      alert('Đăng nhập thất bại: ' + result.error);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setAuthenticated(false);
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2 px-2">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">{user.displayName}</span>
          <span className="text-[10px] text-muted-foreground">{user.email}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="h-6 w-6 p-0"
        >
          <LogOut className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogin}
      disabled={loading}
      className="gap-1 h-8 text-xs"
    >
      {loading ? (
        <span>Đang đăng nhập...</span>
      ) : (
        <>
          <LogIn className="w-3 h-3" />
          Đăng nhập
        </>
      )}
    </Button>
  );
}

