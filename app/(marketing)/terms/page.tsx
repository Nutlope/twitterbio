/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";

export const metadata = {
  title: "Terms and Conditions | Soonlist",
  openGraph: {
    title: "Terms and Conditions | Soonlist",
  },
};

export default function Page() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="prose mx-auto max-w-3xl">
        {" "}
        <h1>Website Terms and Conditions of Use</h1>
        <h2>1. Terms</h2>
        <p>
          By accessing this Website, accessible from Soonlist.com, you are
          agreeing to be bound by these Website Terms and Conditions of Use and
          agree that you are responsible for the agreement with any applicable
          local laws. If you disagree with any of these terms, you are
          prohibited from accessing this site. The materials contained in this
          Website are protected by copyright and trademark law.
        </p>
        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the
          materials on Soonlist's Website for personal, non-commercial
          transitory viewing only. This is the grant of a license, not a
          transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>modify or copy the materials;</li>
          <li>
            use the materials for any commercial purpose or for any public
            display;
          </li>
          <li>
            attempt to reverse engineer any software contained on Soonlist's
            Website;
          </li>
          <li>
            remove any copyright or other proprietary notations from the
            materials; or
          </li>
          <li>
            transfer the materials to another person or "mirror" the materials
            on any other server.
          </li>
        </ul>
        <p>
          Soonlist may terminate your use license upon violations of any of
          these restrictions. Upon termination, your viewing right will also be
          terminated and you should destroy any downloaded materials in your
          possession whether it is printed or electronic format. These Terms of
          Service has been created with the help of the{" "}
          <a href="https://www.termsofservicegenerator.net">
            Terms Of Service Generator
          </a>
          .
        </p>
        <h2>3. Disclaimer</h2>
        <p>
          All the materials on Soonlist’s Website are provided "as is". Soonlist
          makes no warranties, may it be expressed or implied, therefore negates
          all other warranties. Furthermore, Soonlist does not make any
          representations concerning the accuracy or reliability of the use of
          the materials on its Website or otherwise relating to such materials
          or any sites linked to this Website.
        </p>
        <h2>4. Limitations</h2>
        <p>
          Soonlist or its suppliers will not be held accountable for any damages
          that arise with the use or inability to use the materials on
          Soonlist’s Website, even if Soonlist or an authorized representative
          of this Website has been notified, orally or written, of the
          possibility of such damage. Some jurisdiction does not allow
          limitations on implied warranties or limitations of liability for
          incidental damages, these limitations may not apply to you.
        </p>
        <h2>5. Revisions and Errata</h2>
        <p>
          The materials appearing on Soonlist’s Website may include technical,
          typographical, or photographic errors. Soonlist will not promise that
          any of the materials in this Website are accurate, complete, or
          current. Soonlist may change the materials contained on its Website at
          any time without notice. Soonlist does not make any commitment to
          update the materials.
        </p>
        <h2>6. Links</h2>
        <p>
          Soonlist has not reviewed all of the sites linked to its Website and
          is not responsible for the contents of any such linked site. The
          presence of any link does not imply endorsement by Soonlist of the
          site. The use of any linked website is at the user’s own risk.
        </p>
        <h2>7. Site Terms of Use Modifications</h2>
        <p>
          Soonlist may revise these Terms of Use for its Website at any time
          without prior notice. By using this Website, you are agreeing to be
          bound by the current version of these Terms and Conditions of Use.
        </p>
        <h2>8. Your Privacy</h2>
        <p>Please read our Privacy Policy.</p>
        <h2>9. Governing Law</h2>
        <p>
          Any claim related to Soonlist's Website shall be governed by the laws
          of us without regards to its conflict of law provisions.
        </p>
      </div>
    </div>
  );
}
