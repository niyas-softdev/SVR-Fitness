import React, { useState } from "react";
import { plansData } from "../datas/PricePlans";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import { featuredTestimonial, testimonials } from "../datas/testimonialDatas";
import { teamMembers } from "../datas/teamDatas";
import { features } from "../datas/featuresDatas";
import StatsSection from "../section/statsSection";

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

      
    </div>
  );
};

export default Home;
