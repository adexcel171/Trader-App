import React from "react";
import "./portfolio.css";

const Portfolio = () => {
  const socialMediaLinks = [
    { name: "Twitter", url: "https://twitter.com", icon: "fab fa-twitter" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "fab fa-linkedin" },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: "fab fa-instagram",
    },
    { name: "Facebook", url: "https://facebook.com", icon: "fab fa-facebook" },
  ];

  const partnerLogos = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSndPZhEJoz4wSJk7gWJf4ou-HOTwsmc0kIm-UVil5UecJSWNlutcpf5nTFSQNzNdPLLXw&usqp=CAU",
    "data:image/png;base64,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",
    "https://www.shutterstock.com/image-vector/bitcoin-exchange-logo-design-abstract-260nw-1870360618.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOBUpwlbSKCEZZF8MKZ17ucO0IwmhGYnYR1A&s",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      {/* Navbar */}
      <nav className="p-6 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            {socialMediaLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-500 transition duration-300"
              >
                <i className={`${link.icon} text-2xl`}></i>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}

      {/* About Me Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <img
              src="https://www.freepik.com/free-photo/young-successful-confident-woman-with-glasses-holds-gold-bitcoin-her-hand-isolated-black-wall_14670310.htm#fromView=search&page=1&position=16&uuid=e040a72f-e226-4d42-9b61-a210cd238fe8&query=crypto+trader+girl"
              alt="Profile"
              className="rounded-lg shadow-lg w-full max-w-md"
            />
          </div>
          {/* About Me Content */}
          <div>
            <h3 className="text-3xl font-bold mb-6">About Me</h3>
            <p className="text-gray-400 mb-6">
              Hi, I'm [Her Name], the founder and CEO of Crypto Trading Co. With
              over a decade of experience in the financial markets, I have
              dedicated my career to mastering the art of trading and helping
              others achieve financial freedom through cryptocurrency.
            </p>
            <p className="text-gray-400 mb-6">
              My journey began in [Year] when I first discovered the potential
              of blockchain technology. Since then, I have built a successful
              trading company that partners with some of the most reputable
              names in the industry. My mission is to empower individuals to
              take control of their financial future through education and
              innovative trading strategies.
            </p>
            <blockquote className="border-l-4 border-purple-500 pl-4 text-gray-400 italic">
              "The stock market is a device for transferring money from the
              impatient to the patient." – Warren Buffett
            </blockquote>
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">Our Partners</h3>
          <div className="overflow-hidden space-x-5 whitespace-nowrap">
            <div className="animate-scroll inline-block">
              {partnerLogos.map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt={`Partner ${index + 1}`}
                  className="inline-block mx-8 h-20 w-auto"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 border-t border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Crypto Trading Co. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
