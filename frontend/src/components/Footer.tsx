import { Mail, MapPin, Instagram, Facebook, Phone } from 'lucide-react';
import whatsapp from "../assets/whatsapp.jpg"
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold"><span className="text-red-500">R</span>anjit Tamang</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Dedicated to serving the people of Nepal through progressive politics, 
              advocating for social justice, education, and healthcare reforms.
            </p>
            <div className="text-sm text-gray-400">
              Central Committee Member, CPN (Maoist Centre)
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/about" className="hover:text-red-500 transition-colors">About</a></li>
              <li><a href="/events" className="hover:text-red-500 transition-colors">Events</a></li>
              <li><a href="/news" className="hover:text-red-500 transition-colors">News & Interviews</a></li>
              <li><a href="/gallery" className="hover:text-red-500 transition-colors">Gallery</a></li>
              <li><a href="/journey" className="hover:text-red-500 transition-colors">Political Journey</a></li>
              <li><a href="/achievements" className="hover:text-red-500 transition-colors">Achievements</a></li>
              <li><a href="/contact" className="hover:text-red-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <span className="text-sm">Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-600" />
                <span className="text-sm">ranjitlama2039@gmail.com</span>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center space-x-2">
                <Instagram className="h-4 w-4 text-red-600" />
                <a href="https://www.instagram.com/_ranjittamang_?igsh=Y2w4bGJ4OHVyaXNj&utm_source=qr" className="text-sm" target='_blank'>Instagram</a>
              </div>
              <div className="flex items-center space-x-2">
                <Facebook className="h-4 w-4 text-red-600" />
                <a href="https://www.facebook.com/share/1CdNVLQUVS/?mibextid=wwXIfr" className="text-sm" target='_blank'>FaceBook</a>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4 text-red-600" />
                <a href="https://x.com/cmranjittamang?s=21" className="text-sm" target='_blank'>Twitter</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-600" />
                <a href="#" className="text-sm" target='_blank'>WhatsApp</a>
              </div>
              <img src={whatsapp} alt="WhatsApp" className="h-30 w-30 text-red-600" loading='lazy' />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Ranjit Tamang. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;