"use client";

import { useSettings } from "@/context/SettingsContext";
import {
  ArrowRight,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { getSetting } = useSettings();

  const storeName = getSetting("storeName", "KIRU KARD");
  const storeAddress = getSetting("storeAddress", "Ciudad de México, México");
  const storePhone = getSetting("storePhone", "+52 (55) 1234-5678");
  const storeEmail = getSetting("storeEmail", "contacto@kirukard.com");
  const socialFacebook = getSetting("socialFacebook", "#");
  const socialInstagram = getSetting("socialInstagram", "#");
  const socialTwitter = getSetting("socialTwitter", "#");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter subscription:", email);
      setEmail("");
    }
  };

  const footerSections = [
    {
      title: "Shop",
      links: [
        { href: "/", label: "All Products" },
        { href: "/", label: "New Arrivals" },
        { href: "/", label: "Sale" },
        { href: "/", label: "Featured" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/contact", label: "Help Center" },
        { href: "/contact", label: "Shipping Info" },
        { href: "/contact", label: "Returns & Exchanges" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/", label: "About Us" },
        { href: "/", label: "Careers" },
        { href: "/", label: "Blog" },
        { href: "/", label: "Press" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/contact", label: "Privacy Policy" },
        { href: "/contact", label: "Terms & Conditions" },
        { href: "/contact", label: "Cookie Policy" },
        { href: "/contact", label: "Accessibility" },
      ],
    },
  ];

  const socialLinks = [
    { href: socialFacebook, icon: Facebook, label: "Facebook" },
    { href: socialTwitter, icon: Twitter, label: "Twitter" },
    { href: socialInstagram, icon: Instagram, label: "Instagram" },
    { href: "#", icon: Github, label: "GitHub" },
  ];

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 border-b border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay in the loop
            </h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for exclusive offers, new arrivals,
              and style inspiration.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex max-w-md mx-auto gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </div>
        </div>

        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            <div className="lg:col-span-2">
              <Link
                className="text-2xl tracking-tight text-white hover:text-gray-300 transition-colors"
                href="/"
                aria-label={`${storeName} Home`}
              >
                KIRU<span className="text-primary">KARD</span>
              </Link>
              <p className="text-gray-400 mb-6 max-w-sm">
                Descubre cartas coleccionables, sobres booster y productos TCG
                de calidad. Envío rápido a todo el país.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{storeAddress}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{storePhone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{storeEmail}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-10 w-10 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Link href={href} aria-label={label}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {footerSections.map((section, index) => (
              <div
                key={section.title}
                className={`${index >= 2 ? "lg:col-span-1" : ""}`}
              >
                <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© 2025 KIRU KARD™.</span>
              <br />
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
