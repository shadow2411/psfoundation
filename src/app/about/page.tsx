"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  UtensilsCrossed,
  Home,
  Activity,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-blue-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4 h-full flex items-center"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Purushottam Sevashram Foundation
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Dedicated to supporting our community through essential services
                for well-being, connection, and care.
              </p>
              <Link href="/about">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900">
                Learn More
              </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hidden md:block"
            >
              <Image
                src="/image1.jpg"
                alt="Seniors enjoying community activities"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
              Our Story
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.2}>
              <Image
                src="/image2.jpg"
                alt="Our journey"
                width={800}
                height={400}
                className="rounded-lg"
              />
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <div className="space-y-6">
                <p className="text-gray-600">
                  Founded in 2024, our organization is dedicated to supporting
                  our community by providing essential services for well-being,
                  connection, and care. We started with a simple mission: to
                  make nutritious, home-style meals accessible to everyone
                  through our tiffin service.
                </p>
                <p className="text-gray-600">
                  With a focus on quality ingredients and a touch of warmth, our
                  tiffin service is designed to bring the comfort of a wholesome
                  meal to all—whether busy professionals, students, or senior
                  citizens who prefer nutritious meals at their doorstep.
                </p>
                
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>



      {/* Our Vision Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12">Our Vision</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <p>
                  As we grow, we are expanding our vision to create a welcoming
                  space for seniors. Currently under construction, our upcoming
                  facility will include an old age home, complete with
                  healthcare support and a range of recreational activities
                  designed to nurture both body and spirit.
                </p>
                <p>
                  This new space will be a sanctuary where seniors can enjoy
                  their golden years in the company of others, with
                  compassionate care and enriching experiences that promote
                  dignity, joy, and a true sense of belonging.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <Image
                src="/image3.png"
                alt="Our vision for the future"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-6 text-blue-900">
              Join Us on This Journey
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether through our tiffin service or the many initiatives to
              come, we are here to support, uplift, and bring comfort to those
              we serve. Join us as we strive to build a vibrant community that
              celebrates life at every stage.
            </p>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900">
              Get Involved
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
