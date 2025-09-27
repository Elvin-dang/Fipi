import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const Spinner = () => {
  return (
    <AnimatePresence>
      <motion.div
        key="logo"
        initial={{
          x: "-50%",
          y: "-50%",
          left: "50%",
          top: "50%",
          position: "fixed",
          zIndex: 50,
          opacity: 1,
          scale: 2,
        }}
        animate={{
          x: "-50%",
          y: "-50%",
          left: "50%",
          top: "50%",
          opacity: [1, 0.5, 1],
          transition: {
            opacity: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            },
          },
        }}
      >
        <Image src="/favicon-144x144.png" alt="FiPi_logo" width={35} height={35} priority />
      </motion.div>
    </AnimatePresence>
  );
};

export default Spinner;
