'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import BotaoPost from './BotaoPost';

interface DecodedToken {
  role?: string;
}

export default function RoleBasedBotaoPost() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Rotas onde o botão de postagem deve aparecer
  const allowedRoutes = ['/projects', '/diarioniceia'];
  
  // Verifica se a rota atual está entre as permitidas
  const shouldShowBotaoPost = allowedRoutes.includes(pathname);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          setUserRole(decoded.role || localStorage.getItem('role') || null);
        } catch {
          setUserRole(localStorage.getItem('role') || null);
        }
      } else {
        setUserRole(localStorage.getItem('role') || null);
      }
    };

    checkToken();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authToken' || event.key === 'role') {
        checkToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pathname]);

  return shouldShowBotaoPost && userRole === 'MEMBRO' ? <BotaoPost currentPath={pathname} /> : null;
}