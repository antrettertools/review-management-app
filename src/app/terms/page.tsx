'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'

export default function TermsPage() {
  const effectiveDate = 'March 21, 2026'
  const lastUpdated = 'March 21, 2026'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-indigo-700 rounded-lg flex items-center justify-center">
              <Star size={16} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ReviewHub</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/login"
              className="px-5 py-2.5 text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all text-sm">
              Sign In
            </Link>
            <Link href="/auth/signup"
              className="px-5 py-2.5 bg-gradient-to-b from-blue-800 to-blue-900 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-900/20 text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          {/* Terms header */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-10 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">Terms and Conditions</h1>
              <div className="flex items-center gap-4 text-sm text-blue-200/70">
                <span>Effective: {effectiveDate}</span>
                <span className="text-blue-400/30">|</span>
                <span>Updated: {lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed text-[15px]">

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Agreement to Terms</h2>
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

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
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

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. AI-Generated Content Disclaimer</h2>
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

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Third-Party Integrations and Services</h2>
                <p>
                  The Service integrates with third-party platforms and services, including but not limited to Google Business Profile, Stripe, and Anthropic. You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of third-party integrations is subject to the respective terms of service, privacy policies, and usage policies of those third-party providers, which you are solely responsible for reviewing and complying with.</li>
                  <li>ReviewHub is not responsible for the availability, accuracy, functionality, security, or performance of any third-party services.</li>
                  <li>By connecting your third-party accounts (such as Google Business Profile), you authorize ReviewHub to access, retrieve, store, and process data from those accounts as necessary to provide the Service.</li>
                  <li>ReviewHub may store OAuth tokens, API credentials, and other authorization data necessary to maintain your third-party connections.</li>
                  <li>We are not liable for any actions taken by third-party platforms in response to content posted through our Service.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. User Accounts and Security</h2>
                <p>
                  You are solely responsible for maintaining the confidentiality of your account credentials. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information during registration and keep it updated.</li>
                  <li>Not share your account credentials with any third party.</li>
                  <li>Immediately notify us of any unauthorized use of your account or any security breach.</li>
                  <li>Accept full responsibility for all activities that occur under your account, whether authorized by you or not.</li>
                </ul>
                <p>
                  ReviewHub shall not be liable for any loss, damage, or harm arising from your failure to maintain the security of your account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Subscription, Billing, and Payments</h2>
                <p>
                  Access to the Service requires an active paid subscription. By subscribing, you agree to the following:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Recurring Charges:</strong> Subscriptions are billed on a recurring monthly basis at the rate displayed at the time of purchase (currently $39.99/month for ReviewHub Pro).</li>
                  <li><strong>Price Changes:</strong> We reserve the right to change subscription pricing at any time. Price changes will take effect at the start of your next billing cycle following notice.</li>
                  <li><strong>No Refunds:</strong> All subscription fees are non-refundable except where required by applicable law.</li>
                  <li><strong>Failed Payments:</strong> If a payment fails, we may suspend or restrict your access to the Service without notice.</li>
                  <li><strong>Taxes:</strong> All fees are exclusive of applicable taxes. You are responsible for paying all such taxes.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Cancellation and Reactivation</h2>
                <p>You may cancel your subscription at any time. Upon cancellation:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your access to the Service will be immediately restricted upon cancellation or at the end of your current billing period, at our sole discretion.</li>
                  <li>Your data will be retained for a reasonable period to allow for reactivation, but we reserve the right to delete your data at any time after cancellation.</li>
                  <li>We are under no obligation to retain, maintain, or provide access to your data after cancellation.</li>
                </ul>
                <p>
                  If you choose to reactivate your subscription, you agree to these Terms as they exist at the time of reactivation.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">8. Account Deletion</h2>
                <p>
                  You may request permanent deletion of your account at any time. By confirming account deletion, you acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All account data will be permanently and irreversibly deleted.</li>
                  <li>This action is irreversible and cannot be undone. ReviewHub cannot recover deleted data under any circumstances.</li>
                  <li>Any content you have published to third-party platforms through the Service will not be removed by account deletion.</li>
                  <li>You waive any and all claims against ReviewHub related to the deletion of your data.</li>
                  <li>Any outstanding subscription fees that accrued prior to deletion remain your responsibility.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">9. User Content and Data</h2>
                <p>
                  You retain ownership of the content you provide to the Service. However, by using the Service, you grant ReviewHub a worldwide, non-exclusive, royalty-free, transferable, sublicensable license to use, process, store, reproduce, modify, and display your content solely as necessary to provide, maintain, and improve the Service.
                </p>
                <p>
                  You represent and warrant that you have all necessary rights, permissions, and consents to provide your content to the Service. You shall not use the Service to post any content that is unlawful, defamatory, harassing, abusive, fraudulent, obscene, or otherwise objectionable.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">10. Privacy and Data Processing</h2>
                <p>
                  By using the Service, you acknowledge that we collect, process, and store personal data including but not limited to: your name, email address, payment information (processed by Stripe), business information, customer review data from connected platforms, AI-generated content, OAuth tokens, usage analytics, and IP addresses.
                </p>
                <p>
                  You consent to the transmission of your data to third-party service providers including Supabase, Stripe, Anthropic, and Google. We implement reasonable security measures but cannot guarantee absolute security of your data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">11. Disclaimer of Warranties</h2>
                <p className="uppercase font-semibold text-xs leading-relaxed">
                  THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, REVIEWHUB EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT; WARRANTIES RELATING TO THE ACCURACY, RELIABILITY, COMPLETENESS, OR TIMELINESS OF THE SERVICE OR ANY AI-GENERATED CONTENT; WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR AVAILABLE AT ANY PARTICULAR TIME; AND WARRANTIES REGARDING THE RESULTS THAT MAY BE OBTAINED FROM USE OF THE SERVICE.
                </p>
                <p>
                  You use the Service at your own risk. Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">12. Limitation of Liability</h2>
                <p className="uppercase font-semibold text-xs leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL REVIEWHUB BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES; LOSS OF PROFITS, REVENUE, DATA, BUSINESS OPPORTUNITIES, GOODWILL, OR ANTICIPATED SAVINGS; COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; OR ANY OTHER PECUNIARY OR NON-PECUNIARY LOSS.
                </p>
                <p className="uppercase font-semibold text-xs leading-relaxed">
                  THE TOTAL AGGREGATE LIABILITY OF REVIEWHUB SHALL NOT EXCEED THE GREATER OF (A) THE TOTAL AMOUNT YOU PAID TO REVIEWHUB IN THE THREE (3) MONTHS IMMEDIATELY PRECEDING THE EVENT, OR (B) FIFTY DOLLARS ($50.00 USD).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">13. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless ReviewHub from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses arising from or relating to your use of the Service, your violation of these Terms, your violation of any third-party right, any content you submit through the Service, or any activity conducted through your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">14. Dispute Resolution and Arbitration</h2>
                <p className="font-semibold text-sm">
                  PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT AND TO HAVE A JURY TRIAL.
                </p>
                <p>
                  <strong>Mandatory Arbitration:</strong> Any dispute arising out of or relating to these Terms or the Service shall be determined by binding arbitration. The arbitration shall take place in the jurisdiction where ReviewHub is incorporated.
                </p>
                <p>
                  <strong>Class Action Waiver:</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION.
                </p>
                <p>
                  <strong>Informal Resolution:</strong> Before initiating any arbitration, you agree to first contact us at support@reviewhub.com and attempt to resolve the dispute informally for at least thirty (30) days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">15. Governing Law and Jurisdiction</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ReviewHub is incorporated, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">16. Intellectual Property</h2>
                <p>
                  The Service, including its original content, features, functionality, design, logos, trademarks, and all associated intellectual property, is and shall remain the exclusive property of ReviewHub and its licensors.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">17. Acceptable Use Policy</h2>
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable law or regulation;</li>
                  <li>Post fraudulent, misleading, or deceptive review responses;</li>
                  <li>Engage in review manipulation or fake review generation;</li>
                  <li>Interfere with or attempt to gain unauthorized access to the Service;</li>
                  <li>Reverse engineer, decompile, or disassemble the Service;</li>
                  <li>Use any automated system beyond the intended functionality;</li>
                  <li>Harass, abuse, threaten, or defame any person or entity;</li>
                  <li>Transmit viruses, malware, or other malicious code;</li>
                  <li>Resell or commercially exploit the Service without our express consent.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">18. Service Availability and Modifications</h2>
                <p>
                  We do not guarantee that the Service will be available at all times. We reserve the right to modify, update, or discontinue any feature at any time without prior notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">19. Force Majeure</h2>
                <p>
                  ReviewHub shall not be liable for any failure or delay in performing its obligations under these Terms to the extent that such failure or delay results from circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemics, war, terrorism, government actions, power failures, internet failures, or cyberattacks.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">20. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after any changes constitutes your acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">21. Severability</h2>
                <p>
                  If any provision of these Terms is held to be invalid or unenforceable, such provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">22. Entire Agreement</h2>
                <p>
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and ReviewHub concerning the Service and supersede all prior agreements, understandings, representations, and warranties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">23. Assignment</h2>
                <p>
                  You may not assign or transfer these Terms without our prior written consent. ReviewHub may assign or transfer these Terms without restriction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">24. Survival</h2>
                <p>
                  The following sections shall survive any termination or expiration of these Terms: AI-Generated Content Disclaimer (Section 3), Disclaimer of Warranties (Section 11), Limitation of Liability (Section 12), Indemnification (Section 13), Dispute Resolution and Arbitration (Section 14), Governing Law (Section 15), and Intellectual Property (Section 16).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">25. Contact Information</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <p className="mt-2">
                  <strong>ReviewHub</strong><br />
                  Email: <a href="mailto:support@reviewhub.com" className="text-blue-600 hover:underline">support@reviewhub.com</a>
                </p>
              </section>

              {/* Acknowledgment */}
              <section className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200/60">
                <p className="font-semibold text-slate-900 text-xs leading-relaxed">
                  BY CREATING AN ACCOUNT, SUBSCRIBING TO THE SERVICE, REACTIVATING A SUBSCRIPTION, OR CONTINUING TO USE THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS IN THEIR ENTIRETY.
                </p>
              </section>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} ReviewHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
