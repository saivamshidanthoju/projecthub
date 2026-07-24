export default function Features() {
  return (
    <section className="py-32 bg-white" id="features">
      <div className="max-w-max-width mx-auto px-margin-desktop">
        <div className="text-center mb-20">
          <h2 className="font-headline-lg text-headline-lg text-text-heading mb-4">
            Enterprise-Ready Infrastructure
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[576px] mx-auto">
            Scale without limits with our specialized architecture designed for the
            world's most demanding project workflows.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg h-auto md:h-[600px]">
          {/* Bento Item 1: Real-time Analytics */}
          <div className="md:col-span-7 bg-surface-sunken border border-border-subtle rounded-3xl p-lg flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">
                analytics
              </span>
              <h3 className="font-headline-md text-headline-md text-text-heading mb-2">
                Real-time Analytics
              </h3>
              <p className="font-body-md text-body-md text-text-body max-w-[448px]">
                Monitor performance metrics as they happen with low-latency data
                streams and visual telemetry.
              </p>
            </div>
            <div className="mt-8 transition-transform duration-500 group-hover:scale-105">
              <img
                className="rounded-xl shadow-lg w-full h-48 object-cover"
                alt="A detailed, high-contrast digital visualization of complex data charts including line graphs and circular progress meters."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCee54lOPuWGsBKfte2Qa5w_7p6Kk3FBgY-clEmsIrTsP-2-gINLQbcKnqXOzgN9zurotYAK1MZ4BEfDGlhit9Kax9kpePOYUvw3su20GyzqShArZnqTeTr9YnQSYP3Z3cOzD7SV9TiMPWAAdhhSlFkYw_52uSo3Ebf6NWkWgfx3t16CWxCDyJ9RJplFtGD4zfTSJWq0AVErK68q2gy0hs7e_tET9yhYZIY79QAZwMVRG0dcsiIyQ8poTj1x7FNxTr1oKMXg3JbROc"
              />
            </div>
          </div>

          {/* Bento Item 2: Multi-tenant */}
          <div className="md:col-span-5 bg-primary text-on-primary rounded-3xl p-lg flex flex-col justify-center items-center text-center">
            <span className="material-symbols-outlined text-5xl mb-6">hub</span>
            <h3 className="font-headline-md text-headline-md mb-4">
              Multi-tenant Architecture
            </h3>
            <p className="font-body-md text-body-md text-primary-fixed opacity-90">
              Securely manage isolated workspaces for multiple teams or clients
              within a single enterprise instance.
            </p>
          </div>

          {/* Bento Item 3: Team Collaboration */}
          <div className="md:col-span-5 bg-surface-container-low border border-border-subtle rounded-3xl p-lg group overflow-hidden">
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
                <div className="w-12 h-12 rounded-full border-2 border-white bg-primary-fixed"></div>
                <div className="w-12 h-12 rounded-full border-2 border-white bg-secondary-fixed"></div>
                <div className="w-12 h-12 rounded-full border-2 border-white bg-tertiary-fixed"></div>
                <div className="w-12 h-12 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center font-label-md text-on-surface-variant">
                  +12
                </div>
              </div>
            </div>
          </div>

          {/* Bento Item 4: Infinite Scalability */}
          <div className="md:col-span-7 bg-surface-sunken border border-border-subtle rounded-3xl p-lg flex items-center gap-xl">
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
              <span className="material-symbols-outlined text-primary text-6xl animate-pulse">
                speed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
