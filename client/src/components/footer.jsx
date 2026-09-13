import React from "react";
import { Link } from "react-router-dom";
import icon from "../assets/icon.png";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-400 py-10 px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <img src={icon} className="h-17 ml-2"/>
          <p className="text-xs text-gray-400 leading-relaxed">
            Great food, better mood. Delivered to you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/restaurants" className="hover:text-white transition-colors">
                Restaurants
              </Link>
            </li>
            <li>
              <Link to="/offers" className="hover:text-white transition-colors">
                Offers
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Help</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Follow Us</h4>
          <div className="flex gap-3 text-sm">
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700 text-white">
              📷
            </span>
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700 text-white">
              👍
            </span>
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700 text-white">
              🐦
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}