import { motion } from "framer-motion";
import { FaFacebookF, FaPhoneAlt } from "react-icons/fa";
import zaloLogo from "../assets/Icon_of_Zalo.svg.webp";

export default function FloatingSocialButtons() {
  const socialLinks = [
    {
      id: "facebook",
      icon: <FaFacebookF size={22} />,
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      link: "https://www.facebook.com/profile.php?id=61582173127418",
    },
    {
      id: "zalo",
      icon: (
        <img src={zaloLogo} alt="Zalo" className="w-10 h-10 object-contain" />
      ),
      bg: "bg-cyan-500",
      hover: "hover:bg-cyan-600",
      link: "https://zalo.me/0772578556",
    },
    {
      id: "phone",
      icon: <FaPhoneAlt size={22} />,
      bg: "bg-green-500",
      hover: "hover:bg-green-600",
      link: "tel:0772578556",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      {socialLinks.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: index * 0.2,
          }}
          className="relative"
        >
          {/* Nút chính */}
          <motion.button
            onClick={() => window.open(item.link, "_blank")}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className={`${item.bg} ${item.hover} cursor-pointer text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-black/20 transition-all`}
          >
            {item.icon}
          </motion.button>

          {/* Hiệu ứng pulse */}
          <motion.span
            className={`absolute inset-0 rounded-full ${item.bg} opacity-40 pointer-events-none`}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.span>

          {/* Hiệu ứng nhấp nhô */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
