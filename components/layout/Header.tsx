"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { LogOut, Menu, Search, Shield, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function Header() {
  const { cart } = useCart();
  const { user, loading, logout } = useAuth();
  const { getSetting } = useSettings();
  const router = useRouter();
  const storeName = getSetting("storeName", "KIRU KARD");
  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
    router.push("/");
    router.refresh();
  };

  const isActivePath = (path: string) => pathname === path;

  const navItems: { href: string; label: string }[] = [];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          : "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8 lg:space-x-12">
            <Link
              className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
              href="/"
              aria-label={`${storeName} Home`}
            >
              KIRU<span className="text-primary">KARD</span>
            </Link>

            <nav
              className="hidden md:flex items-center space-x-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(href)
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  aria-current={isActivePath(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form
              className="relative w-full"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                aria-label="Buscar productos"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
              aria-label={`Carrito con ${cartCount} productos`}
            >
              <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {!loading && (
              <div className="hidden sm:flex items-center space-x-2">
                {user ? (
                  <>
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <Button variant="ghost" size="sm" className="text-sm gap-1.5">
                          <Shield className="h-4 w-4" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="max-w-[100px] truncate">{user.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm gap-1.5"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Salir
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="text-sm">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" variant="default" className="text-sm">
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {isSearchOpen && (
          <div className="lg:hidden mt-4 animate-in slide-in-from-top duration-200">
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setIsSearchOpen(false);
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                aria-label="Buscar productos"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>
        )}

        {isMobileOpen && (
          <nav
            className="md:hidden mt-4 animate-in slide-in-from-top duration-200"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-2 pb-4 border-b border-gray-200">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobileMenu}
                  className={`text-sm font-medium py-3 px-4 rounded-lg transition-all flex items-center gap-2 ${
                    isActivePath(href)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                  aria-current={isActivePath(href) ? "page" : undefined}
                >
                  <i className="fa-solid fa-layer-group" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col space-y-2 pt-4">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{user.name}</span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {user.role}
                        </span>
                      </div>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={closeMobileMenu}>
                          <Button variant="outline" className="w-full text-sm gap-1.5" asChild>
                            <span>
                              <Shield className="h-4 w-4" />
                              Panel Admin
                            </span>
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full text-sm gap-1.5 text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={closeMobileMenu}>
                        <Button variant="outline" className="w-full text-sm">
                          Iniciar Sesión
                        </Button>
                      </Link>
                      <Link href="/register" onClick={closeMobileMenu}>
                        <Button className="w-full text-sm" variant="default">
                          Registrarse
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
