import "@/styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* BRAND */}
        <div className="footer-brand">
          <h3>📸 PhotoRide</h3>
          <p>
            Book verified photographers for weddings, events, portraits,
            and commercial shoots — anytime, anywhere.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-section">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Refund Policy</a>
        </div>

        <div className="footer-section">
          <h4>For Creators</h4>
          <a href="#">Join as Photographer</a>
          <a href="#">Photographer Dashboard</a>
          <a href="#">Help Center</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} PhotoRide. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
