"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, Utensils, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, delay = 0 }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

const Homepage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <Image
          src="/image.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-800/50"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="container mx-auto px-4 h-full flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Purushottam Sevashram Foundation
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
              Elderly Enrichment Initiative: Empowering Golden Years with Care
              and Joy!
            </p>
            <Link href="/donate">
              <Button className="w-fit bg-yellow-400 hover:bg-yellow-600">
                Get Involved
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedCard>
              <Card className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-blue-800">
                  Our Mission
                </h3>
                <CardContent className="p-0">
                  <p className="text-gray-600">
                    To provide comprehensive support and services tailored to
                    the unique needs of seniors, encompassing residential care,
                    healthcare services, nutritious dining options.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
            <AnimatedCard delay={0.2}>
              <Card className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-blue-800">
                  Our Vision
                </h3>
                <CardContent className="p-0">
                  <p className="text-gray-600">
                    Empowering seniors through personalized care and vibrant
                    community engagement. Prioritizing health, independence, and
                    advocacy for a fulfilling aging journey.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
            <AnimatedCard delay={0.4}>
              <Card className="p-6 md:col-span-2 lg:col-span-1">
                <h3 className="text-2xl font-semibold mb-4 text-blue-800">
                  Our Objective
                </h3>
                <CardContent className="p-0">
                  <p className="text-gray-600">
                    To create a community where seniors thrive with dignity,
                    joy, and purpose, supported by compassionate care and
                    enriching experiences.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
            <div className="flex justify-center col-span-full">
              <Link href={"/about"}>
                <Button className="w-fit bg-red-400 hover:bg-red-600  ">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-blue-900">
        <div className="container mx-auto px-4 ">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-white"
          >
            Our Services
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Home,
                title: "Old Age Home",
                items: [
                  "Secure, nurturing environment",
                  "24/7 trained staff support",
                  "Homely atmosphere",
                ],
              },
              {
                icon: Activity,
                title: "Healthcare Services",
                items: [
                  "Regular health check-ups",
                  "Specialized medical care",
                  "Wellness programs",
                ],
              },
              {
                icon: Utensils,
                title: "Dining Services",
                items: [
                  "Nutritious meals",
                  "Customizable menus",
                  "Tiffin delivery",
                ],
              },
              {
                icon: Users,
                title: "Recreational Activities",
                items: ["Arts and crafts", "Yoga sessions", "Social events"],
              },
            ].map((service, index) => (
              <AnimatedCard key={service.title} delay={index * 0.2}>
                <Card className="p-6 ">
                  <service.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-4">
                    {service.title}
                  </h3>
                  <CardContent className="p-0">
                    <ul className="space-y-2 text-gray-600">
                      {service.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
