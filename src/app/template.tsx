"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Header from "./_components/Header";
import Link from "next/link";
import { useGlobalStore } from "@/providers/globalStateProvider";

export default function Template({ children }: { children: React.ReactNode }) {
  const [shouldRemoveLogo, setShouldRemoveLogo] = useState(false);
  const shouldAnimated = useGlobalStore((state) => state.shouldAnimateLogo);
  const setAnimateLogo = useGlobalStore((state) => state.setAnimateLogo);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      className="h-full"
    >
      <div className="h-full flex flex-col relative">
        <Header />
        {shouldAnimated && (
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
                scale: 1.5,
              }}
              animate={
                shouldRemoveLogo
                  ? {
                      name: "hide",
                      x: 0,
                      y: 0,
                      left: "32px",
                      top: "calc(100dvh - 51px)",
                      transition: {
                        duration: 1,
                        ease: "easeInOut",
                      },
                      opacity: 0,
                      scale: 1,
                    }
                  : {
                      name: "show",
                      x: 0,
                      y: 0,
                      left: "32px",
                      top: "calc(100dvh - 51px)",
                      transition: {
                        duration: 0.8,
                        ease: "easeInOut",
                      },
                      opacity: 1,
                      scale: 1,
                    }
              }
              onAnimationComplete={(definition: { name: string }) => {
                if (definition.name === "show") {
                  setShouldRemoveLogo(true);
                } else if (definition.name === "hide") {
                  setAnimateLogo(false);
                }
              }}
            >
              <Image src="/favicon-144x144.png" alt="FiPi_logo" width={35} height={35} priority />
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence>
          <motion.main
            className="flex-1 py-4 px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: shouldAnimated ? 0.5 : 0 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <motion.footer
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5, delay: shouldAnimated ? 0.8 : 0 }}
          className="py-4 px-8 flex gap-2 justify-between items-center"
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
              href="https://github.com/Elvin-dang/Fipi"
              target="_blank"
              className="hover:opacity-100 opacity-70"
            >
              <Image
                src="/assets/images/github.svg"
                alt="logo"
                width={20}
                height={20}
                className="dark:hidden block"
                priority
              />
              <Image
                src="/assets/images/github-dark.svg"
                alt="logo-dark"
                width={20}
                height={20}
                className="dark:block hidden"
                priority
              />
            </Link>
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
}
