import { Link } from "react-router-dom";

export function CinematicFooter() {
  return (
    <footer className="w-full bg-[#080808] py-16 px-6 md:px-12 font-mono text-xs">
      <div className="max-w-[1440px] mx-auto">
        {/* Top 5-Pillar Column Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-16 hairline-b">
          <div>
            <span className="text-white font-semibold text-sm tracking-wider uppercase block mb-3">
              CIVICSENSE
            </span>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              Autonomous civic grievance redressal and municipal operations intelligence system.
            </p>
          </div>

          <div>
            <span className="text-[#A1A1AA] uppercase tracking-widest text-[10px] block mb-3">
              CITIZEN
            </span>
            <ul className="space-y-2 text-[#71717A] text-[11px]">
              <li>
                <a href="#report" className="hover:text-white transition-colors">
                  Report Incident
                </a>
              </li>
              <li>
                <a href="#track" className="hover:text-white transition-colors">
                  Phone OTP Tracker
                </a>
              </li>
              <li>
                <Link to="/volunteer" className="hover:text-white transition-colors">
                  Volunteer Ward
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[#A1A1AA] uppercase tracking-widest text-[10px] block mb-3">
              AI ENGINE
            </span>
            <ul className="space-y-2 text-[#71717A] text-[11px]">
              <li>
                <a href="#ai-engine" className="hover:text-white transition-colors">
                  Scikit-Learn TF-IDF
                </a>
              </li>
              <li>
                <span className="text-[#52525B]">Heuristic Overrides</span>
              </li>
              <li>
                <span className="text-[#52525B]">4 Priority Tiers</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[#A1A1AA] uppercase tracking-widest text-[10px] block mb-3">
              CITY RADAR
            </span>
            <ul className="space-y-2 text-[#71717A] text-[11px]">
              <li>
                <a href="#map" className="hover:text-white transition-colors">
                  Command Map
                </a>
              </li>
              <li>
                <a href="#field" className="hover:text-white transition-colors">
                  Live Sensor Field
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-white transition-colors">
                  Impact Metrics
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[#A1A1AA] uppercase tracking-widest text-[10px] block mb-3">
              MUNICIPAL ACTION
            </span>
            <ul className="space-y-2 text-[#71717A] text-[11px]">
              <li>
                <a
                  href="https://admin-dashboard-six-nu-90.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#818CF8] hover:underline"
                >
                  Admin Portal ↗
                </a>
              </li>
              <li>
                <Link to="/programs" className="hover:text-white transition-colors">
                  Civic Programs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Press & Articles
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#71717A] text-[11px]">
          <div>© CIVICSENSE · ALL RIGHTS RESERVED</div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/mohammadfahadsiddiqui/CivicSense"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GITHUB
            </a>
            <Link to="/privacy" className="hover:text-white transition-colors">
              PRIVACY
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              ACCESSIBILITY
            </Link>
            <span className="text-[#818CF8]">SYS VER: 2026.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
