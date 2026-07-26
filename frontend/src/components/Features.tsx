import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="py-32 bg-white" id="features">
      <div className="max-w-max-width mx-auto px-margin-desktop">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="text-center mb-20"
        >
          <h2 className="font-headline-lg text-headline-lg text-text-heading mb-4">
            Enterprise-Ready Infrastructure
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[576px] mx-auto">
            Scale without limits with our specialized architecture designed for the
            world's most demanding project workflows.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg h-auto md:h-[600px]">
          {/* Bento Item 1: Real-time Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6, borderColor: "var(--color-primary-fixed-dim)" }}
            className="md:col-span-7 bg-surface-sunken border border-border-subtle rounded-3xl p-lg flex flex-col justify-between overflow-hidden relative group cursor-pointer"
          >
            <div className="relative z-10">
              <motion.span
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="material-symbols-outlined text-primary text-4xl mb-4 inline-block"
              >
                analytics
              </motion.span>
              <h3 className="font-headline-md text-headline-md text-text-heading mb-2">
                Real-time Analytics
              </h3>
              <p className="font-body-md text-body-md text-text-body max-w-[448px]">
                Monitor performance metrics as they happen with low-latency data
                streams and visual telemetry.
              </p>
            </div>
            <div className="mt-8 overflow-hidden rounded-xl shadow-lg">
              <motion.img
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.4 }}
                className="w-full h-48 object-cover"
                alt="A detailed, high-contrast digital visualization of complex data charts including line graphs and circular progress meters."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCee54lOPuWGsBKfte2Qa5w_7p6Kk3FBgY-clEmsIrTsP-2-gINLQbcKnqXOzgN9zurotYAK1MZ4BEfDGlhit9Kax9kpePOYUvw3su20GyzqShArZnqTeTr9YnQSYP3Z3cOzD7SV9TiMPWAAdhhSlFkYw_52uSo3Ebf6NWkWgfx3t16CWxCDyJ9RJplFtGD4zfTSJWq0AVErK68q2gy0hs7e_tET9yhYZIY79QAZwMVRG0dcsiIyQ8poTj1x7FNxTr1oKMXg3JbROc"
              />
            </div>
          </motion.div>

          {/* Bento Item 2: Multi-tenant */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-5 bg-primary text-on-primary rounded-3xl p-lg flex flex-col justify-center items-center text-center cursor-pointer shadow-md"
          >
            <motion.span
              whileHover={{ rotate: 180, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="material-symbols-outlined text-5xl mb-6 inline-block"
            >
              hub
            </motion.span>
            <h3 className="font-headline-md text-headline-md mb-4">
              Multi-tenant Architecture
            </h3>
            <p className="font-body-md text-body-md text-primary-fixed opacity-90">
              Securely manage isolated workspaces for multiple teams or clients
              within a single enterprise instance.
            </p>
          </motion.div>

          {/* Bento Item 3: Team Collaboration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6, borderColor: "var(--color-primary-fixed-dim)" }}
            className="md:col-span-5 bg-surface-container-low border border-border-subtle rounded-3xl p-lg group overflow-hidden cursor-pointer"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="font-title-lg text-title-lg text-text-heading mb-2">
                  Team Collaboration
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                  Async-first communication tools integrated directly into your
                  project tasks.
                </p>
              </div>
              <div className="flex -space-x-4">
                <motion.div
                  whileHover={{ y: -8, scale: 1.1, zIndex: 10 }}
                  className="w-12 h-12 rounded-full border-2 border-white bg-primary-fixed cursor-pointer"
                ></motion.div>
                <motion.div
                  whileHover={{ y: -8, scale: 1.1, zIndex: 10 }}
                  className="w-12 h-12 rounded-full border-2 border-white bg-secondary-fixed cursor-pointer"
                ></motion.div>
                <motion.div
                  whileHover={{ y: -8, scale: 1.1, zIndex: 10 }}
                  className="w-12 h-12 rounded-full border-2 border-white bg-tertiary-fixed cursor-pointer"
                ></motion.div>
                <motion.div
                  whileHover={{ y: -8, scale: 1.1, zIndex: 10 }}
                  className="w-12 h-12 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center font-label-md text-on-surface-variant cursor-pointer"
                >
                  +12
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 4: Infinite Scalability */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.35 }}
            whileHover={{ y: -6, borderColor: "var(--color-primary-fixed-dim)" }}
            className="md:col-span-7 bg-surface-sunken border border-border-subtle rounded-3xl p-lg flex items-center gap-xl cursor-pointer"
          >
            <div className="w-1/2">
              <h3 className="font-title-lg text-title-lg text-text-heading mb-2">
                Infinite Scalability
              </h3>
              <p className="font-body-sm text-body-sm text-text-body">
                Our cloud-native backbone expands with your team, from 10 to
                10,000 members without a millisecond of lag.
              </p>
            </div>
            <div className="w-1/2 relative h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
              <motion.span
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 80, damping: 10 }}
                className="material-symbols-outlined text-primary text-6xl animate-pulse inline-block"
              >
                speed
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

