import Card from "../components/home/card";
import Layout from "../components/layout";
import { FADE_DOWN_ANIMATION_VARIANTS } from "../lib/constants";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const HomePage = ({ data }: any) => {
  return (
    <Layout>
      <div className="min-h-[67vh]">
        <motion.div
          className="max-w-xl px-5 xl:px-0"
          initial="hidden"
          whileInView="show"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.h1
            className="font-display bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-6xl md:leading-[5rem]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <Balancer>All Tools</Balancer>
          </motion.h1>
        </motion.div>
        {/* here we are animating with Tailwind instead of Framer Motion because Framer Motion messes up the z-index for child components */}
        <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
          {data?.map(
            ({ tool_id, tool_name, display_name, prompt, model }: any) => (
              <Card key={tool_id} displayName={display_name} slug={tool_name} />
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

export async function getStaticProps() {
  const data = await prisma.tool.findMany();

  return {
    props: {
      data,
    },
  };
}
