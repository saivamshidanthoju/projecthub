import React from "react";

export default function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-inverse-surface text-surface py-20">
      <div className="max-w-max-width mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-xl">
        <div className="md:col-span-4">
          <h2 className="font-title-lg text-title-lg text-inverse-primary font-bold mb-6">
            ProjectHub
          </h2>
          <p className="font-body-md text-body-md text-surface-variant mb-8 max-w-[320px]">
            Building the future of project operations. High-fidelity tools for
            professional engineering teams.
          </p>
          <div className="flex gap-md">
            <span className="material-symbols-outlined text-surface-variant hover:text-inverse-primary cursor-pointer">
              public
            </span>
            <span className="material-symbols-outlined text-surface-variant hover:text-inverse-primary cursor-pointer">
              chat_bubble
            </span>
            <span className="material-symbols-outlined text-surface-variant hover:text-inverse-primary cursor-pointer">
              share
            </span>
          </div>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-label-md text-label-md text-inverse-primary uppercase tracking-widest mb-6">
            Product
          </h4>
          <ul className="space-y-4 font-body-sm text-body-sm text-surface-variant">
            <li>
              <a className="hover:text-surface" href="#">
                Platform Overview
              </a>
            </li>
            <li>
              <a className="hover:text-surface" href="#">
                Multi-tenant
              </a>
            </li>
            <li>
              <a className="hover:text-surface" href="#">
                Integrations
              </a>
            </li>
            <li>
              <a className="hover:text-surface" href="#">
                Changelog
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-label-md text-label-md text-inverse-primary uppercase tracking-widest mb-6">
            Resources
          </h4>
          <ul className="space-y-4 font-body-sm text-body-sm text-surface-variant">
            <li>
              <a className="hover:text-surface" href="#">
                Documentation
              </a>
            </li>
            <li>
              <a className="hover:text-surface" href="#">
                API Reference
              </a>
            </li>
            <li>
              <a className="hover:text-surface" href="#">
                Security Whitepaper
              </a>
            </li>
            <li>
              <a className="hover:text-surface" href="#">
                Case Studies
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <h4 className="font-label-md text-label-md text-inverse-primary uppercase tracking-widest mb-6">
            Stay Updated
          </h4>
          <p className="font-body-sm text-body-sm text-surface-variant mb-6">
            Join our newsletter for enterprise engineering insights.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-sm">
            <input
              className="flex-grow bg-surface-variant/10 border border-outline-variant rounded-lg px-4 py-2 text-surface focus:ring-1 focus:ring-inverse-primary outline-none transition-all"
              placeholder="email@company.com"
              type="email"
              required
            />
            <button
              type="submit"
              className="bg-primary px-4 py-2 rounded-lg font-button-text text-button-text hover:opacity-90 cursor-pointer text-on-primary"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-max-width mx-auto px-margin-desktop mt-20 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md text-surface-variant font-body-sm text-body-sm">
        <p>© 2024 ProjectHub SaaS Inc. All rights reserved.</p>
        <div className="flex gap-lg">
          <a className="hover:text-surface" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-surface" href="#">
            Terms of Service
          </a>
          <a className="hover:text-surface" href="#">
            Legal
          </a>
        </div>
      </div>
    </footer>
  );
}
