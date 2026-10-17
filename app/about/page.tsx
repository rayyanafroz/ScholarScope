import type { Metadata } from "next";

import DocPage, { DocSection } from "@/components/DocPage";

export const metadata: Metadata = {
  title: "About",
  description: "What ScholarScope is, where its data comes from, and how it works.",
};

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function AboutPage() {
  return (
    <DocPage
      eyebrow="About"
      title="About ScholarScope"
      lede="ScholarScope is a small, focused search tool for scholarly literature. Type a topic and get back real papers with the details a researcher checks first."
    >
      <DocSection number="1" title="What it does">
        <p>
          Each search returns the 25 most relevant works for your topic, with title, authors,
          venue, year of publication and citation count. You can narrow the list by era, open the
          paper through its DOI, or copy a reference to your clipboard. The query lives in the
          address bar, so any search can be bookmarked or shared.
        </p>
      </DocSection>

      <DocSection number="2" title="Where the data comes from">
        <p>
          All results come from{" "}
          <a href="https://openalex.org" {...ext}>
            OpenAlex
          </a>
          , a free and open catalogue of the world&rsquo;s research: hundreds of millions of
          papers, books and datasets, linked to their authors, institutions and citations.
          OpenAlex releases its data under the{" "}
          <a href="https://creativecommons.org/publicdomain/zero/1.0/" {...ext}>
            CC0 licence
          </a>
          .
        </p>
        <p>
          Citation counts are OpenAlex&rsquo;s own and can differ from other indexes such as
          Google Scholar or Web of Science, which cover different sources. Metadata is shown as
          OpenAlex provides it.
        </p>
      </DocSection>

      <DocSection number="3" title="How it works">
        <p>
          When you press Enter, our server asks OpenAlex for matching works, keeps only the fields
          the page needs, and sends you the results. Nothing is searched while you type. Identical
          searches are remembered for up to an hour so shared links open quickly. If OpenAlex is
          slow or busy, you&rsquo;ll see the reason and a Retry button rather than an empty page.
        </p>
      </DocSection>

      <DocSection id="api" number="4" title="JSON API">
        <p>
          The same results are available as JSON at <code>/api/search?q=your+topic</code>. The
          response holds the query, OpenAlex&rsquo;s approximate total, and a list of papers
          with <code>title</code>, <code>authors</code>, <code>year</code>,{" "}
          <code>citations</code>, <code>venue</code> and <code>href</code>. Errors come back as{" "}
          <code>{"{ error: { kind, message } }"}</code> with a matching HTTP status.
        </p>
      </DocSection>

      <DocSection id="accessibility" number="5" title="Accessibility">
        <p>
          ScholarScope is built to WCAG 2.1 AA: a labelled search field, visible focus outlines,
          a skip-to-content link, and text contrast of at least 4.5:1. Press <code>/</code> anywhere
          to jump to the search box. Loading, empty and error states are announced to screen
          readers.
        </p>
        <p>
          If your system asks for reduced motion, the opening animation, smooth scrolling and
          decorative effects are switched off.
        </p>
      </DocSection>

      <DocSection number="6" title="Credits">
        <p>
          Built with Next.js, React and Tailwind CSS. Motion by Lenis, Vanta.js with three.js,
          React Bits and Motion. Type set in Cormorant Garamond and Inter. Data from
          OpenAlex.
        </p>
      </DocSection>
    </DocPage>
  );
}
