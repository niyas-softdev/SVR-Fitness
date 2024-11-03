import React, { useState } from "react";
import { plansData } from "../datas/PricePlans";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import { featuredTestimonial, testimonials } from "../datas/testimonialDatas";
import { teamMembers } from "../datas/teamDatas";
import { features } from "../datas/featuresDatas";
import StatsSection from "../section/statsSection";
import AppNavbar from "../common/AppNavbar";
import BmiCheck from "../pages/bmiCalculator";

const Home = () => {
  const { frequencies, plans } = plansData;
  const [frequency, setFrequency] = useState(frequencies[0]);

  // Animation Variants for Framer Motion
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
  };
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="bg-black text-gray-200 min-h-screen">
      <AppNavbar />
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative isolate overflow-hidden pt-14"
      >
        <img
          src="https://cdn.pixabay.com/photo/2017/08/07/14/02/man-2604149_1280.jpg"
          alt="Fitness workout"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 -z-10" />

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Empower Your Body & Mind
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Join the best fitness community and start your journey to a
            healthier lifestyle today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition"
            >
              Get Membership
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-white hover:underline"
            >
              Explore Programs <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* features Section */}
      <section className="py-16 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">Our Gym Features</h2>
            <p className="text-lg text-gray-400">
              Explore the exclusive features that make us the best in fitness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <article
                key={feature.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-800 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 hover:shadow-lg hover:scale-105 transition duration-300"
              >
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/50" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <h3 className="text-xl font-semibold leading-6 text-white mt-3">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {/* Plans & Pricing Section */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-10">
            Our Plans & Pricing
          </h2>
          <fieldset className="mb-10">
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-x-4 rounded-full bg-white/10 p-1">
                {frequencies.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFrequency(option)}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                      frequency.value === option.value
                        ? "bg-indigo-500 text-white"
                        : "text-gray-300 hover:bg-indigo-500 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </fieldset>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                className={`p-8 border rounded-lg transition-all duration-300 ${
                  plan.mostPopular
                    ? "border-indigo-500 bg-white/5 shadow-lg"
                    : "border-gray-700"
                }`}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                <p className="text-5xl font-extrabold text-white mb-2">
                  ₹{plan.price[frequency.value]}
                  <span className="text-lg font-medium text-gray-300">
                    {" "}
                    {frequency.priceSuffix}
                  </span>
                </p>
                <ul className="text-sm text-gray-300 space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-indigo-500">✔</span> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-md text-sm font-semibold transition-all duration-300 ${
                    plan.mostPopular
                      ? "bg-indigo-500 text-white hover:bg-indigo-600"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Buy Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      {/* Info Section */}
      <section className="py-16 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <h1 className="text-4xl font-extrabold text-center mb-12 text-white">
            Meet Our Master
          </h1>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            {/* Left Side - Image */}
            <div className="lg:w-1/4 w-full sm:ml-5 order-1 lg:order-1">
              <img
                src="https://m.media-amazon.com/images/I/81GU3EyPnVS.jpg"
                alt="Info Section"
                className="rounded-lg shadow-2xl object-cover w-full h-[300px] lg:h-[350px]"
              />
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-3/4 w-full flex flex-col justify-center text-center lg:text-left order-2 lg:order-2">
              <h2 className="text-2xl font-extrabold mb-6 leading-snug text-white">
                Transform Your Business with Our Services
              </h2>
              <p className="text-base text-gray-300 mb-6">
                We specialize in delivering exceptional services designed to
                empower your business. Whether it's strategic consulting or
                technical solutions, we’ve got you covered.
              </p>

              <ul className="list-disc list-inside space-y-3 text-gray-400 text-sm">
                <li>Tailored strategy and consulting services</li>
                <li>Custom software solutions built for your needs</li>
                <li>Dedicated 24/7 support for uninterrupted operations</li>
              </ul>

              <div className="mt-8">
                <button className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}

      <section className="py-16 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-400">
              Our professional team is here to guide you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-gradient-to-t from-gray-700/40 to-gray-800/40 shadow-lg hover:scale-105 transform transition duration-500"
              >
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full border-4 border-red-500"
                />
                <div className="text-center mt-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-sm text-indigo-400 mb-4">{member.role}</p>
                  <p className="text-gray-400">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* stats */}

      <StatsSection />

    

      {/* Testimonial */}

      <section className="py-16 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Our Testimonials</h2>
            <p className="text-lg text-gray-400">
              Hear from those who transformed their lives with us.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Featured Testimonial */}
            <motion.figure
              className="col-span-1 md:col-span-2 xl:col-start-2 xl:row-end-1 p-8 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 shadow-xl backdrop-blur-lg hover:scale-105 transform transition duration-500"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="text-xl italic">
                <p>{`"${featuredTestimonial.body || ""}"`}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center space-x-4">
                {featuredTestimonial.author?.imageUrl && (
                  <img
                    src={featuredTestimonial.author.imageUrl}
                    alt={featuredTestimonial.author.name || "Anonymous"}
                    className="w-14 h-14 rounded-full border-2 border-indigo-500"
                  />
                )}
                <div>
                  <div className="text-lg font-semibold">
                    {featuredTestimonial.author?.name || "Anonymous"}
                  </div>
                  <div className="text-sm text-gray-400">
                    @{featuredTestimonial.author?.handle || "N/A"}
                  </div>
                </div>
              </figcaption>
            </motion.figure>

            {/* Additional Testimonials */}
            {testimonials.flat().map((group, idx) =>
              group.map((testimonial) => (
                <motion.figure
                  key={testimonial.author.handle}
                  className="p-6 rounded-2xl bg-gradient-to-t from-gray-700/40 to-gray-800/40 shadow-md backdrop-blur-md hover:scale-105 transform transition duration-500"
                  variants={fadeIn}
                >
                  <blockquote className="text-lg italic mb-4">
                    <p>{`"${testimonial.body}"`}</p>
                  </blockquote>
                  <figcaption className="flex items-center space-x-4">
                    <img
                      src={testimonial.author.imageUrl}
                      alt={testimonial.author.name}
                      className="w-12 h-12 rounded-full border-2 border-red-500"
                    />
                    <div>
                      <div className="font-semibold">
                        {testimonial.author.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        @{testimonial.author.handle}
                      </div>
                    </div>
                  </figcaption>
                </motion.figure>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Social Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Instagram</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.055 2.007.24 2.49.41a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.17.483.355 1.32.41 2.49.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.055 1.17-.24 2.007-.41 2.49a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.483.17-1.32.355-2.49.41-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.055-2.007-.24-2.49-.41a4.902 4.902 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.17-.483-.355-1.32-.41-2.49-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.055-1.17.24-2.007.41-2.49a4.902 4.902 0 0 1 1.153-1.772 4.902 4.902 0 0 1 1.772-1.153c.483-.17 1.32-.355 2.49-.41 1.266-.058 1.646-.07 4.85-.07zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.323a4.161 4.161 0 1 1 0-8.323 4.161 4.161 0 0 1 0 8.323zm6.406-11.845a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">X</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">GitHub</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">YouTube</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              About Us
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Programs
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Membership
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Contact
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Blog
            </a>
          </div>

          {/* Copyright Text */}
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Fitness Gym. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
