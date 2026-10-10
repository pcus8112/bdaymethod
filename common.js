(function (root) {
  'use strict';
  const M = root.BdayMath, C = root.BDAY_CONFIG, I = root.BDAY_I18N;
  const pages = ['index', 'century', 'year', 'month', 'learn'];
  const stages = ['century', 'year', 'month', 'learn'];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paragraph = s => `<p>${escape(s)}</p>`;
  const list = values => `<ol>${values.map(s => `<li>${escape(s)}</li>`).join('')}</ol>`;
  const link = (page, lang, hash = '') => `${page}.html?lang=${lang}${hash}`;
  const signed = n => String(n).replace('-', '−');
  function title(page, t) { return page === 'index' ? `Bdaymethod — ${t.brand}` : `${t[page === 'learn' ? 'fullTitle' : page === 'legal' || page === 'privacy' ? 'legalTitle' : page === '404' ? 'notFound' : page + 'Title']} — Bdaymethod`; }
  function weekday(n, t) { return `${n} · ${t.weekdays[n - 1]}`; }
  function date(d, t) { return t.locale === 'en-US' ? `${t.months[d.month - 1]} ${d.day}, ${d.year}` : `${d.day}${t.locale === 'de-DE' ? '.' : ''} ${t.months[d.month - 1]} ${d.year}`; }
  function table(headers, rows) { return `<div class="table-wrap"><table><thead><tr>${headers.map(x=>`<th scope="col">${escape(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((x,i)=>i===0?`<th scope="row">${escape(x)}</th>`:`<td>${escape(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
  function centuryTable(t) { return table(t.centuryHeaders, [[1700,100,weekday(1,t)],[1800,200,weekday(6,t)],[1900,300,weekday(4,t)],[2000,0,weekday(3,t)]]); }
  function monthTable(t) { return table([t.month, t.common, t.leap],t.months.map((m,i)=>[m,M.reference(1981,i+1),M.reference(2000,i+1)])); }
  function dayStrip(t) { return `<div class="day-strip" aria-label="${escape(t.numberHelp)}">${t.weekdays.map((d,i)=>`<span><b>${i+1}</b>${escape(d)}</span>`).join('')}</div>`; }
  function header(page,lang,t) {
    return `<a class="skip-link" href="#main">${escape(t.skip)}</a><header class="site-header"><div class="site-shell header-inner"><a class="brand-link" href="${link('index',lang)}"><span class="brand-mark" aria-hidden="true">BDAY</span><span class="brand-copy"><strong>BDAYMETHOD</strong><small>${escape(t.brand)}</small></span></a><nav class="main-nav" aria-label="${escape(t.navigation)}">${pages.map((p,i)=>`<a href="${link(p,lang)}"${p===page?' aria-current="page"':''}>${escape(t.nav[i])}</a>`).join('')}</nav><div class="language-switcher js-only" aria-label="${escape(t.languages)}">${[['en','us','EN'],['fr-CA','ca','FR'],['de','de','DE']].map(([l,flag,short])=>`<a class="language-button${l===lang?' is-active':''}" href="${link(page,l)}" data-language="${l}" lang="${I[l].locale}" aria-label="${escape(I[l].name)}"${l===lang?' aria-current="true"':''}><img src="assets/flags/${flag}.svg" alt="" width="24" height="16"><small>${short}</small></a>`).join('')}</div></div></header>`;
  }
  function footer(lang,t) {
    return `<footer class="site-footer"><div class="site-shell footer-inner"><a class="sse-signet" href="${C.brandUrl}"><strong>Singer Shamrock Enterprises</strong><span>${escape(t.footerBrand)}</span></a><div class="footer-links"><span>${escape(t.operated)} ${escape(C.owner)}, ${escape(C.businessForm)} · ${escape(C.registration)}</span><a href="${link('legal',lang,'#imprint')}">${escape(t.imprint)}</a><a href="${link('privacy',lang)}">${escape(t.privacy)}</a><a href="${link('legal',lang,'#terms')}">${escape(t.terms)}</a></div></div></footer>`;
  }
  function solution(d,t,part='full') {
    const century=Math.floor(d.year/100)*100;
    const lines=[[t.centuryPart,`${century} ÷ 400 → ${t.remainder} ${century%400} → ${weekday(d.x,t)}`]];
    if(part!=='century') lines.push(
      [t.reducedLabel,`${String(d.a).padStart(2,'0')} − ${d.removed} = ${d.reduced}`],
      [t.fields.q,`${d.reduced} ÷ 4 → ${d.q} (${t.whole})`],
      [t.yearPart,`${d.reduced} + ${d.q} = ${d.sum}; ${d.sum} ÷ 7 → ${t.remainder} ${d.contribution}`],
      [t.yearAnchor,`${d.x} + ${d.contribution} = ${d.x+d.contribution} → ${weekday(d.z,t)}`]
    );
    if(!['century','year'].includes(part)) {
      if(part==='month') lines.splice(0,lines.length,[t.knownAnchor,weekday(d.z,t)]);
      lines.push([t.monthPart,`${date({...d,day:d.anchor},t)} → ${weekday(d.z,t)}`],
        [t.dayDifference,`${d.day} − ${d.anchor} = ${signed(d.offset)}`],
        [t.finalDay,`${d.z} ${d.offset<0?'−':'+'} ${Math.abs(d.offset)} = ${signed(d.z+d.offset)} → ${weekday(d.weekday,t)}`]);
    }
    return `<ol class="solution-list">${lines.map(([label,value])=>`<li><strong>${escape(label)}</strong><span>${escape(value)}</span></li>`).join('')}</ol>`;
  }
  function dateFields(t) {
    return `<div class="fields date-fields"><div class="field"><label for="calc-day">${escape(t.day)}</label><input id="calc-day" name="day" type="text" inputmode="numeric" maxlength="2" value="25" autocomplete="off" required></div><div class="field"><label for="calc-month">${escape(t.month)}</label><select id="calc-month" name="month">${t.months.map((m,i)=>`<option value="${i+1}"${i===11?' selected':''}>${escape(m)}</option>`).join('')}</select></div><div class="field"><label for="calc-year">${escape(t.year)}</label><input id="calc-year" name="year" type="text" inputmode="numeric" maxlength="4" value="1981" autocomplete="off" required></div></div>`;
  }
  function home(lang,t) {
    return `<section class="selector-hero"><div><p class="eyebrow">${escape(t.homeEyebrow)}</p><h1 class="display-title">${escape(t.heroA)} <span>${escape(t.heroB)}</span></h1><p class="lead">${escape(t.lead)}</p><p class="home-example">${escape(t.homeExample)}</p><a class="button button-primary home-start" href="${link('century',lang)}">${escape(t.start)}</a><p class="note">${escape(t.free)}</p><p class="brand-thought">${escape(t.tagline)}</p></div><div class="method-grid" aria-label="${escape(t.stages)}">${t.cards.map((c,i)=>`<a class="method-card" href="${link(stages[i],lang)}" data-number="0${i+1}"><span class="card-arrow" aria-hidden="true">↗</span><span class="card-kicker">${escape(c[0])}</span><h2>${escape(c[1])}</h2><p>${escape(c[2])}</p></a>`).join('')}</div></section><section class="home-calculator trainer-card js-only" id="calculator"><div class="trainer-content"><p class="eyebrow">BDAYMETHOD</p><h2>${escape(t.tryTitle)}</h2><p class="intro-copy">${escape(t.tryIntro)}</p><form id="date-form" novalidate>${dateFields(t)}<div class="actions"><button class="button button-primary" type="submit">${escape(t.calculate)}</button></div><div id="calc-result" class="result" role="status" aria-live="polite" aria-atomic="true"></div><details id="calc-solution" class="answer-details" hidden><summary>${escape(t.solution)}</summary><div id="calc-steps"></div></details></form><p class="note">${escape(t.calendar)}</p></div></section><section class="cross-promo"><h2>${escape(t.crossTitle)}</h2><p>${escape(t.crossText)}</p><a href="${C.bratsUrl}" class="text-link">${escape(t.crossLink)}</a></section><p class="note origin">${escape(t.origin)}</p>`;
  }
  function guide(page,t) {
    let content='';
    if(page==='century') content=`${paragraph(t.centuryGuide)}<div class="anchor-code" aria-label="1, 6, 4, 3"><span>1</span><span>6</span><span>4</span><span>3</span></div>${centuryTable(t)}${paragraph(t.centuryExample)}${paragraph(t.centuryRepeat)}`;
    if(page==='year') content=`${list(t.yearSteps)}<details><summary>${escape(t.why28)}</summary>${paragraph(t.why28Text)}</details>${paragraph(t.yearZero)}`;
    if(page==='month') content=`${paragraph(t.monthPairs)}${monthTable(t)}${paragraph(t.leapRule)}${list(t.monthSteps)}${paragraph(t.negative)}`;
    if(page==='learn') content=`${paragraph(t.fullGuide)}<p class="equation-example">${escape(t.fullExample)}</p><details><summary>${escape(t.cards[0][1])} · 1643</summary>${centuryTable(t)}</details><details><summary>${escape(t.why28)}</summary>${list(t.yearSteps)}${paragraph(t.why28Text)}</details><details><summary>${escape(t.monthTitle)}</summary>${monthTable(t)}${paragraph(t.leapRule)}</details>`;
    return `<section class="learning-guide"><h2>${escape(t.how)}</h2>${content}${dayStrip(t)}<p class="note">${escape(t.dayRule)}</p></section>`;
  }
  function keys(page,mode) {
    if(page==='century') return ['x'];
    if(mode==='mental') return [page==='year'?'z':'weekday'];
    if(page==='year') return ['x','removed','reduced','q','contribution','z'];
    if(page==='month') return ['anchor','offset','weekday'];
    return ['x','removed','reduced','q','contribution','z','anchor','offset','weekday'];
  }
  function field(key,t) {
    const isDay=['x','z','weekday'].includes(key);
    let control;
    if(isDay || key==='removed') {
      const options=isDay?t.weekdays.map((d,i)=>[i+1,`${i+1} · ${d}`]):[0,28,56,84].map(x=>[x,x]);
      control=`<select id="answer-${key}" name="${key}" required aria-describedby="feedback-${key}"><option value="">${escape(t.choose)}</option>${options.map(([v,label])=>`<option value="${v}">${escape(label)}</option>`).join('')}</select>`;
    } else control=`<input id="answer-${key}" name="${key}" type="text" inputmode="${key==='offset'?'text':'numeric'}" autocomplete="off" maxlength="5" required aria-describedby="feedback-${key}">`;
    return `<div class="field"><label for="answer-${key}">${escape(t.fields[key])}</label>${control}<p class="feedback" id="feedback-${key}"></p></div>`;
  }
  function trainer(page,t,state) {
    const d=M.details(state.task.year,state.task.month,state.task.day);
    return `<section class="trainer-card js-only" id="practice" aria-label="${escape(t.exercise)}"><div class="control-bar">${page==='century'?'':`<div class="control-group"><label for="training-mode">${escape(t.mode)}</label><select id="training-mode"><option value="guided"${state.mode==='guided'?' selected':''}>${escape(t.guided)}</option><option value="mental"${state.mode==='mental'?' selected':''}>${escape(t.mental)}</option></select></div>`}<div class="control-group"><label for="year-range">${escape(t.range)}</label><select id="year-range"><option value="regular"${state.range==='regular'?' selected':''}>${escape(t.regular)}</option><option value="extended"${state.range==='extended'?' selected':''}>${escape(t.extended)}</option></select></div></div><div class="trainer-content"><div class="problem-head"><div><p class="problem-label">${escape(t.exercise)}</p><h2 class="problem${['month','learn'].includes(page)?' date-problem':''}" id="problem" tabindex="-1">${escape(['century','year'].includes(page)?d.year:date(d,t))}</h2></div><div class="task-badge"><small>${escape(t.stats)}</small><strong id="score">${state.score}</strong></div></div>${page==='month'?`<p class="given-anchor">${escape(t.knownAnchor)}: <strong>${escape(weekday(d.z,t))}</strong> · ${escape(d.leap?t.leap:t.common)}</p>`:''}<form id="practice-form" novalidate><div class="fields">${keys(page,state.mode).map(k=>field(k,t)).join('')}</div><p class="note">${escape(t.numberHelp)}</p><div class="actions"><button class="button button-primary" type="submit">${escape(t.check)}</button><button class="button button-secondary" id="new-task" type="button">${escape(t.newTask)}</button><button class="button button-quiet" id="reveal" type="button">${escape(t.reveal)}</button></div><div id="practice-result" class="result" role="status" aria-live="polite" aria-atomic="true"></div><section id="practice-solution" class="answer-details" hidden><h3>${escape(t.solution)}</h3><div id="practice-steps"></div></section></form><p class="note stats-note">${escape(t.statsNote)}</p></div></section>`;
  }
  function trainingPage(page,lang,t,state) {
    const index=stages.indexOf(page), type=page==='learn'?'full':page;
    return `<div class="page-intro"><div><p class="eyebrow">${escape(t.cards[index][0])}</p><h1>${escape(t[type+'Title'])}</h1></div><p>${escape(t[type+'Lead'])}</p></div><p class="learning-actions js-only"><a href="#practice">${escape(t.toPractice)}</a></p>${guide(page,t)}${trainer(page,t,state)}<p class="next-stage"><a href="${link(index<3?stages[index+1]:'index',lang)}">${escape(index<3?t.next:t.backHome)}</a></p><p class="note calendar-note">${escape(t.calendar)}</p>`;
  }
  function legal(page,lang,t) {
    const privacy=`<section id="privacy" class="legal-section"><h2>${escape(t.privacy)}</h2>${paragraph(t.privacy1)}${paragraph(t.privacy2)}${paragraph(t.privacy3)}<p><a class="text-link" href="${C.hostingUrl}">${escape(t.hostPrivacy)}</a></p></section>`;
    return `<div class="page-intro"><div><p class="eyebrow">BDAYMETHOD</p><h1>${escape(page==='privacy'?t.privacy:t.legalTitle)}</h1></div><p>${escape(t.legalIntro)}</p></div><article class="legal-content">${page==='privacy'?privacy:`<section id="imprint" class="legal-section"><h2>${escape(t.imprint)}</h2><p><strong>${escape(t.operator)}</strong><br>${escape(C.owner)}, ${escape(C.businessForm)}</p>${paragraph(t.brandStatus)}<h3>${escape(t.contact)}</h3><p class="legal-contact">${escape(C.address)}<br><a href="tel:+33685575602">${escape(C.phone)}</a><br><a href="mailto:${C.email}">${escape(C.email)}</a><br>${escape(C.registration)}</p><h3>${escape(t.hosting)}</h3><p>GitHub Pages · ${escape(C.hostingName)}<br>${escape(C.hostingAddress)}</p></section>${privacy}<section id="terms" class="legal-section"><h2>${escape(t.terms)}</h2>${paragraph(t.terms1)}${paragraph(t.terms2)}${paragraph(t.terms3)}</section>`}<p class="note">${escape(t.updated)}</p></article>`;
  }
  function defaultState() { return {task:{year:1994,month:5,day:17},mode:'guided',range:'regular',score:0,counted:false,revealed:false}; }
  function markup(page='index',lang='en',state=defaultState()) {
    const t=I[lang];
    const content=page==='index'?home(lang,t):stages.includes(page)?trainingPage(page,lang,t,state):['legal','privacy'].includes(page)?legal(page,lang,t):`<div class="page-intro"><div><p class="eyebrow">404</p><h1>${escape(t.notFound)}</h1></div></div><p>${escape(t.notFoundText)}</p><a class="button button-primary home-start" href="${link('index',lang)}">${escape(t.backHome)}</a>`;
    return `${header(page,lang,t)}<noscript><p class="site-shell noscript-note">Examples remain readable in English. Enable JavaScript for exercises and language selection. / Les exemples restent lisibles en anglais. Active JavaScript pour les exercices et la langue. / Die Beispiele bleiben auf Englisch lesbar. Aktiviere JavaScript für Übungen und Sprachwahl.</p></noscript><main class="site-shell page-main" id="main" tabindex="-1">${['legal','privacy','404'].includes(page)?'':`<p class="booklet-note"><a href="${C.bookletUrl}">${escape(t.booklet)}</a></p>`}${content}</main>${footer(lang,t)}`;
  }
  const parseInteger = value => { const s=value.trim().replace(/^−/,'-'); return /^[+-]?\d+$/.test(s) ? Number(s) : NaN; };
  function init() {
    const doc=root.document, page=doc.body.dataset.page || 'index';
    let stored; try { stored=root.localStorage.getItem('bdaymethod-language') || root.localStorage.getItem('bday-language'); } catch (_) { /* The site also works without storage. */ }
    let query=new URLSearchParams(root.location.search).get('lang'); if(query==='fr') query='fr-CA';
    const supported=['en','fr-CA','de'];
    let lang=supported.includes(query)?query:supported.includes(stored)?stored:'en';
    const state=defaultState();
    const $=selector=>doc.querySelector(selector);
    function status(id,text,kind) { const node=$(id); node.className=`result show ${kind||''}`; node.textContent=text; }
    function rememberLanguage() { try { root.localStorage.setItem('bdaymethod-language',lang); } catch (_) {} }
    function render() {
      const t=I[lang]; doc.documentElement.lang=t.locale; doc.documentElement.classList.remove('no-js');
      doc.title=title(page,t);
      doc.querySelectorAll('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').forEach(n=>n.setAttribute('content',t.description));
      doc.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]').forEach(n=>n.setAttribute('content',doc.title));
      const locale=doc.querySelector('meta[property="og:locale"]'); if(locale) locale.content=t.locale.replace('-','_');
      doc.body.innerHTML=markup(page,lang,state); bind();
    }
    function showSolution(part) {
      const t=I[lang],d=M.details(state.task.year,state.task.month,state.task.day);
      $('#practice-steps').innerHTML=solution(d,t,part); $('#practice-solution').hidden=false;
    }
    function updateTrainer() {
      const previous=$('#practice'); const holder=doc.createElement('div'); holder.innerHTML=trainer(page,I[lang],state);
      previous.replaceWith(holder.firstElementChild); bindTrainer();
    }
    function newTask() {
      const old=state.task; let next;
      do {next=M.randomDate(state.range==='extended'?1:1700,state.range==='extended'?9999:2199);} while(['century','year'].includes(page)?next.year===old.year:next.year===old.year&&next.month===old.month&&next.day===old.day);
      state.task=next; state.counted=false; state.revealed=false; updateTrainer(); $('#problem').focus();
    }
    function bindTrainer() {
      const form=$('#practice-form'); if(!form) return;
      $('#new-task').addEventListener('click',newTask);
      $('#year-range').addEventListener('change',e=>{state.range=e.target.value;newTask();});
      $('#training-mode')?.addEventListener('change',e=>{state.mode=e.target.value; updateTrainer(); $('#training-mode').focus();});
      $('#reveal').addEventListener('click',()=>{state.revealed=true;showSolution(page);status('#practice-result',I[lang].review,'');});
      form.addEventListener('submit',e=>{
        e.preventDefault(); const t=I[lang],d=M.details(state.task.year,state.task.month,state.task.day),kk=keys(page,state.mode);
        if(state.counted) {status('#practice-result',t.solved,'success');return;}
        let firstInvalid=null,complete=true,allCorrect=true;
        for(const k of kk) {
          const input=$('#answer-'+k), feedback=$('#feedback-'+k), n=parseInteger(input.value);
          const present=Number.isSafeInteger(n), correct=present&&n===d[k];
          input.classList.toggle('correct',correct); input.classList.toggle('wrong',!correct);
          input.setAttribute('aria-invalid',String(!correct));
          feedback.textContent=correct?t.right:t.fieldHints[k]; feedback.classList.toggle('positive',correct);
          if(!present) complete=false;
          if(!correct) {allCorrect=false;firstInvalid ||= input;}
        }
        if(allCorrect) {
          if(!state.revealed) {state.score++;state.counted=true;$('#score').textContent=state.score;}
          status('#practice-result',state.mode==='mental'?t.correctMental:t.correct,'success');showSolution(page);
          // Once the worked answer has been displayed, it can never earn another point.
          state.revealed=true;
        } else {status('#practice-result',complete?t.wrong:t.incomplete,'failure');firstInvalid?.focus();}
      });
    }
    function bindCalculator() {
      const form=$('#date-form'); if(!form) return;
      form.addEventListener('submit',e=>{
        e.preventDefault(); const t=I[lang],nodes=['year','month','day'].map(k=>$('#calc-'+k));
        const [y,m,d]=nodes.map(node=>parseInteger(node.value));
        if(!M.valid(y,m,d)) {nodes.forEach(n=>{n.setAttribute('aria-invalid','true');n.setAttribute('aria-describedby','calc-result');});$('#calc-solution').hidden=true;status('#calc-result',t.calcInvalid,'failure');$('#calc-day').focus();return;}
        nodes.forEach(n=>{n.removeAttribute('aria-invalid');n.removeAttribute('aria-describedby');});
        const details=M.details(y,m,d); status('#calc-result',`${date(details,t)} → ${weekday(details.weekday,t)}`,'success');
        $('#calc-steps').innerHTML=solution(details,t);$('#calc-solution').hidden=false;
      });
    }
    function bind() {
      doc.querySelectorAll('[data-language]').forEach(a=>a.addEventListener('click',e=>{
        e.preventDefault();
        const values=Array.from(doc.querySelectorAll('input,select')).map(n=>[n.id,n.value]);
        const solutionWasOpen=$('#practice-solution')&&!$('#practice-solution').hidden;
        lang=a.dataset.language; rememberLanguage();
        const url=new URL(root.location.href);url.searchParams.set('lang',lang);try{root.history.replaceState(null,'',url);}catch(_){}
        render();values.forEach(([id,value])=>{const n=doc.getElementById(id);if(n)n.value=value;});
        if(solutionWasOpen)showSolution(page);
        doc.querySelector(`[data-language="${lang}"]`).focus();
      }));
      bindTrainer();bindCalculator();
    }
    rememberLanguage();render();
    // Restore fragment navigation after localization has rebuilt the document.
    if(root.location.hash) { try { const target=doc.getElementById(decodeURIComponent(root.location.hash.slice(1))); target?.scrollIntoView(); } catch (_) { /* An invalid URL fragment must not break the trainer. */ } }
  }
  root.BdaySite=Object.freeze({markup,title,defaultState,keys,solution,parseInteger,init});
  if(root.document) {
    if(root.document.readyState==='loading') root.document.addEventListener('DOMContentLoaded',init,{once:true});
    else init();
  }
})(globalThis);
