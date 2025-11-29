// -----------------------
// Dark mode toggle + persist
// -----------------------
(function(){
  const darkSwitch = document.getElementById('darkSwitch');
  const darkLabel = document.getElementById('darkLabel');
  const saved = localStorage.getItem('site-theme'); // 'dark' or 'light'

  function applyTheme(theme){
    if(theme === 'dark'){
      document.documentElement.setAttribute('data-theme','dark');
      darkSwitch.checked = true;
      darkLabel.textContent = 'Dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
      darkSwitch.checked = false;
      darkLabel.textContent = 'Light';
    }
  }

  if(saved === 'dark') applyTheme('dark');
  else applyTheme('light');

  darkSwitch.addEventListener('change', function(e){
    const theme = e.target.checked ? 'dark' : 'light';
    applyTheme(theme);
    localStorage.setItem('site-theme', theme);
  });
})();


// -----------------------
// Reveal on scroll
// -----------------------
function revealOnScroll(){
  document.querySelectorAll('[data-animate]').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < (window.innerHeight - 60)) el.classList.add('in');
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);


// -----------------------
// Sample upload & preview handlers (NO DUPLICATES)
// -----------------------
(function(){
  const samples = [
    {inputId: 'fileSample1', wrapId: 'sampleWrap1', removeId: 'removeSample1', defaultText: 'Landing Page (HTML/CSS/Bootstrap)'},
    {inputId: 'fileSample2', wrapId: 'sampleWrap2', removeId: 'removeSample2', defaultText: 'Dashboard (HTML/CSS/JS)'},
    {inputId: 'fileSample3', wrapId: 'sampleWrap3', removeId: 'removeSample3', defaultText: 'Portfolio Site'}
  ];

  function setPlaceholder(wrapEl, text){
    wrapEl.innerHTML = text;
    wrapEl.style.display = 'flex';
    wrapEl.classList.remove('has-image');
  }

  samples.forEach((s, idx) => {
    const fileInput = document.getElementById(s.inputId);
    const wrap = document.getElementById(s.wrapId);
    const removeBtn = document.getElementById(s.removeId);

    // file select
    fileInput.addEventListener('change', function(ev){
      const f = ev.target.files && ev.target.files[0];
      if(!f) return;

      const url = URL.createObjectURL(f);
      wrap.innerHTML = '';

      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Sample ' + (idx+1);

      wrap.appendChild(img);
      wrap.classList.add('has-image');
      removeBtn.style.display = 'inline-block';
    });

    // remove uploaded image
    removeBtn.addEventListener('click', function(){
      fileInput.value = '';
      setPlaceholder(wrap, s.defaultText);
      removeBtn.style.display = 'none';
    });

    setPlaceholder(wrap, s.defaultText);
  });

})();


// -----------------------
// Contact form + WhatsApp + copy contact
// -----------------------
(function(){
  const form = document.getElementById('contactForm');
  const inputName = document.getElementById('inputName');
  const inputEmail = document.getElementById('inputEmail');
  const countryCode = document.getElementById('countryCode');
  const inputPhone = document.getElementById('inputPhone');
  const inputMessage = document.getElementById('inputMessage');
  const startWhatsApp = document.getElementById('startWhatsApp');
  const copyContact = document.getElementById('copyContact');
  const displayPhone = document.getElementById('displayPhone');
  const formMsg = document.getElementById('formMsg');
  const mailLink = document.getElementById('mailLink');

  function updateDisplayPhone(){
    let code = countryCode.value || '';
    let num = (inputPhone.value || '').trim();
    if(num.startsWith('+')){
      displayPhone.textContent = num;
    } else {
      displayPhone.textContent = (code + ' ' + num).trim();
    }
  }
  countryCode.addEventListener('change', updateDisplayPhone);
  inputPhone.addEventListener('input', updateDisplayPhone);

  function prepareWhatsAppURL(){
    let raw = (inputPhone.value || '').trim();
    if(!raw) return null;

    if(!raw.startsWith('+')){
      const code = (countryCode.value || '').replace(/\D/g,'');
      raw = code + raw.replace(/^0+/, '');
    } else {
      raw = raw.replace(/\+/g,'');
    }

    const digits = raw.replace(/\D/g,'');
    if(!digits) return null;

    const text = encodeURIComponent(
      `Hi Ceejay, I need help with: ${inputMessage.value || '[brief]'} -- Name: ${inputName.value || '[name]'} (email: ${inputEmail.value || '[email]'})`
    );

    return `https://wa.me/${digits}?text=${text}`;
  }

  startWhatsApp.addEventListener('click', function(){
    const url = prepareWhatsAppURL();
    if(!url) return alert('Please enter a phone number first.');
    window.open(url, '_blank');
  });

  copyContact.addEventListener('click', function(){
    const text = `Email: ${mailLink.textContent}\nWhatsApp: ${displayPhone.textContent}\nGitHub: github.com/yourusername`;
    navigator.clipboard.writeText(text).then(()=>{
      alert('Contact copied to clipboard');
    });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();

    if(!inputName.value.trim()){ inputName.classList.add('is-invalid'); inputName.focus(); return; }
    inputName.classList.remove('is-invalid');

    if(!inputEmail.value.trim() || !/^\S+@\S+\.\S+$/.test(inputEmail.value)){
      inputEmail.classList.add('is-invalid'); inputEmail.focus(); return;
    }
    inputEmail.classList.remove('is-invalid');

    if(!inputPhone.value.trim()){ inputPhone.classList.add('is-invalid'); inputPhone.focus(); return; }
    inputPhone.classList.remove('is-invalid');

    if(!inputMessage.value.trim()){ inputMessage.classList.add('is-invalid'); inputMessage.focus(); return; }
    inputMessage.classList.remove('is-invalid');

    const subject = encodeURIComponent('New project inquiry from ' + inputName.value.trim());
    const body = encodeURIComponent(
      `Name: ${inputName.value}\nPhone: ${countryCode.value} ${inputPhone.value}\nEmail: ${inputEmail.value}\n\nProject brief:\n${inputMessage.value}\n\n-- Sent from portfolio site`
    );

    const mailto = `mailto:ceejayportfolio@devmail.com?subject=${subject}&body=${body}`;
    formMsg.style.display = 'block';
    window.location.href = mailto;
  });

  updateDisplayPhone();
})();


// -----------------------
// Smooth scroll for internal links
// -----------------------
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });
})();
