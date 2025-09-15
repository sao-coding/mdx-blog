"use client";
import Link from "next/link";
import cx from "clsx";
import { motion } from "motion/react";

import AnimatedText from "@/components/animation/text";
import { SOCIAL_LINKS } from "@/config/menu";
import { ChevronDownIcon } from "lucide-react";

const Welcome = () => {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center md:w-1/2">
        <div className="flex flex-col gap-2">
          <div className="group flex flex-wrap">
            <AnimatedText
              text={["嗨，我是唯一👋。", "一個正在學習的"]}
              className="text-4xl font-black leading-loose"
            />

            <AnimatedText
              text={"<Developer />"}
              delay={1.5}
              el="code"
              className="mb-4 mr-1 self-end rounded-md px-1 text-3xl transition-colors duration-200 hover:bg-black/50"
            />
            <span className="relative bottom-4 inline-block h-8 w-[1px] self-end bg-gray-800/80 opacity-0 transition-opacity duration-200 group-hover:animate-blink group-hover:opacity-100 dark:bg-gray-200/80" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, -10, 0] }}
            transition={{ delay: 3 }}
            className=""
          >
            喜歡寫程式、看動漫😆
          </motion.div>
          <div className="mt-10 flex items-center gap-2">
            {SOCIAL_LINKS.map((social, index) => (
              <motion.div
                key={social.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [20, -10, 0] }}
                transition={{ delay: 3 + index * 0.2 }}
              >
                <Link href={social.link}>
                  <social.icon
                    className={cx(
                      "h-9 w-9 rounded-full stroke-2 p-1",
                      social.color
                    )}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-1/2 justify-center">
        <img
          className="rounded-full md:h-72 md:w-72"
          src="/img/avatar.jpg"
          alt=""
        />
      </div>
      <ChevronDownIcon className="absolute bottom-0 h-12 w-full animate-bounce stroke-2" />
    </>
  );
};

export default Welcome;
