// Interactive features for the Chicken Nuggets Website

document.addEventListener('DOMContentLoaded', () => {
  // 1. Nugget Sauce Calculator (Home Page)
  const nuggetInput = document.getElementById('nugget-count');
  const sauceResult = document.getElementById('sauce-result');
  const crunchAdvice = document.getElementById('crunch-advice');

  if (nuggetInput && sauceResult) {
    const calculateSauce = () => {
      const count = parseInt(nuggetInput.value, 10) || 0;
      if (count <= 0) {
        sauceResult.textContent = "Enter at least 1 nugget to calculate!";
        if (crunchAdvice) crunchAdvice.textContent = "Nuggets await your hunger.";
        return;
      }

      // Calculation logic: roughly 1 sauce cup for every 4-5 nuggets, plus 1 buffer cup
      const saucePots = Math.max(1, Math.ceil(count / 4.5));
      let advice = "";

      if (count <= 6) {
        advice = "A light snack! 1 delicious flavor will do, but 2 gives you variety.";
      } else if (count <= 12) {
        advice = "The classic meal size. We recommend 1 sweet and 1 savory/tangy sauce!";
      } else if (count <= 20) {
        advice = "Serious feast territory! Mix BBQ, Sweet & Sour, and Honey Mustard.";
      } else {
        advice = "Legendary Nugget Party! You need a sauce flight across all flavors.";
      }

      sauceResult.innerHTML = `Recommended: <strong>${saucePots} Sauce Tub${saucePots > 1 ? 's' : ''}</strong> 🍯`;
      if (crunchAdvice) crunchAdvice.textContent = advice;
    };

    nuggetInput.addEventListener('input', calculateSauce);
    calculateSauce();
  }

  // 2. Interactive Crunch Sound Generator (Web Audio API - crispy bite sound)
  const soundBtns = document.querySelectorAll('.sound-crunch-btn');
  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playCrunchSound();
    });
  });

  function playCrunchSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Synthesize a quick crispy snap & noise burst
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Decaying noise burst mimicking crispy breading crunch
        const decay = Math.exp(-i / (ctx.sampleRate * 0.035));
        data[i] = (Math.random() * 2 - 1) * decay;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to sound crunchy rather than static hiss
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      console.log('Audio autoplay prevented or unsupported');
    }
  }

  // 3. Sauce Card Click to Highlight (Recipes Page)
  const sauceCards = document.querySelectorAll('.sauce-card');
  const sauceDetail = document.getElementById('sauce-active-detail');

  if (sauceCards.length > 0 && sauceDetail) {
    sauceCards.forEach(card => {
      card.addEventListener('click', () => {
        sauceCards.forEach(c => c.style.borderColor = 'var(--border)');
        card.style.borderColor = 'var(--primary)';
        
        const name = card.querySelector('h3')?.textContent || 'Sauce';
        const notes = card.getAttribute('data-notes') || '';
        const heat = card.getAttribute('data-heat') || 'Mild';
        
        sauceDetail.innerHTML = `
          <div style="background: #fffbeb; border: 2px solid #f59e0b; padding: 1.25rem; border-radius: 14px; margin-top: 1rem; animation: fadeIn 0.3s ease;">
            <h4 style="color: #92400e; font-size: 1.15rem; margin-bottom: 0.3rem;">Selected: ${name}</h4>
            <p style="margin-bottom: 0.4rem;"><strong>Flavor Profile:</strong> ${notes}</p>
            <span style="display:inline-block; font-size: 0.85rem; font-weight: 700; color: #dc2626; background: #fee2e2; padding: 0.2rem 0.6rem; border-radius: 999px;">Heat Rating: ${heat}</span>
          </div>
        `;
      });
    });
  }
});

