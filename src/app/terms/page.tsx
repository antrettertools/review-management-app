'use client'

import Link from 'next/link'

export default function TermsPage() {
  const effectiveDate = 'March 21, 2026'
  const lastUpdated = 'March 21, 2026'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            ReviewHub
          </Link>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="px-6 py-2.5 text-slate-900 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-100">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms and Conditions</h1>
          <p className="text-slate-500 mb-2">Effective Date: {effectiveDate}</p>
          <p className="text-slate-500 mb-8">Last Updated: {lastUpdated}</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

            {/* 1. Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing, browsing, or using the ReviewHub platform (the &ldquo;Service&rdquo;), including all associated websites, applications, APIs, and services operated by ReviewHub (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions (&ldquo;Terms&rdquo;), our Privacy Policy, and all applicable laws and regulations. If you do not agree with any part of these Terms, you must immediately discontinue use of the Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and ReviewHub. By creating an account, subscribing to any plan, reactivating a subscription, or continuing to use the Service, you reaffirm your acceptance of these Terms as they exist at the time of such action.
              </p>
              <p>
                You represent and warrant that you are at least 18 years of age (or the age of legal majority in your jurisdiction), have the legal capacity to enter into this agreement, and, if accepting on behalf of a business entity, have the authority to bind that entity to these Terms.
              </p>
            </section>

            {/* 2. Description of Service */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
              <p>
                ReviewHub is a software-as-a-service (&ldquo;SaaS&rdquo;) platform that provides tools for managing, aggregating, analyzing, and responding to customer reviews from third-party platforms including, but not limited to, Google Business Profile. The Service includes, without limitation:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Review aggregation and syncing from connected third-party platforms</li>
                <li>AI-powered response generation and suggestions using third-party artificial intelligence models</li>
                <li>Analytics dashboards and reporting on review metrics</li>
                <li>Notification systems for new and urgent reviews</li>
                <li>Business profile management tools</li>
              </ul>
              <p>
                The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We reserve the right to modify, suspend, discontinue, or limit any aspect of the Service at any time, with or without notice, for any reason or no reason, without liability to you.
              </p>
            </section>

            {/* 3. AI-Generated Content */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. AI-Generated Content Disclaimer</h2>
              <p>
                <strong>IMPORTANT:</strong> The Service utilizes third-party artificial intelligence (&ldquo;AI&rdquo;) models, including but not limited to models provided by Anthropic, to generate suggested responses to customer reviews. You acknowledge and agree to the following:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>AI-generated content is provided solely as a suggestion and starting point. You are entirely and exclusively responsible for reviewing, editing, approving, and publishing any content generated by the AI features before it is posted to any platform.</li>
                <li>AI-generated content may contain errors, inaccuracies, inappropriate language, misleading information, hallucinations, or content that does not accurately reflect your business, values, policies, or intentions.</li>
                <li>ReviewHub makes absolutely no representations or warranties regarding the accuracy, appropriateness, completeness, quality, legality, reliability, or suitability of any AI-generated content for any purpose whatsoever.</li>
                <li>You assume all risk and liability for any AI-generated content that you choose to publish, distribute, or use in any manner, whether modified or unmodified.</li>
                <li>ReviewHub shall not be liable for any claims, damages, losses, penalties, fines, or consequences of any kind arising from your use or publication of AI-generated content, including but not limited to claims of defamation, libel, false advertising, misleading statements, regulatory violations, or any other legal claim.</li>
                <li>You agree to indemnify and hold harmless ReviewHub from any and all claims arising from AI-generated content you publish or use.</li>
              </ul>
            </section>

            {/* 4. Third-Party Integrations */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Third-Party Integrations and Services</h2>
              <p>
                The Service integrates with third-party platforms and services, including but not limited to Google Business Profile, Stripe, and Anthropic. You acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of third-party integrations is subject to the respective terms of service, privacy policies, and usage policies of those third-party providers, which you are solely responsible for reviewing and complying with.</li>
                <li>ReviewHub is not responsible for the availability, accuracy, functionality, security, or performance of any third-party services. Any issues arising from third-party integrations, including but not limited to data loss, sync failures, API changes, service disruptions, or account suspensions, are beyond our control and responsibility.</li>
                <li>By connecting your third-party accounts (such as Google Business Profile), you authorize ReviewHub to access, retrieve, store, and process data from those accounts as necessary to provide the Service. You represent that you have the right and authority to grant such access.</li>
                <li>ReviewHub may store OAuth tokens, API credentials, and other authorization data necessary to maintain your third-party connections. You understand that revoking access through a third-party platform may disrupt Service functionality.</li>
                <li>We are not liable for any actions taken by third-party platforms in response to content posted through our Service, including the removal of reviews, suspension of accounts, or other enforcement actions.</li>
              </ul>
            </section>

            {/* 5. User Accounts and Security */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. User Accounts and Security</h2>
              <p>
                You are solely responsible for maintaining the confidentiality of your account credentials, including your password and any associated authentication tokens. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information during registration and keep it updated.</li>
                <li>Not share your account credentials with any third party.</li>
                <li>Immediately notify us of any unauthorized use of your account or any security breach.</li>
                <li>Accept full responsibility for all activities that occur under your account, whether authorized by you or not.</li>
              </ul>
              <p>
                ReviewHub shall not be liable for any loss, damage, or harm arising from your failure to maintain the security of your account credentials, or from any unauthorized access to your account.
              </p>
            </section>

            {/* 6. Subscription, Billing, and Payments */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Subscription, Billing, and Payments</h2>
              <p>
                Access to the Service requires an active paid subscription. By subscribing, you agree to the following:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Recurring Charges:</strong> Subscriptions are billed on a recurring monthly basis at the rate displayed at the time of purchase (currently $39.99/month for ReviewHub Pro). By subscribing, you authorize ReviewHub and its payment processor (Stripe) to charge your payment method on a recurring basis.</li>
                <li><strong>Price Changes:</strong> We reserve the right to change subscription pricing at any time. Price changes will take effect at the start of your next billing cycle following notice of the change. Continued use of the Service after a price change constitutes acceptance of the new pricing.</li>
                <li><strong>No Refunds:</strong> All subscription fees are non-refundable except where required by applicable law. No refunds or credits will be issued for partial months of service, downgrade refunds, or unused features. Cancellation of your subscription will not entitle you to a refund of any previously paid fees.</li>
                <li><strong>Failed Payments:</strong> If a payment fails, we may suspend or restrict your access to the Service without notice. You are responsible for ensuring your payment method is valid, current, and has sufficient funds.</li>
                <li><strong>Taxes:</strong> All fees are exclusive of applicable taxes, levies, and duties. You are responsible for paying all such taxes associated with your subscription.</li>
              </ul>
            </section>

            {/* 7. Cancellation and Reactivation */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Cancellation and Reactivation</h2>
              <p>
                You may cancel your subscription at any time. Upon cancellation:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your access to the Service will be immediately restricted upon cancellation or at the end of your current billing period, at our sole discretion.</li>
                <li>Your data will be retained for a reasonable period to allow for reactivation, but we reserve the right to delete your data at any time after cancellation, in accordance with our data retention policies and applicable law.</li>
                <li>We are under no obligation to retain, maintain, or provide access to your data after cancellation.</li>
              </ul>
              <p>
                If you choose to reactivate your subscription, you agree to these Terms as they exist at the time of reactivation, acknowledge that your data may have been modified or deleted during the cancellation period, and agree to a new billing cycle at the then-current subscription rate.
              </p>
            </section>

            {/* 8. Account Deletion */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Account Deletion</h2>
              <p>
                You may request permanent deletion of your account at any time. By confirming account deletion, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All account data will be permanently and irreversibly deleted, including but not limited to your profile, businesses, reviews, responses, analytics data, notification history, and all associated records.</li>
                <li>This action is irreversible and cannot be undone. ReviewHub cannot recover deleted data under any circumstances.</li>
                <li>Any content you have published to third-party platforms through the Service (such as review responses posted to Google) will not be removed by account deletion and will remain on those platforms subject to their own terms and policies.</li>
                <li>You waive any and all claims against ReviewHub related to the deletion of your data, including but not limited to claims for data loss, business interruption, or lost revenue.</li>
                <li>Any outstanding subscription fees or charges that accrued prior to deletion remain your responsibility.</li>
              </ul>
            </section>

            {/* 9. User Content and Data */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. User Content and Data</h2>
              <p>
                You retain ownership of the content you provide to the Service. However, by using the Service, you grant ReviewHub a worldwide, non-exclusive, royalty-free, transferable, sublicensable license to use, process, store, reproduce, modify, and display your content solely as necessary to provide, maintain, and improve the Service.
              </p>
              <p>
                You represent and warrant that you have all necessary rights, permissions, and consents to provide your content to the Service and to grant the licenses described herein. You are solely responsible for ensuring that your use of the Service complies with all applicable laws, regulations, and third-party rights, including but not limited to privacy laws, data protection regulations, consumer protection laws, and intellectual property rights.
              </p>
              <p>
                You shall not use the Service to post, transmit, or distribute any content that is unlawful, defamatory, harassing, abusive, fraudulent, obscene, or otherwise objectionable.
              </p>
            </section>

            {/* 10. Privacy and Data Processing */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Privacy and Data Processing</h2>
              <p>
                By using the Service, you acknowledge that we collect, process, and store personal data including but not limited to: your name, email address, payment information (processed by Stripe), business information, customer review data from connected platforms, AI-generated content, OAuth tokens and authorization credentials, usage analytics and interaction data, and IP addresses and device information.
              </p>
              <p>
                You consent to the transmission of your data to third-party service providers including Supabase (database hosting), Stripe (payment processing), Anthropic (AI content generation), and Google (review platform integration), each of which has its own privacy practices that we do not control. We are not responsible for the privacy or security practices of these third-party providers.
              </p>
              <p>
                We implement reasonable security measures to protect your data, but no method of electronic storage or transmission is 100% secure. We cannot and do not guarantee absolute security of your data. You acknowledge and accept the inherent risks of transmitting data over the internet.
              </p>
            </section>

            {/* 11. Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Disclaimer of Warranties</h2>
              <p className="uppercase font-semibold">
                THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, REVIEWHUB EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-2 uppercase font-semibold">
                <li>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT;</li>
                <li>WARRANTIES RELATING TO THE ACCURACY, RELIABILITY, COMPLETENESS, OR TIMELINESS OF THE SERVICE, ITS CONTENT, OR ANY AI-GENERATED CONTENT;</li>
                <li>WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, VIRUS-FREE, OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION;</li>
                <li>WARRANTIES THAT ANY DEFECTS OR ERRORS WILL BE CORRECTED;</li>
                <li>WARRANTIES REGARDING THE RESULTS THAT MAY BE OBTAINED FROM USE OF THE SERVICE;</li>
                <li>WARRANTIES THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS.</li>
              </ul>
              <p>
                You use the Service at your own risk. No advice, information, or statement, whether oral or written, obtained from ReviewHub or through the Service shall create any warranty not expressly stated in these Terms. Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you, in which case such exclusions shall apply to the maximum extent permitted by applicable law.
              </p>
            </section>

            {/* 12. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Limitation of Liability</h2>
              <p className="uppercase font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL REVIEWHUB, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, SUCCESSORS, ASSIGNS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY OF THE FOLLOWING, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT REVIEWHUB HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any indirect, incidental, special, consequential, punitive, or exemplary damages;</li>
                <li>Loss of profits, revenue, data, business opportunities, goodwill, or anticipated savings;</li>
                <li>Cost of procurement of substitute goods or services;</li>
                <li>Business interruption or loss of use;</li>
                <li>Damages arising from unauthorized access to or alteration of your transmissions or data;</li>
                <li>Damages arising from third-party actions, content, or services;</li>
                <li>Damages arising from AI-generated content, whether published or unpublished;</li>
                <li>Any other pecuniary or non-pecuniary loss.</li>
              </ul>
              <p className="uppercase font-semibold">
                IN ANY CASE, THE TOTAL AGGREGATE LIABILITY OF REVIEWHUB FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE TOTAL AMOUNT YOU PAID TO REVIEWHUB IN THE THREE (3) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) FIFTY DOLLARS ($50.00 USD).
              </p>
              <p>
                This limitation of liability is a fundamental element of the agreement between you and ReviewHub and shall apply even if any limited remedy fails of its essential purpose. Some jurisdictions do not allow certain limitations of liability, so some limitations may not apply to you, in which case liability shall be limited to the maximum extent permitted by applicable law.
              </p>
            </section>

            {/* 13. Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">13. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless ReviewHub, its officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including but not limited to reasonable attorneys' fees and legal costs) arising from or relating to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your access to or use of the Service;</li>
                <li>Your violation or alleged violation of these Terms;</li>
                <li>Your violation of any third-party right, including any intellectual property, privacy, or proprietary right;</li>
                <li>Your violation of any applicable law, rule, or regulation;</li>
                <li>Any content you submit, post, publish, or transmit through the Service, including AI-generated content you choose to publish;</li>
                <li>Any activity conducted through your account, whether authorized by you or not;</li>
                <li>Any misrepresentation made by you;</li>
                <li>Any dispute between you and any third party, including your customers, arising from or related to your use of the Service.</li>
              </ul>
              <p>
                ReviewHub reserves the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate with our defense of such claims. You agree not to settle any matter without the prior written consent of ReviewHub.
              </p>
            </section>

            {/* 14. Dispute Resolution and Arbitration */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">14. Dispute Resolution and Arbitration</h2>
              <p className="font-semibold">
                PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT AND TO HAVE A JURY TRIAL.
              </p>
              <p>
                <strong>Mandatory Arbitration:</strong> Any dispute, claim, or controversy arising out of or relating to these Terms or the Service, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by binding arbitration administered by a recognized arbitration body in accordance with its rules. The arbitration shall take place in the jurisdiction where ReviewHub is incorporated, and the language of the arbitration shall be English.
              </p>
              <p>
                <strong>Class Action Waiver:</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION AGAINST REVIEWHUB.
              </p>
              <p>
                <strong>Informal Resolution:</strong> Before initiating any arbitration or legal proceeding, you agree to first contact us at support@reviewhub.com and attempt to resolve the dispute informally for at least thirty (30) days. If the dispute is not resolved within that period, either party may proceed with arbitration.
              </p>
              <p>
                <strong>Exceptions:</strong> Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights.
              </p>
            </section>

            {/* 15. Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">15. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ReviewHub is incorporated, without regard to its conflict of law provisions. To the extent that any lawsuit or court proceeding is permitted hereunder, you agree to submit to the exclusive personal jurisdiction of the courts located in that jurisdiction, and you waive any objection to jurisdiction, venue, or inconvenient forum.
              </p>
            </section>

            {/* 16. Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">16. Intellectual Property</h2>
              <p>
                The Service, including its original content, features, functionality, design, logos, trademarks, and all associated intellectual property, is and shall remain the exclusive property of ReviewHub and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ReviewHub.
              </p>
              <p>
                Nothing in these Terms grants you any right, title, or interest in or to the Service or any of ReviewHub's intellectual property, except for the limited, revocable, non-exclusive, non-transferable, non-sublicensable license to access and use the Service in accordance with these Terms during the term of your active subscription.
              </p>
            </section>

            {/* 17. Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">17. Acceptable Use Policy</h2>
              <p>
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable local, state, national, or international law or regulation;</li>
                <li>Post, publish, or distribute fraudulent, misleading, or deceptive review responses;</li>
                <li>Engage in review manipulation, fake review generation, or any form of fraudulent business practices;</li>
                <li>Interfere with, disrupt, or attempt to gain unauthorized access to the Service, its servers, or connected networks;</li>
                <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Service;</li>
                <li>Use any automated system, including bots, scrapers, or crawlers, to access the Service beyond the intended functionality;</li>
                <li>Attempt to circumvent any security features, usage limits, or access controls;</li>
                <li>Use the Service to harass, abuse, threaten, or defame any person or entity;</li>
                <li>Transmit any viruses, malware, or other malicious code;</li>
                <li>Resell, sublicense, or commercially exploit the Service without our express written consent.</li>
              </ul>
              <p>
                Violation of this acceptable use policy may result in immediate suspension or termination of your account without notice or refund.
              </p>
            </section>

            {/* 18. Service Availability and Modifications */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">18. Service Availability and Modifications</h2>
              <p>
                We do not guarantee that the Service will be available at all times. The Service may be subject to downtime for maintenance, updates, or unforeseen technical issues. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify, update, or discontinue any feature or aspect of the Service at any time without prior notice;</li>
                <li>Impose limits on certain features or restrict access to parts or all of the Service;</li>
                <li>Change the AI models or third-party services used to provide features;</li>
                <li>Suspend or terminate accounts that violate these Terms or that we determine, in our sole discretion, pose a risk to the Service or other users.</li>
              </ul>
              <p>
                ReviewHub shall not be liable for any modification, suspension, or discontinuance of the Service or any part thereof.
              </p>
            </section>

            {/* 19. Force Majeure */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">19. Force Majeure</h2>
              <p>
                ReviewHub shall not be liable for any failure or delay in performing its obligations under these Terms to the extent that such failure or delay results from circumstances beyond our reasonable control, including but not limited to: acts of God, natural disasters, pandemics, epidemics, war, terrorism, riots, civil unrest, government actions or restrictions, sanctions, embargoes, power failures, internet or telecommunications failures, cyberattacks, third-party service outages, strikes, labor disputes, or any other event beyond our reasonable control.
              </p>
            </section>

            {/* 20. Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">20. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time, at our sole discretion. Changes will be effective immediately upon posting the updated Terms on the Service. Your continued use of the Service after any changes constitutes your acceptance of the modified Terms. It is your responsibility to review these Terms periodically for changes. If you do not agree with the updated Terms, your sole remedy is to discontinue using the Service.
              </p>
            </section>

            {/* 21. Severability */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">21. Severability</h2>
              <p>
                If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it enforceable, or if it cannot be modified, it shall be severed from these Terms. The remaining provisions shall continue in full force and effect, and the invalid provision shall be replaced by a valid provision that most closely achieves the original economic and legal intent of the invalid provision.
              </p>
            </section>

            {/* 22. Entire Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">22. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any other legal notices or agreements published by us on the Service, constitute the entire agreement between you and ReviewHub concerning the Service and supersede all prior or contemporaneous agreements, understandings, representations, and warranties, both written and oral, regarding the Service. No waiver of any provision of these Terms shall be deemed a further or continuing waiver of such provision or any other provision, and our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
              </p>
            </section>

            {/* 23. Assignment */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">23. Assignment</h2>
              <p>
                You may not assign or transfer these Terms, or any rights or obligations hereunder, without our prior written consent. ReviewHub may assign or transfer these Terms, in whole or in part, without restriction and without your consent, including in connection with a merger, acquisition, corporate restructuring, or sale of all or substantially all of our assets.
              </p>
            </section>

            {/* 24. Survival */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">24. Survival</h2>
              <p>
                The following sections shall survive any termination or expiration of these Terms: AI-Generated Content Disclaimer (Section 3), Disclaimer of Warranties (Section 11), Limitation of Liability (Section 12), Indemnification (Section 13), Dispute Resolution and Arbitration (Section 14), Governing Law and Jurisdiction (Section 15), Intellectual Property (Section 16), and any other provisions that by their nature should survive termination.
              </p>
            </section>

            {/* 25. Contact */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">25. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                <strong>ReviewHub</strong><br />
                Email: <a href="mailto:support@reviewhub.com" className="text-blue-600 hover:underline">support@reviewhub.com</a>
              </p>
            </section>

            {/* Acknowledgment */}
            <section className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-semibold text-slate-900">
                BY CREATING AN ACCOUNT, SUBSCRIBING TO THE SERVICE, REACTIVATING A SUBSCRIPTION, OR CONTINUING TO USE THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS IN THEIR ENTIRETY.
              </p>
            </section>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} ReviewHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
