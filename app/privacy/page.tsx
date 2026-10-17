import type { Metadata } from "next";

import DocPage, { DocSection } from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What ScholarScope does and doesn't collect.",
};

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function PrivacyPage() {
  return (
    <DocPage
      eyebrow="Privacy"
      title="Privacy"
      lede="Short version: no accounts, no cookies, no analytics. Your searches are passed to OpenAlex to fetch results, and that's it."
      updated="17 October 2026"
    >
      <DocSection number="1" title="What we collect">
        <p>
          ScholarScope has no accounts and sets no cookies. It doesn&rsquo;t use analytics,
          advertising or tracking scripts.
        </p>
        <p>
          Your browser&rsquo;s session storage holds a single flag so the opening animation only
          plays once per visit. It never leaves your device and is cleared when you close the tab.
        </p>
      </DocSection>

      <DocSection number="2" title="Your searches">
        <p>
          To show results, our server sends your search text to{" "}
          <a href="https://openalex.org" {...ext}>
            OpenAlex
          </a>
          . OpenAlex receives the query from our server, not from your browser, so it doesn&rsquo;t
          see your IP address. Results may be kept in a short-lived server cache, for up to an
          hour, so repeated searches are faster. The cache stores the results, not who asked.
        </p>
        <p>
          Because the query is part of the page address (<code>/?q=…</code>), it will appear in
          your browser history like any other web address.
        </p>
      </DocSection>

      <DocSection number="3" title="Hosting">
        <p>
          Like any website, the hosting provider may keep standard server logs (such as IP
          address, time and requested page) for security and reliability. These are not used to
          profile visitors.
        </p>
      </DocSection>

      <DocSection number="4" title="Links to other sites">
        <p>
          Paper links take you to publishers, DOI resolvers or OpenAlex, which have their own
          privacy policies.
        </p>
      </DocSection>
    </DocPage>
  );
}
