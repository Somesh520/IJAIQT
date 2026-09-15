"use client";
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  BookOpen,
  Library,
  Newspaper,
  GraduationCap
} from "lucide-react";
import { FooterBackgroundGradient } from "@/components/ui/hover-footer";
import { TextHoverEffect } from "@/components/ui/hover-footer";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { settingsAPI } = await import('@/lib/api');
        const res = await settingsAPI.get();
        if (res.data) {
          setSettings(res.data);
        }
      } catch (e) {
        console.error("Failed to fetch settings for footer", e);
      }
    };
    fetchSettings();
    window.addEventListener('settingsUpdated', fetchSettings);
    return () => window.removeEventListener('settingsUpdated', fetchSettings);
  }, []);

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return null;
  }

  // Footer link data
  const footerLinks = [
    {
      title: "About Us",
      links: [
        { label: "Company History", href: "#" },
        { label: "Meet the Team", href: "#" },
        { label: "Employee Handbook", href: "#" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Helpful Links",
      links: [
        { label: "FAQs", href: "#" },
        { label: "Support", href: "#" },
        {
          label: "Live Chat",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#3ca2fa]" />,
      text: "hello@kiet.edu",
      href: "mailto:hello@kiet.edu",
    },
    {
      icon: <Phone size={18} className="text-[#3ca2fa]" />,
      text: "+91 86373 73116",
      href: "tel:+918637373116",
    },
    {
      icon: <MapPin size={18} className="text-[#3ca2fa]" />,
      text: "Ghaziabad, India",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <Globe size={20} />, label: "Website", href: "#" },
    { icon: <BookOpen size={20} />, label: "Publications", href: "#" },
    { icon: <Library size={20} />, label: "Library", href: "#" },
    { icon: <Newspaper size={20} />, label: "News", href: "#" },
    { icon: <GraduationCap size={20} />, label: "Academics", href: "#" },
  ];

  return (
    <footer id="global-footer" className="bg-slate-900 border-t border-slate-200 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div 
          className="text-sm leading-relaxed prose prose-invert max-w-none text-center [&_img]:max-h-24 [&_img]:w-auto [&_img]:inline-block [&_img]:mx-2 [&_p]:my-2"
          dangerouslySetInnerHTML={{ __html: settings?.footerText || "<p>Krishna Institute of Engineering and Technology, Ghaziabad - Publishing high-quality academic research.</p>" }}
        />
      </div>
    </footer>
  );
}
