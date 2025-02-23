"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mt-2 px-4 flex gap-2 justify-between items-center"
    >
      <Image src="/logo.png" alt="logo" width={70} height={35} priority />
      <div className="flex gap-4">
        <Link
          href="https://buymeacoffee.com/elvindang"
          target="_blank"
          className="hover:opacity-100 opacity-70"
        >
          <Image
            src="/assets/images/bmc-logo.svg"
            alt="bmc-logo"
            height={20}
            width={14}
            className="animate-wiggle hover:animate-none dark:hidden block"
          />
          <Image
            src="/assets/images/bmc-logo-dark.svg"
            alt="bmc-logo"
            height={20}
            width={14}
            className="animate-wiggle hover:animate-none dark:block hidden"
          />
        </Link>
        <Link
          href="https://github.com/Elvin-dang"
          target="_blank"
          className="hover:opacity-100 opacity-70"
        >
          <Image
            src="/assets/images/github.svg"
            alt="logo"
            width={20}
            height={20}
            className="dark:hidden block"
          />
          <Image
            src="/assets/images/github-dark.svg"
            alt="logo-dark"
            width={20}
            height={20}
            className="dark:block hidden"
          />
        </Link>
      </div>
    </motion.div>
  );
};

export default Footer;
