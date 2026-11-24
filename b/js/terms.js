// Page B copy per Google Ads search term (?term=<slug>).
//
// b/index.html holds the default copy, which is what a visitor sees when the URL has no
// "term" or one this table does not know. When the URL names a known term, this file swaps
// the texts listed for that term and leaves everything else as it is. Only text changes:
// no class, layout or image is touched.
//
// It is loaded synchronously from the end of <main> and only when the URL has "term=",
// so the swap happens before the first paint and costs nothing to other visitors.
// Source of the copy: copies-page-b/copies-google.md.
//
// Hero titles are written line by line: each line of .hero__title never wraps (white-space:
// nowrap), so a line is kept no wider than "a clear next step.", the widest line of the default title,
// which is what fits a 360 px phone (checked in Chrome at 360 to 1536 px). A line marked
// with true is set in <em>, as in the default title.
(function () {
  var SUPPORT = 'Meet Patrícia Viana online for a 45-minute strategy session. You receive a written summary. The €95 fee is credited towards our legal fees if you engage us.';

  var TERMS = {
    'retirement-visa': {
      title: 'Portugal Retirement Visa Advice | Viana Consultancy',
      eyebrow: 'Retirement in Portugal',
      h1: [['Could you'], ['retire in'], ['Portugal on'], ['your pension?', true]],
      lede: 'Tell us what you expect to live on and how much of the year you hope to spend in Portugal. Patrícia can assess whether the D7 fits the retirement you have in mind.',
      support: SUPPORT,
      cta: 'Discuss my retirement plans',
      situationsH2: ['What will your ', 'retirement income look like?'],
      card1: ['Your pension has already started', 'An award letter and regular deposits tell different parts of the story. Discuss which records would help explain your income.'],
      planningH2: 'Plan around the year you want to spend in Portugal.',
      planningLede: 'Bring up visits to family abroad so your lawyer can discuss how extended stays away could affect your residence plans.',
      faq1: ['Can I discuss a pension that has not started yet?', 'Yes. Tell us when payments are due to begin. We can identify which questions to resolve before choosing when to apply.']
    },
    'retire-from-usa': {
      title: 'Retiring in Portugal from the USA | Viana Consultancy',
      eyebrow: 'For US retirees and couples',
      h1: [['From the US'], ['to Portugal, with'], ['a retirement plan'], ['for both of you.', true]],
      lede: 'One of you may retire first. One may receive most of the pension income. Discuss how to prepare for the move together and what each of you can organise from the US.',
      support: SUPPORT,
      cta: 'Plan our retirement move',
      situationsH2: ['What needs to line up ', 'for both of you?'],
      card1: ['You have different retirement dates', 'Explain when each of you expects to stop working and move. Your lawyer can consider both timelines in the same assessment.'],
      planningH2: 'Know what to arrange before leaving the US.',
      planningLede: 'Work through pension records, housing decisions and trips back to see family before fixing a departure date.',
      faq1: ['Can we discuss our plans together?', 'Yes. Bring both retirement dates and describe whose income you expect to rely on. Your written summary can cover both of you.']
    },
    'move-from-usa': {
      title: 'Moving to Portugal from the USA | Viana Consultancy',
      eyebrow: 'Planning your move from the US',
      h1: [['Moving from'], ['the US to'], ['Portugal?'], ['Decide what', true], ['comes first.', true]],
      lede: 'Before you sign a lease or give notice at work, speak with a Lisbon lawyer about how you will earn a living, who is moving and which visa routes are worth exploring.',
      support: SUPPORT,
      cta: 'Map out my move',
      situationsH2: ['Which decision is ', 'coming up first?'],
      card1: ['A lease is waiting for your signature', 'Tell us what you have been asked to sign and when. We can discuss where housing evidence fits into your visa preparations.'],
      planningH2: 'Put your US departure and Portuguese paperwork on one timeline.',
      planningLede: 'Start with the date you can control, such as the end of a lease. Identify the decisions that depend on an appointment or a visa decision.',
      faq1: ['Should I book a session before choosing a visa?', 'Yes. Describe your work, income and household. Comparing suitable routes is part of the planning session.']
    },
    'us-citizens-visa': {
      title: 'Portugal Visa Options for US Citizens | Viana Consultancy',
      eyebrow: 'Visa advice for US citizens',
      h1: [['Which'], ['Portuguese visa'], ['fits your plans'], ['as a US citizen?', true]],
      lede: 'Your US passport is a starting point. Whether you intend to work remotely, draw a pension or join a partner gives your lawyer a clearer picture of the routes to assess.',
      support: SUPPORT,
      cta: 'Discuss my visa options',
      situationsH2: ['What do you intend ', 'to do in Portugal?'],
      card1: ['You have a US passport and live abroad', 'Tell us where you currently live. Your lawyer can consider where to apply alongside which visa fits your plans.'],
      planningH2: 'Compare the routes against your circumstances.',
      planningLede: 'Bring a short account of your income and work. Leave with a written summary of the options discussed and the questions still open.',
      faq1: ['What if my partner has a different nationality?', 'Mention both nationalities and where you each live. Your lawyer can assess how your circumstances fit together.']
    },
    'residency-us-citizens': {
      title: 'Portuguese Residency for US Citizens | Viana Consultancy',
      eyebrow: 'Residence planning for Americans',
      h1: [['What comes'], ['after the visa'], ['when Portugal'], ['becomes home?', true]],
      lede: 'Plan beyond the flight from the US. Ask what to keep from your visa file, how to prepare for the AIMA stage and what support you can request through your first residence card.',
      support: SUPPORT,
      cta: 'Discuss my residence plans',
      situationsH2: ['Where are you ', 'on the path to residence?'],
      card1: ['You already have your visa', 'Tell us what has been issued and whether you have an appointment. We can review the next stage with you.'],
      planningH2: 'Prepare for the handover from visa to residence permit.',
      planningLede: 'Review what you have filed, what you may need at AIMA and which parts of the residence process you want a lawyer to handle.',
      faq1: ['Can representation cover my first residence card?', 'Yes. The full package can include support through your first card. Your proposal identifies the stages covered. In-person attendance at AIMA requires a separate agreement.']
    },
    'd7-visa': {
      title: 'Portugal D7 Visa Legal Advice | Viana Consultancy',
      eyebrow: 'Portugal D7 visa',
      h1: [['Is the D7'], ['the right way'], ['for you to move'], ['to Portugal?', true]],
      lede: 'If a pension, rent or dividends will support your life in Portugal, talk through the D7 with Patrícia. She will consider your income alongside any work you expect to continue.',
      support: SUPPORT,
      cta: 'Explore my D7 options',
      situationsH2: ['How would you ', 'support yourself in Portugal?'],
      card1: ['You have more than one income source', 'Describe each source and whether it will continue after you move. Your lawyer can assess the overall picture.'],
      planningH2: 'Decide whether to pursue the D7 before building the file.',
      planningLede: 'Review the route, the people applying and the evidence you already hold. Get a written summary to guide your next decision.',
      faq1: ['Do I need to know that I qualify?', 'You can start with that question. The session gives you time to discuss the basis for a D7 application and any points that need closer review.']
    },
    'd7-requirements': {
      title: 'Portugal D7 Visa Requirements Review | Viana Consultancy',
      eyebrow: 'D7 eligibility and evidence',
      h1: [['What would'], ['you need'], ['to show for'], ['a D7 visa?', true]],
      lede: 'A checklist can name a document. It cannot tell you whether yours explains a recent change in income. Ask a lawyer to identify what your file already shows and where the evidence is thin.',
      support: SUPPORT,
      cta: 'Review my D7 requirements',
      situationsH2: ['Which requirement is ', 'hardest to document?'],
      card1: ['Your records tell different stories', 'If a statement shows a deposit under a different name from the agreement, flag it for review before arranging translations.'],
      planningH2: 'Find the gaps before paying for paperwork.',
      planningLede: 'Review your income evidence, housing documents and household details. Clarify which records need further work and which expenses to expect.',
      faq1: ['Should I order apostilles and translations now?', 'Ask us to review which documents you plan to use first. We can discuss the form and timing before you incur those costs.']
    },
    'd7-application': {
      title: 'Portugal D7 Visa Application Process | Viana Consultancy',
      eyebrow: 'Preparing a D7 application',
      h1: [['Ready to apply'], ['for the D7?'], ['Put the steps', true], ['in order.', true]],
      lede: 'You may already have your tax number or a folder of documents. Tell us what is done so we can plan the remaining work around the bank, your consular appointment and the residence stage.',
      support: SUPPORT,
      cta: 'Plan my D7 application',
      situationsH2: ['Where has your ', 'application reached?'],
      card1: ['You are preparing for an appointment', 'Share the appointment date and the parts of the file still in progress. Your lawyer can focus the review on the work ahead.'],
      planningH2: 'Know who handles each step.',
      planningLede: 'Discuss who prepares the bank file, who monitors appointment availability and when you will hear from the legal team.',
      faq1: ['Can you take over just part of the process?', 'Yes. Identify the work you have completed. We can propose a document review or assistance with agreed stages.']
    },
    'passive-income-visa': {
      title: 'Portugal D7 Visa for Passive Income | Viana Consultancy',
      eyebrow: 'Rental income, pensions and dividends',
      h1: [['Can your'], ['passive income'], ['support a D7'], ['application?', true]],
      lede: 'Rent may arrive monthly and dividends only a few times a year. Patrícia can review where the money comes from, how often you receive it and how to explain the pattern in your file.',
      support: SUPPORT,
      cta: 'Discuss my income sources',
      situationsH2: ['How does your income ', 'reach you?'],
      card1: ['Your investment payments fluctuate', 'Describe the payment schedule and any one-off receipts so your lawyer can distinguish recurring income from accumulated savings.'],
      planningH2: 'Connect each payment to its source.',
      planningLede: 'Discuss which agreements, statements or payment records help explain the money you expect to rely on in Portugal.',
      faq1: ['Can we review income from several properties?', 'Yes. Describe the rental arrangements and how payments reach you. Your lawyer can advise what evidence would make the income easier to follow.']
    },
    'd8-digital-nomad': {
      title: 'Portugal D8 Digital Nomad Visa Advice | Viana Consultancy',
      eyebrow: 'Remote work from Portugal',
      h1: [['Could you keep'], ['your remote work'], ['and move to'], ['Portugal on a D8?', true]],
      lede: 'You may have one US employer or several overseas clients. Talk through your working arrangements and the records that explain who pays you and what you do from Portugal.',
      support: SUPPORT,
      cta: 'Discuss my remote work',
      situationsH2: ['How is your ', 'remote work arranged?'],
      card1: ['You invoice several clients', 'Show how your contracts, invoices and payments fit together. A legal review can identify questions your paperwork leaves open.'],
      planningH2: 'Review your D8 file before you submit it.',
      planningLede: 'If you prefer to prepare the application yourself, ask for a defined document review with written fees and exclusions.',
      faq1: ['Can I book a review of a D8 file I prepared myself?', 'Yes. Tell us which parts are ready and where you want legal input. We will set out the proposed review in writing.']
    },
    'd7-visa-lawyer': {
      title: 'Portugal D7 Visa Lawyer for Applicants | Viana Consultancy',
      eyebrow: 'Direct access to a D7 lawyer',
      h1: [['How much'], ['of your D7'], ['application'], ['should a lawyer'], ['handle?', true]],
      lede: 'Speak directly with Patrícia Viana about the part you want checked or the stages you want her team to manage. Compare the scope and fees before deciding how to proceed.',
      support: SUPPORT,
      cta: 'Discuss D7 representation',
      situationsH2: ['Where would legal help ', 'make a difference?'],
      card1: ['You want a second look before filing', 'Identify the documents you have doubts about. Ask for a proposal that specifies what the lawyer will review.'],
      planningH2: 'See what your D7 legal fees cover.',
      planningLede: 'Compare a review of your own file with broader representation. The proposal identifies third-party expenses and the point at which the agreed work ends.',
      faq1: ['Can I compare document review with full representation?', 'Yes. Tell us how much you want to handle yourself. The written proposal can set out both levels of assistance.']
    },
    'immigration-lawyer': {
      title: 'Immigration Lawyer in Lisbon, Portugal | Viana Consultancy',
      eyebrow: 'Portuguese immigration counsel',
      h1: [['Speak to a'], ['Portuguese'], ['immigration'], ['lawyer about'], ['your next step.', true]],
      lede: 'Whether you are choosing a visa or waiting for news on an existing file, start with the decision in front of you. Patrícia Viana can assess your position and explain what legal work would involve.',
      support: 'You speak directly with a lawyer in Lisbon. Tell us whether you are planning a move or need advice about a case already underway.',
      cta: 'Describe my immigration matter',
      situationsH2: ['What brings you ', 'to a lawyer today?'],
      card1: ['You have heard nothing about an existing case', 'Tell us where you filed, when you last heard from the authority and whether a previous representative is involved.'],
      planningH2: 'Match the consultation to the issue.',
      planningLede: 'For a planned move, start with a strategy session. A refusal, a pending deadline or a complex existing case calls for a 60-minute legal consultation with a written assessment.',
      faq1: ['Can you review a matter another lawyer handled?', 'Yes. Describe the stage reached and flag any notice or deadline. We can explain how to arrange a review and discuss possible representation.']
    },
    'visa-denied': {
      title: 'Portugal Visa Refusal and Appeal Advice | Viana Consultancy',
      eyebrow: 'Portuguese visa refusals',
      h1: [['Portuguese'], ['visa refused?'], ['Start with', true], ['the notice and', true], ['the date.', true]],
      lede: 'Keep the decision and proof of when you received it. Patrícia can review the reasons given, check the applicable deadline and assess whether a response or appeal is available.',
      support: 'The 60-minute legal consultation includes a written assessment. The consultation fee is credited towards further legal work if you engage us.',
      cta: 'Ask about a refusal',
      situationsH2: ['What did the authority ', 'send you?'],
      card1: ['You received a proposed refusal', 'Keep the full notice, including the reasons and any instructions. Tell us when and how it reached you.'],
      planningH2: 'Establish the deadline before choosing a response.',
      planningLede: 'In a 60-minute legal consultation, Patrícia reviews the notice and the history of your application. You receive a written assessment of the options available.',
      faq1: ['Should I get in touch about a proposed refusal?', 'Yes. Identify it as a proposed refusal and tell us the notification date. Have the notice and proof of receipt ready for your lawyer.'],
      // Extra blocks only this term replaces.
      micro: 'Mention any deadline printed on the notice in your first message.',
      marks: ['Review of the refusal grounds', 'Notification date check', 'Written legal assessment'],
      situationsLede: 'The wording of the notice and the stage of the case guide the review.',
      cards: [
        null,
        ['You received a final decision', 'Keep every page and the email or envelope that accompanied it.'],
        ['You already submitted a response', 'Gather your reply and any confirmation of delivery.'],
        ['Another lawyer filed the application', 'Identify who holds the file and which documents you can access today.']
      ],
      situationsClose: 'Start with the date and the decision. We can explain how to share the file.',
      questions: [
        ['When were you notified?', 'Your lawyer checks the date against the notice and the record of delivery.'],
        ['Why did the authority object?', 'Review each reason alongside the evidence already filed.'],
        ['What can you do next?', 'Discuss the responses available at this stage and what each would involve.'],
        ['Who needs to act?', 'Agree who will gather the records and who will handle any further work.']
      ],
      supportH2: ['Get legal help ', 'at the stage your case has reached.'],
      supportLede: 'Start with an assessment. Any further response or representation is set out in a separate written proposal.',
      scopes: [
        ['Legal consultation', 'Review the decision with Patrícia.', ['60-minute consultation', 'Review of dates and grounds', 'Written assessment']],
        ['Review of your file', 'Examine the records relevant to the refusal.', ['Original submission', 'Supporting evidence', 'Correspondence from the authority']],
        ['Response or appeal', 'Discuss representation if a further step is available.', ['Proposed legal work', 'Responsibilities and fees', 'Steps agreed before work begins']]
      ],
      faqRest: [
        ['What should I have ready?', 'Gather the decision, proof of notification and a copy of what you filed.'],
        ['What if my partner also received a notice?', 'Mention both notices and the date each was received.'],
        ['Can you assess an appeal?', 'Patrícia can review the grounds and explain which options are available.'],
        ['Can I change representatives?', 'Tell us who has acted for you and where the file is held so we can discuss a handover.'],
        ['Can you predict the outcome?', 'The assessment covers the arguments and evidence. The authority or court makes the decision.'],
        ['What if the booking calendar has no suitable slot?', 'Mention the deadline when you enquire so the team can check availability.'],
        ['Does the enquiry appoint a lawyer?', 'Representation begins once you and the firm agree the work and engagement terms. Sending the form does not suspend a deadline.']
      ],
      contactH2: ['Tell us when ', 'you received the notice.'],
      contactLede: 'Mention the authority, the notification date and any deadline stated. We will explain how to share the decision for review.',
      placeholder: 'What did you receive, and on what date?'
    }
  };

  var term = '';
  try { term = (new URLSearchParams(location.search).get('term') || '').trim().toLowerCase(); } catch (e) { return; }
  if (!Object.prototype.hasOwnProperty.call(TERMS, term)) return; // unknown or empty: keep the default copy
  var c = TERMS[term];

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return document.querySelectorAll(sel); };
  function text(el, value) { if (el && value != null) el.textContent = value; }
  // [plain, emphasised]: the second part goes in <em>, like the default headings.
  function split(el, parts) {
    if (!el || !parts) return;
    var em = document.createElement('em');
    em.textContent = parts[1];
    el.replaceChildren(document.createTextNode(parts[0]), em);
  }
  // h3 + p inside a card or list item.
  function card(li, pair) {
    if (!li || !pair) return;
    text(li.querySelector('h3'), pair[0]);
    text(li.querySelector('p'), pair[1]);
  }
  function qa(details, pair) {
    if (!details || !pair) return;
    text(details.querySelector('summary > span'), pair[0]);
    text(details.querySelector('.qa__a > p'), pair[1]);
  }

  document.title = c.title;

  /* hero */
  text($('.hero__text > .eyebrow'), c.eyebrow);
  var h1 = $('#hero-title');
  if (h1 && c.h1) {
    var lines = c.h1.map(function (l, i) {
      var outer = document.createElement('span');
      outer.className = 'line';
      var inner = document.createElement('span');
      // b.css staggers lines 2 to 4 by .07s; a fifth line keeps the same rhythm.
      if (i > 3) inner.style.animationDelay = (i * 0.07).toFixed(2) + 's';
      if (l[1]) {
        var em = document.createElement('em');
        em.textContent = l[0];
        inner.appendChild(em);
      } else {
        inner.textContent = l[0];
      }
      outer.appendChild(inner);
      return outer;
    });
    h1.replaceChildren.apply(h1, lines);
  }
  text($('.hero__lede'), c.lede);
  text($('.hero__support'), c.support);
  var cta = $('.hero__action .btn');
  if (cta && c.cta && cta.firstChild && cta.firstChild.nodeType === 3) cta.firstChild.nodeValue = c.cta + ' ';
  text($('.hero__micro'), c.micro);
  if (c.marks) $$('.hero__marks li').forEach(function (li, i) { text(li, c.marks[i]); });

  /* situations */
  split($('#situations-title'), c.situationsH2);
  text($('.situations .sec-head__lede'), c.situationsLede);
  var sheets = $$('.situations .sheet');
  card(sheets[0], c.card1);
  if (c.cards) c.cards.forEach(function (pair, i) { if (pair) card(sheets[i], pair); });
  text($('.situations__close'), c.situationsClose);

  /* planning */
  text($('#planning-title'), c.planningH2);
  text($('.planning__head .sec-head__lede'), c.planningLede);
  if (c.questions) $$('.planning .question').forEach(function (li, i) { card(li, c.questions[i]); });

  /* support */
  split($('#support-title'), c.supportH2);
  text($('.support .sec-head__lede'), c.supportLede);
  if (c.scopes) $$('.support .scope').forEach(function (art, i) {
    var s = c.scopes[i];
    if (!s) return;
    text(art.querySelector('h3'), s[0]);
    text(art.querySelector('p'), s[1]);
    art.querySelectorAll('li').forEach(function (li, j) { text(li, s[2][j]); });
  });

  /* faq: the term's question takes the first place */
  var items = $$('.faq .qa');
  qa(items[0], c.faq1);
  if (c.faqRest) c.faqRest.forEach(function (pair, i) { qa(items[i + 1], pair); });

  /* contact */
  split($('#contact-title'), c.contactH2);
  text($('.contact__head .sec-head__lede'), c.contactLede);
  var msg = document.getElementById('f-message');
  if (msg && c.placeholder) msg.placeholder = c.placeholder;
})();
