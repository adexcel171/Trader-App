import { useGetCryptosQuery } from "../services/cryptoApi";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const Home = () => {
  const { data: cryptos, isLoading } = useGetCryptosQuery();
  const adminWhatsAppBase = "https://wa.me/2348119223162?text=";

  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView();

  // Trigger animation when in view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Available Crypto currencies
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptos?.map((crypto, index) => {
          const message = `Hello%2C%20I%20want%20to%20buy%20${encodeURIComponent(
            crypto.name
          )}%20at%20the%20rate%20of%20₦${crypto.rate}`;

          return (
            <motion.div
              key={crypto._id}
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 },
              }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 bg-gradient-to-br flex flex-col justify-center items-center from-blue-50 to-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <h3 className=" text-2xl font-extrabold text-gray-800">
                {crypto.name}
              </h3>
              <p className="text-gray-600 font-medium text-black mt-2">
                Rate: ₦ {crypto.rate}
              </p>

              <a
                href={adminWhatsAppBase + message}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4  w-full inline-block px-6 text-center py-3 bg-gradient-to-r from-green-500 to-gray-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                Buy Now
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
