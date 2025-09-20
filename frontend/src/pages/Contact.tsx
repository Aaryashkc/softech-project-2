import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, Users, MessageSquare, Calendar } from 'lucide-react';
import { useContactStore } from '../stores/useContactStore';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { loading, error, success, sendContact, reset } = useContactStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendContact(formData);
    if (!error) {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">
              Connect with us to discuss Nepal's future, share your concerns, or get involved in our initiatives
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Office Location</h3>
              <p className="text-gray-600">
                CPN (Maoist Centre)<br />
                Central Committee Office<br />
                Kathmandu, Nepal
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Phone & Email</h3>
              <p className="text-gray-600">
                Email: ranjitlama2039@gmail.com<br />
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Office Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 5:00 PM<br />
                Saturday: 10:00 AM - 2:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form and Office Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Subject of your message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Please share your message, concerns, or questions..."
                  ></textarea>
                </div>

                {error && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">{error}</div>
                )}
                {success && (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-center">{success}</div>
                )}
                <button
                  type="submit"
                  className="w-full bg-red-700 text-white py-3 px-6 rounded-lg hover:bg-red-800 transition-colors duration-200 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Users className="h-6 w-6 text-red-700 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Public Engagement</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  We believe in open dialogue and community engagement. Your voice matters in shaping 
                  Nepal's political future.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Regular community meetings and forums</li>
                  <li>• Town halls for policy discussions</li>
                  <li>• Youth engagement sessions</li>
                  <li>• Grassroots consultation programs</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <MessageSquare className="h-6 w-6 text-red-700 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Response Time</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  We strive to respond to all inquiries promptly and thoroughly.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">General Inquiries</span>
                    <span className="text-red-700 font-medium">24-48 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">Meeting Requests</span>
                    <span className="text-red-700 font-medium">3-5 business days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">Media Inquiries</span>
                    <span className="text-red-700 font-medium">Same day</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Urgent Matters</span>
                    <span className="text-red-700 font-medium">Within 4 hours</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Calendar className="h-6 w-6 text-red-700 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Schedule a Meeting</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  For in-person meetings, interviews, or formal consultations, please specify 
                  your preferred dates and the nature of the discussion.
                </p>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <strong>Note:</strong> Due to high demand, meeting requests are prioritized based on 
                    urgency and alignment with current political initiatives and community needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {/* <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-xl text-gray-600">Located in the heart of Kathmandu</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 h-96 flex items-center justify-center">
          <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1766.3550826267417!2d85.33539336021757!3d27.695351544999617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a77520a339%3A0x4df14616bdef4f1c!2sSoftech%20Foundation!5e0!3m2!1sen!2snp!4v1750573220544!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                loading="lazy"
              ></iframe>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Contact;