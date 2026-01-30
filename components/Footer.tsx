"use client";

import "@/styles/footer.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert("Thank you for subscribing!");
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* BRAND */}
          <div className="footer-brand">
            <Image
              src="/photoridelogo.png"
              alt="PhotoRide Logo"
              width={40}
              height={40}
              className="logo-img"
              priority
            />
            <h3>
              <span>PhotoRide</span>
            </h3>
            <p>
              Book verified photographers for weddings, events, portraits, and
              commercial shoots — anytime, anywhere. Professional quality,
              seamless experience.
            </p>
          </div>

          {/* LINKS */}
          <div className="footer-section">
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/press">Press</Link>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/refund">Refund Policy</Link>
            <Link href="/cookies">Cookie Policy</Link>
            <Link href="/security">Security</Link>
          </div>

          <div className="footer-section">
            <h4>For Creators</h4>
            <Link href="/join">Join as Photographer</Link>
            <Link href="/dashboard">Photographer Dashboard</Link>
            <Link href="/help">Help Center</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/community">Community</Link>
          </div>

          {/* NEWSLETTER */}
          <div className="newsletter">
            <h5>Stay Updated</h5>
            <p>Get photography tips and exclusive offers in your inbox.</p>
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Your email address"
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          {/* SOCIAL & BOTTOM */}
          <div className="footer-social">
            <div className="social-links">
              <a href="https://twitter.com/photoride" className="social-link" aria-label="Twitter">
                <span>𝕏</span>
              </a>
              <a href="https://instagram.com/photoride" className="social-link" aria-label="Instagram">
                <span>📷</span>
              </a>
              <a href="https://linkedin.com/company/photoride" className="social-link" aria-label="LinkedIn">
                <span>in</span>
              </a>
              <a href="https://youtube.com/photoride" className="social-link" aria-label="YouTube">
                <span>▶️</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PhotoRide. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/sitemap">Sitemap</Link>
            <Link href="/accessibility">Accessibility</Link>
            <Link href="/legal">Legal</Link>
            <Link href="/status">System Status</Link>
          </div>
        </div>
      </footer>

      <button 
        className={`scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </>
  );
}