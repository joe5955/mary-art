import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, User, Package, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartQuery = trpc.cart.list.useQuery(undefined, { enabled: isAuthenticated });
  const cartCount = cartQuery.data?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About Mary" },
  ];

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[oklch(0.96_0.015_85/0.95)] backdrop-blur-sm border-b-2 border-[oklch(0.30_0.02_60)]">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-sketch text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Mary Wolford Art
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-typewriter text-sm tracking-wide transition-colors hover:text-[oklch(0.55_0.15_250)] ${
                  location === link.href ? "sketch-underline font-bold" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Cart + Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[oklch(0.55_0.15_250)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card">
                  <div className="px-3 py-2">
                    <p className="font-sketch text-sm font-semibold">{user?.name || "Artist Lover"}</p>
                    <p className="text-xs text-muted-foreground font-typewriter">{user?.email || ""}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4" />
                      <span className="font-typewriter text-sm">My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        <span className="font-typewriter text-sm">Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span className="font-typewriter text-sm">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="outline" size="sm" className="font-typewriter text-sm sketch-border bg-transparent hover:bg-secondary">
                  Sign In
                </Button>
              </a>
            )}

            {/* Mobile menu toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block font-typewriter text-sm py-2 ${
                  location === link.href ? "font-bold text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t-2 border-[oklch(0.30_0.02_60)] py-8 mt-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-sketch text-xl mb-3">Mary Wolford Art</h3>
              <p className="font-typewriter text-sm text-muted-foreground leading-relaxed">
                Original folk art designs on premium coffee cups. Each piece is a functional work of art.
              </p>
            </div>
            <div>
              <h4 className="font-sketch text-lg mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/shop" className="block font-typewriter text-sm text-muted-foreground hover:text-foreground">Shop All</Link>
                <Link href="/about" className="block font-typewriter text-sm text-muted-foreground hover:text-foreground">About the Artist</Link>
                <Link href="/orders" className="block font-typewriter text-sm text-muted-foreground hover:text-foreground">Track Order</Link>
              </div>
            </div>
            <div>
              <h4 className="font-sketch text-lg mb-3">Shipping & Returns</h4>
              <p className="font-typewriter text-sm text-muted-foreground leading-relaxed">
                All items are printed on demand and shipped within 3-7 business days. Ships to US, Canada, UK & Australia.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-border text-center">
            <p className="font-typewriter text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Mary Wolford Art. All artwork is original and protected by copyright.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
