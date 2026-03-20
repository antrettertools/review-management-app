export const metadata = {
  title: "Terms and Conditions | ReviewHub",
  description: "Terms and Conditions for using ReviewHub review management platform.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms and Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: March 21, 2026
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-sm leading-relaxed">
          {/* ───────────────────────── 1 ───────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using the ReviewHub website, application,
              dashboard, APIs, or any related services (collectively, the
              &ldquo;Service&rdquo;), you (&ldquo;User,&rdquo; &ldquo;you,&rdquo;
              or &ldquo;your&rdquo;) acknowledge that you have read, understood,
              and agree to be bound by these Terms and Conditions
              (&ldquo;Terms&rdquo;), our Privacy Policy, and all applicable laws
              and regulations. If you do not agree with any part of these Terms,
              you must immediately discontinue use of the Service.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and
              ReviewHub (&ldquo;Company,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;). We reserve the right to
              modify these Terms at any time. Continued use of the Service after
              changes are posted constitutes acceptance of the revised Terms. It is
              your responsibility to review these Terms periodically.
            </p>
          </section>

          {/* ───────────────────────── 2 ───────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. Eligibility
            </h2>
            <p>
              You must be at least 18 years of age and have the legal capacity to
              enter into a binding agreement to use the Service. By using the
              Service, you represent and warrant that you meet these requirements.
              If you are using the Service on behalf of a business, organization,
              or other entity, you represent and warrant that you have the
              authority to bind that entity to these Terms.
            </p>
          </section>

          {/* ───────────────────────── 3 ───────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. Description of Service
            </h2>
            <p>
              ReviewHub is a subscription-based review management platform that
              provides the following features:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Centralized aggregation and display of business reviews from third-party platforms including Google Business Profile</li>
              <li>AI-powered review response suggestions generated using third-party artificial intelligence services</li>
              <li>Review analytics, sentiment tracking, and performance dashboards</li>
              <li>Multi-business management capabilities</li>
              <li>Automated daily synchronization of reviews from connected platforms</li>
              <li>Notification system for new and urgent reviews</li>
            </ul>
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as
              available.&rdquo; We reserve the right to modify, suspend, or
              discontinue any aspect of the Service at any time, with or without
              notice, and without liability to you.
            </p>
          </section>

          {/* ───────────────────────── 4 ───────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Account Registration and Security
            </h2>
            <p>
              To use the Service, you must create an account by providing
              accurate, current, and complete information, including your name,
              email address, and a password. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Keep your login credentials confidential and secure</li>
              <li>Not share your account with any third party</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be solely responsible for all activity that occurs under your account</li>
              <li>Maintain accurate and up-to-date account information</li>
            </ul>
            <p>
              We are not liable for any loss or damage arising from your failure
              to protect your account credentials. We reserve the right to
              suspend or terminate any account at our sole discretion, including
              for suspected fraudulent, abusive, or unauthorized activity.
            </p>
          </section>

          {/* ───────────────────────── 5 ───────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Subscription, Fees, and Payment
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              5.1 Subscription Plans
            </h3>
            <p>
              Access to the Service requires an active paid subscription.
              Subscription plans, pricing, and features are described on the
              Service and are subject to change at any time. Current pricing is
              displayed at the time of checkout. We reserve the right to modify
              pricing with notice to existing subscribers.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              5.2 Payment Processing
            </h3>
            <p>
              All payments are processed through Stripe, Inc.
              (&ldquo;Stripe&rdquo;), a third-party payment processor. By
              providing payment information, you agree to Stripe&apos;s{" "}
              <a
                href="https://stripe.com/legal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Privacy Policy
              </a>
              . We do not store your full credit card information on our servers.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              5.3 Recurring Billing
            </h3>
            <p>
              Subscriptions are billed on a recurring monthly basis. By
              subscribing, you authorize us to charge the payment method on file
              automatically each billing cycle until you cancel. You are
              responsible for ensuring your payment information is current and
              valid.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              5.4 Refund Policy
            </h3>
            <p>
              All fees are non-refundable to the fullest extent permitted by
              applicable law. No refunds or credits will be issued for partial
              billing periods, unused features, downtime, or dissatisfaction with
              the Service. We may, at our sole discretion, provide refunds or
              credits on a case-by-case basis, but such action does not create an
              obligation to do so in the future.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              5.5 Failed Payments
            </h3>
            <p>
              If a payment fails, we may suspend or restrict access to your
              account until the outstanding balance is resolved. We are not
              responsible for any consequences arising from service interruption
              due to payment failure.
            </p>
          </section>

          {/* ───────────────────────── 6 ───────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Cancellation and Termination
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              6.1 Cancellation by User
            </h3>
            <p>
              You may cancel your subscription at any time through the account
              settings page. Upon cancellation, your access to paid features will
              continue until the end of the current billing period, after which
              your access will be revoked. Cancellation does not entitle you to a
              refund of any fees already paid.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              6.2 Termination by ReviewHub
            </h3>
            <p>
              We reserve the right to suspend or terminate your account and
              access to the Service at any time, for any reason, with or without
              notice, including but not limited to: violation of these Terms,
              fraudulent or illegal activity, non-payment, abuse of the Service,
              or conduct that we determine is harmful to other users, third
              parties, or our business interests.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              6.3 Account Deletion
            </h3>
            <p>
              You may request permanent deletion of your account and all
              associated data. Upon deletion, all your data — including business
              profiles, reviews, responses, analytics, and notifications — will
              be permanently and irreversibly removed from our systems. We are
              not responsible for any loss of data resulting from account
              deletion. Deletion does not relieve you of any outstanding payment
              obligations.
            </p>
          </section>

          {/* ───────────────────────── 7 ───────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Third-Party Integrations and Services
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              7.1 Google Business Profile Integration
            </h3>
            <p>
              The Service allows you to connect your Google Business Profile
              account via OAuth 2.0 authentication. By connecting your Google
              account, you:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Authorize ReviewHub to access and retrieve your business reviews from Google</li>
              <li>Acknowledge that we store OAuth access tokens and refresh tokens necessary to maintain the connection</li>
              <li>Understand that review data retrieved from Google is subject to Google&apos;s Terms of Service and API policies</li>
              <li>Accept that the availability, accuracy, and timeliness of synced reviews depend on Google&apos;s API and are outside our control</li>
              <li>May revoke access at any time through your Google account settings</li>
            </ul>
            <p>
              We are not responsible for any changes, outages, rate limits, or
              restrictions imposed by Google on their APIs or services that may
              affect the functionality of the Service.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              7.2 Artificial Intelligence Services
            </h3>
            <p>
              The Service utilizes third-party AI providers (including Anthropic&apos;s
              Claude) to generate review response suggestions. By using
              AI-powered features, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>AI-generated responses are suggestions only and are not guaranteed to be accurate, appropriate, complete, or suitable for any particular purpose</li>
              <li>You are solely responsible for reviewing, editing, and approving any AI-generated content before publishing or using it</li>
              <li>Review content is transmitted to third-party AI service providers for processing, subject to their respective terms and privacy policies</li>
              <li>AI-generated content may contain errors, biases, inaccuracies, or inappropriate language</li>
              <li>We make no representations or warranties regarding the quality, reliability, or suitability of AI-generated content</li>
              <li>You assume all risk and liability associated with the use, publication, or distribution of AI-generated content</li>
              <li>AI service availability depends on third-party providers and may be interrupted without notice</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              7.3 Payment Processor (Stripe)
            </h3>
            <p>
              Payment processing is provided by Stripe. Your use of Stripe&apos;s
              services is governed by Stripe&apos;s own terms and privacy policy. We
              are not responsible for any errors, outages, or issues caused by
              Stripe&apos;s payment processing infrastructure.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              7.4 General Third-Party Disclaimer
            </h3>
            <p>
              The Service integrates with and depends upon various third-party
              platforms, APIs, and services. We do not control, endorse, or
              assume responsibility for the content, privacy policies, practices,
              availability, or performance of any third-party services. Your
              interactions with third-party services are governed by their
              respective terms. We shall not be liable for any damage or loss
              caused by or in connection with use of any third-party service.
            </p>
          </section>

          {/* ───────────────────────── 8 ───────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. User Content and Responsibilities
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              8.1 User Content
            </h3>
            <p>
              &ldquo;User Content&rdquo; includes all data, text, information,
              business profiles, review responses, and any other materials you
              submit, post, or transmit through the Service. You retain ownership
              of your User Content. By submitting User Content, you grant
              ReviewHub a worldwide, non-exclusive, royalty-free, transferable,
              sublicensable license to use, store, process, display, reproduce,
              and transmit your User Content solely for the purpose of operating,
              providing, improving, and maintaining the Service.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              8.2 User Responsibilities
            </h3>
            <p>You agree that you will:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Service only for lawful purposes and in compliance with all applicable laws and regulations</li>
              <li>Only connect business profiles and accounts for which you have proper authorization</li>
              <li>Review and verify all content — including AI-generated responses — before publishing</li>
              <li>Not use the Service to defame, harass, threaten, or harm any person or entity</li>
              <li>Not post false, misleading, fraudulent, or deceptive content</li>
              <li>Not use the Service to generate fake reviews or manipulate review platforms</li>
              <li>Not attempt to circumvent, disable, or interfere with security features of the Service</li>
              <li>Not reverse-engineer, decompile, or disassemble any part of the Service</li>
              <li>Not use automated means (bots, scrapers, etc.) to access or interact with the Service except through provided APIs</li>
              <li>Not resell, sublicense, or commercially exploit the Service without written authorization</li>
              <li>Comply with the terms of service of all third-party platforms integrated with the Service (including Google and Yelp)</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              8.3 Prohibited Uses
            </h3>
            <p>
              You expressly agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violate any local, state, national, or international law or regulation</li>
              <li>Infringe upon or violate intellectual property rights of any party</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Engage in any activity that interferes with or disrupts the Service or its infrastructure</li>
              <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation</li>
              <li>Collect or harvest personal information of other users</li>
              <li>Use the Service in any manner that could damage, disable, overburden, or impair our servers or networks</li>
              <li>Generate spam, unsolicited communications, or bulk responses</li>
              <li>Manipulate or artificially inflate review metrics or analytics</li>
            </ul>
          </section>

          {/* ───────────────────────── 9 ───────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              9. Intellectual Property
            </h2>
            <p>
              The Service, including but not limited to its software, code,
              design, text, graphics, logos, icons, images, user interface,
              algorithms, data compilations, and all other content and materials
              (collectively, &ldquo;ReviewHub IP&rdquo;), is the exclusive
              property of ReviewHub and is protected by copyright, trademark,
              patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable,
              revocable license to access and use the Service for its intended
              purpose during your active subscription. This license does not
              include the right to: (a) modify, copy, or create derivative works
              of the Service; (b) use data mining, robots, or similar data
              gathering methods; (c) download or cache any content except as
              expressly authorized; or (d) use the Service for any purpose other
              than its intended use.
            </p>
            <p>
              All trademarks, service marks, and trade names displayed on the
              Service are the property of their respective owners.
            </p>
          </section>

          {/* ───────────────────────── 10 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              10. Data Collection, Privacy, and Security
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              10.1 Data We Collect
            </h3>
            <p>
              In the course of providing the Service, we collect and process the
              following categories of data:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, hashed password, subscription plan status, and account creation date</li>
              <li><strong>Business Information:</strong> Business names, website URLs, and platform connection metadata (including OAuth tokens for connected services)</li>
              <li><strong>Review Data:</strong> Review author names, ratings, content, platform source, response status, and urgency classifications — retrieved from connected third-party platforms</li>
              <li><strong>Response Data:</strong> Review responses you create or generate through AI features, including publication status</li>
              <li><strong>Notification Data:</strong> System-generated notifications related to your reviews and account activity</li>
              <li><strong>Payment Information:</strong> Stripe customer identifiers and subscription status (full payment card details are processed and stored exclusively by Stripe)</li>
              <li><strong>Usage Data:</strong> Log data, device information, and usage patterns collected automatically through standard web technologies</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              10.2 How We Use Your Data
            </h3>
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, operate, and maintain the Service</li>
              <li>Process payments and manage subscriptions</li>
              <li>Sync and display reviews from connected platforms</li>
              <li>Generate AI-powered review response suggestions (which involves transmitting review content to third-party AI providers)</li>
              <li>Send notifications about reviews and account activity</li>
              <li>Improve and optimize the Service</li>
              <li>Communicate with you about your account, billing, and service updates</li>
              <li>Enforce these Terms and protect against fraud and abuse</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              10.3 Data Sharing with Third Parties
            </h3>
            <p>
              Your data may be shared with the following third-party service
              providers as necessary to operate the Service:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase:</strong> Database hosting and authentication services</li>
              <li><strong>Stripe:</strong> Payment processing and subscription management</li>
              <li><strong>Anthropic:</strong> AI-powered content generation (review content is sent to generate response suggestions)</li>
              <li><strong>Google:</strong> Review synchronization via Google Business Profile API</li>
              <li><strong>Vercel:</strong> Application hosting and infrastructure</li>
            </ul>
            <p>
              Each third-party provider is subject to its own terms of service
              and privacy policy. We are not responsible for the data practices
              of these third parties.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              10.4 Data Security
            </h3>
            <p>
              We implement commercially reasonable security measures to protect
              your data, including encrypted authentication, secure token
              management, and webhook signature verification. However, no method
              of electronic transmission or storage is 100% secure. We cannot
              and do not guarantee absolute security of your data. You
              acknowledge and accept the inherent risks of transmitting data
              over the internet.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              10.5 Data Retention
            </h3>
            <p>
              We retain your data for as long as your account is active or as
              needed to provide the Service. Upon account deletion, we will
              permanently delete your data from our active systems within a
              commercially reasonable timeframe. Residual copies may persist in
              backups for a limited period. Aggregate, anonymized, or
              de-identified data that cannot be used to identify you may be
              retained indefinitely.
            </p>
          </section>

          {/* ───────────────────────── 11 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              11. Disclaimers and Limitation of Warranties
            </h2>
            <p className="font-semibold uppercase">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE IS
              PROVIDED &ldquo;AS IS,&rdquo; &ldquo;AS AVAILABLE,&rdquo; AND
              &ldquo;WITH ALL FAULTS,&rdquo; WITHOUT WARRANTY OF ANY KIND,
              WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
            </p>
            <p>
              WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 space-y-1 font-semibold">
              <li>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT</li>
              <li>WARRANTIES ARISING FROM COURSE OF DEALING, USAGE, OR TRADE PRACTICE</li>
              <li>WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, ERROR-FREE, OR VIRUS-FREE</li>
              <li>WARRANTIES REGARDING THE ACCURACY, RELIABILITY, COMPLETENESS, OR QUALITY OF ANY CONTENT, DATA, OR INFORMATION PROVIDED THROUGH THE SERVICE</li>
              <li>WARRANTIES REGARDING THE ACCURACY, APPROPRIATENESS, OR QUALITY OF AI-GENERATED CONTENT</li>
              <li>WARRANTIES REGARDING THE AVAILABILITY OR PERFORMANCE OF THIRD-PARTY INTEGRATIONS</li>
              <li>WARRANTIES THAT REVIEW DATA SYNCED FROM THIRD-PARTY PLATFORMS WILL BE ACCURATE, COMPLETE, OR UP-TO-DATE</li>
              <li>WARRANTIES THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS</li>
            </ul>
            <p>
              You acknowledge that you use the Service at your own risk. Any
              reliance on any content, data, AI-generated responses, analytics,
              or other materials available through the Service is at your sole
              risk.
            </p>
          </section>

          {/* ───────────────────────── 12 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              12. Limitation of Liability
            </h2>
            <p className="font-semibold uppercase">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL REVIEWHUB, ITS OWNERS, OFFICERS, DIRECTORS, EMPLOYEES,
              AGENTS, AFFILIATES, LICENSORS, OR SERVICE PROVIDERS
              (COLLECTIVELY, &ldquo;REVIEWHUB PARTIES&rdquo;) BE LIABLE FOR ANY:
            </p>
            <ul className="list-disc pl-6 space-y-1 font-semibold uppercase">
              <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES</li>
              <li>LOSS OF PROFITS, REVENUE, BUSINESS, SAVINGS, GOODWILL, OR DATA</li>
              <li>COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES</li>
              <li>BUSINESS INTERRUPTION OR LOSS OF USE</li>
              <li>DAMAGES ARISING FROM OR RELATED TO: (A) YOUR USE OF OR INABILITY TO USE THE SERVICE; (B) AI-GENERATED CONTENT; (C) THIRD-PARTY INTEGRATIONS OR SERVICES; (D) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR DATA; (E) STATEMENTS, CONDUCT, OR CONTENT OF ANY THIRD PARTY; (F) ANY REVIEWS, RESPONSES, OR CONTENT PUBLISHED USING THE SERVICE; OR (G) ANY OTHER MATTER RELATING TO THE SERVICE</li>
            </ul>
            <p className="font-semibold uppercase">
              REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, NEGLIGENCE,
              STRICT LIABILITY, OR OTHERWISE), EVEN IF REVIEWHUB HAS BEEN
              ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="font-semibold uppercase">
              IN ANY CASE, THE TOTAL AGGREGATE LIABILITY OF THE REVIEWHUB
              PARTIES FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE
              OR THESE TERMS SHALL NOT EXCEED THE LESSER OF: (A) THE TOTAL
              AMOUNT YOU HAVE PAID TO REVIEWHUB IN THE TWELVE (12) MONTHS
              IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM; OR (B)
              ONE HUNDRED U.S. DOLLARS ($100.00).
            </p>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of
              certain damages. In such jurisdictions, our liability shall be
              limited to the maximum extent permitted by law.
            </p>
          </section>

          {/* ───────────────────────── 13 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              13. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless the ReviewHub
              Parties from and against any and all claims, demands, actions,
              liabilities, losses, damages, judgments, settlements, costs, and
              expenses (including reasonable attorneys&apos; fees and legal costs)
              arising out of or relating to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms or any applicable law or regulation</li>
              <li>Your User Content, including any review responses you publish (whether AI-generated or manually created)</li>
              <li>Your connection to or use of third-party services through the Service</li>
              <li>Any claim that your User Content infringes or violates the intellectual property, privacy, or other rights of a third party</li>
              <li>Your negligent or willful misconduct</li>
              <li>Any unauthorized access to or use of your account resulting from your failure to maintain account security</li>
              <li>Any claim by a third party (including review platform operators, reviewers, or customers) related to responses you published through the Service</li>
            </ul>
            <p>
              This indemnification obligation shall survive the termination of
              your account and these Terms.
            </p>
          </section>

          {/* ───────────────────────── 14 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              14. Dispute Resolution and Arbitration
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              14.1 Informal Resolution
            </h3>
            <p>
              Before filing any formal legal proceeding, you agree to first
              attempt to resolve any dispute informally by contacting us. We
              will attempt to resolve the dispute informally within sixty (60)
              days. If the dispute is not resolved within that period, either
              party may proceed as set forth below.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              14.2 Binding Arbitration
            </h3>
            <p>
              Any dispute, controversy, or claim arising out of or relating to
              these Terms or the Service that is not resolved informally shall be
              finally resolved by binding arbitration administered by the
              American Arbitration Association (&ldquo;AAA&rdquo;) under its
              Commercial Arbitration Rules. The arbitration shall be conducted by
              a single arbitrator. The arbitration shall take place in the state
              of the Company&apos;s principal place of business, or at a location
              mutually agreed upon. The arbitrator&apos;s decision shall be final
              and binding and may be entered as a judgment in any court of
              competent jurisdiction.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              14.3 Class Action Waiver
            </h3>
            <p className="font-semibold">
              YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE
              CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS,
              CONSOLIDATED, OR REPRESENTATIVE ACTION. YOU WAIVE ANY RIGHT TO
              PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION
              AGAINST REVIEWHUB.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4">
              14.4 Exceptions
            </h3>
            <p>
              Notwithstanding the above, either party may seek injunctive or
              other equitable relief in a court of competent jurisdiction to
              prevent the actual or threatened infringement, misappropriation, or
              violation of intellectual property rights.
            </p>
          </section>

          {/* ───────────────────────── 15 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              15. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the United States and the state in which the
              Company&apos;s principal place of business is located, without
              regard to its conflict of law principles. Subject to the
              arbitration provisions above, any legal action or proceeding
              arising under these Terms shall be brought exclusively in the
              federal or state courts located in the jurisdiction of the
              Company&apos;s principal place of business, and you irrevocably
              consent to the personal jurisdiction and venue of such courts.
            </p>
          </section>

          {/* ───────────────────────── 16 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              16. No Professional Advice
            </h2>
            <p>
              The Service, including all AI-generated content, analytics,
              insights, and suggestions, is provided for informational purposes
              only and does not constitute legal, business, marketing,
              professional, or any other form of advice. You should not rely on
              the Service as a substitute for professional consultation. We are
              not responsible for any decisions you make based on information
              provided through the Service.
            </p>
          </section>

          {/* ───────────────────────── 17 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              17. Service Availability and Modifications
            </h2>
            <p>
              We do not guarantee that the Service will be available at all times
              or without interruption. The Service may be subject to scheduled
              and unscheduled maintenance, updates, upgrades, or outages. We
              reserve the right to modify, update, or discontinue any feature or
              aspect of the Service at any time, with or without notice.
            </p>
            <p>
              We shall not be liable for any modification, suspension,
              discontinuation, or unavailability of the Service, or for any loss
              of data, functionality, or access resulting therefrom.
            </p>
          </section>

          {/* ───────────────────────── 18 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              18. Force Majeure
            </h2>
            <p>
              We shall not be liable for any failure or delay in performing our
              obligations under these Terms caused by events beyond our
              reasonable control, including but not limited to: natural
              disasters, acts of God, war, terrorism, riots, government actions,
              pandemics, epidemics, power outages, internet or
              telecommunications failures, cyberattacks, third-party service
              failures or outages, labor disputes, or any other event outside
              our reasonable control.
            </p>
          </section>

          {/* ───────────────────────── 19 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              19. Assumption of Risk
            </h2>
            <p>You expressly acknowledge and assume the following risks:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>AI-generated review responses may be inaccurate, inappropriate, or harmful if published without review</li>
              <li>Publishing responses to reviews (whether AI-generated or not) may affect your business reputation positively or negatively</li>
              <li>Third-party platform integrations may experience downtime, data loss, or disruptions beyond our control</li>
              <li>Review data retrieved from third parties may be incomplete, inaccurate, or delayed</li>
              <li>Syncing with external platforms involves data transmission over the internet, which carries inherent security risks</li>
              <li>Changes to third-party platform terms, APIs, or policies may limit or eliminate certain features of the Service</li>
              <li>Analytics and insights provided by the Service are based on available data and may not reflect complete or accurate business performance</li>
            </ul>
          </section>

          {/* ───────────────────────── 20 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              20. Electronic Communications
            </h2>
            <p>
              By creating an account and using the Service, you consent to
              receive electronic communications from us, including but not
              limited to: account notifications, billing and payment
              communications, service updates, and administrative messages. You
              agree that all agreements, notices, disclosures, and other
              communications provided electronically satisfy any legal
              requirement that such communications be in writing.
            </p>
          </section>

          {/* ───────────────────────── 21 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              21. Severability
            </h2>
            <p>
              If any provision of these Terms is found to be invalid,
              unenforceable, or illegal by a court of competent jurisdiction,
              the remaining provisions shall continue in full force and effect.
              The invalid or unenforceable provision shall be modified to the
              minimum extent necessary to make it valid and enforceable while
              preserving the original intent.
            </p>
          </section>

          {/* ───────────────────────── 22 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              22. Entire Agreement
            </h2>
            <p>
              These Terms, together with our Privacy Policy and any other
              policies or agreements referenced herein, constitute the entire
              agreement between you and ReviewHub regarding your use of the
              Service. These Terms supersede all prior and contemporaneous
              understandings, agreements, representations, and warranties, both
              written and oral, regarding the Service.
            </p>
          </section>

          {/* ───────────────────────── 23 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              23. Waiver
            </h2>
            <p>
              No waiver of any term or condition set forth in these Terms shall
              be deemed a further or continuing waiver of such term or condition
              or a waiver of any other term or condition. Our failure to assert a
              right or provision under these Terms shall not constitute a waiver
              of such right or provision.
            </p>
          </section>

          {/* ───────────────────────── 24 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              24. Assignment
            </h2>
            <p>
              You may not assign, transfer, or delegate your rights or
              obligations under these Terms without our prior written consent.
              We may assign our rights and obligations under these Terms without
              restriction and without notice to you, including in connection with
              a merger, acquisition, corporate reorganization, or sale of all or
              substantially all of our assets.
            </p>
          </section>

          {/* ───────────────────────── 25 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              25. No Third-Party Beneficiaries
            </h2>
            <p>
              These Terms are for the sole benefit of you and ReviewHub. Nothing
              in these Terms, express or implied, is intended to or shall confer
              upon any third party any legal or equitable right, benefit, or
              remedy of any nature whatsoever.
            </p>
          </section>

          {/* ───────────────────────── 26 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              26. Notices
            </h2>
            <p>
              We may provide notices to you via the email address associated with
              your account, through in-app notifications, or by posting on the
              Service. You are responsible for ensuring your contact information
              is current. Notices are deemed received when sent via email or when
              posted on the Service.
            </p>
          </section>

          {/* ───────────────────────── 27 ──────────────────────── */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              27. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at
              the email address provided on the Service or through the
              appropriate contact channels available on our website.
            </p>
          </section>

          {/* ───────────── acknowledgment ────────────── */}
          <section className="border-t border-gray-200 pt-6 mt-8">
            <p className="font-semibold text-gray-900">
              BY CREATING AN ACCOUNT, SUBSCRIBING TO A PLAN, OR OTHERWISE USING
              THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND
              AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS IN THEIR
              ENTIRETY.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
