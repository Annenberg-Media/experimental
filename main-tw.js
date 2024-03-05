const languageCodes = new Map([
  ["English", "en"],
  ["French", "fr"],
  ["Spanish", "es"],
  ["Italian", "it"],
  ["Chinese", "zh-CN"],
  ["Korean", "ko"],
  ["Japanese", "ja"],
  ["Russian", "ru"],
  ["Farsi", "fa"],
  ["German", "de"],
  ["Portuguese", "pt"],
]);

const myList = document.querySelector('#dropdown-menu');
languageCodes.forEach(function (value, key) {
  const newList = document.createElement('li');
  const newLink = document.createElement('a');
  const str = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 notranslate";
  const classes = str.split(' ');
  classes.forEach(className => {
    newLink.classList.add(className);
  });
  newLink.innerHTML = key;
  newList.appendChild(newLink);
  myList.appendChild(newList);
});

if (window.location.href.includes("lhr.life")) {
  document.querySelector('#translateButton').textContent = "A文";
}
else {
  let languageCode = window.location.href.substring(window.location.href.indexOf("_x_tr_tl=") + 9).split("&")[0];
  for (const [key, value] of languageCodes.entries()) {
    console.log(languageCode)
    if (value === languageCode) {
      document.querySelector('#translateButton').textContent = key;
      // console.log("new language", key);
      break;
    }
  }
}

myList.addEventListener('click', function (event) {
  console.log('click');
  if (event.target.tagName === 'A') {
    myFunction(event.target);
    console.log("element clicked")
  }
});

function myFunction(clickedElement) {
  // console.log('The following li element was clicked:', clickedElement.innerHTML);

  //THIS CODE IS STILL BUGGY, NEEDS ORIGINAL URL IN THE == 'en' condition which is currently not available
  console.log(window.location.href);
  window.location.href =
    window.location.host.includes("lhr.life") ?
      'https://' + window.location.host.replace(/\./g, '-') + '.translate.goog' + window.location.pathname + "?_x_tr_sl=auto&_x_tr_tl=" + languageCodes.get(clickedElement.innerHTML) + "&_x_tr_hl=en&_x_tr_pto=wapp"
      :
      (languageCodes.get(clickedElement.innerHTML) == "en" ? 'https:' : 'https://' + window.location.host.replace(/\./g, '-') + '.translate.goog' + window.location.pathname + "?_x_tr_sl=auto&_x_tr_tl=" + languageCodes.get(clickedElement.innerHTML) + "&_x_tr_hl=en&_x_tr_pto=wapp");
};

const shareBtn = document.querySelector('#share_btn');

async function copyPageUrl() {
  try {
    await navigator.clipboard.writeText(location.href);
    console.log('Page URL copied to clipboard');

    const txt = document.getElementById('copy-link-text');
    txt.innerText = 'Link copied';

    const ico = document.getElementById('copy-link-icon');
    ico.className = 'bi bi-check-circle-fill';
    ico.style = 'color:green';
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}


function getPageHeadlines() {
  try {
    var elem = document.createElement('textarea');

    let h = document.getElementsByClassName('headline')[0];
    while (h.querySelector('font')) {
      h.innerHTML = h.querySelector('font').innerHTML;
    }
    elem.innerHTML = h.innerHTML;
    h = encodeURIComponent(elem.value);
    console.log(h);
    let sh = document.getElementsByClassName('sub-headline')[0];
    while (sh.querySelector('font')) {
      sh.innerHTML = sh.querySelector('font').innerHTML;
    }
    elem.innerHTML = sh.innerHTML;
    sh = encodeURIComponent(elem.value);
    console.log(sh);
    return [h, sh];
  }
  catch (err) {
    console.error(err);
  }
}

function getWhatsappShare() {
  try {
    const [h, sh] = getPageHeadlines();
    let href = 'https://wa.me/?text=' + h + location.href;
    console.log(href);
    document.getElementById('dropdown-whatsapp').setAttribute('href', href);
  }
  catch (err) {
    console.error('Some headline missing');
  }
}

function getEmailShare() {
  try {
    const [h, sh] = getPageHeadlines();
    let href = 'mailto:?subject=Check%20out%20this%20article%20from%20Annenberg%20Media&body=' + h + '%0A' + sh + '%0A%0A' + location.href;
    console.log(href);
    document.getElementById('dropdown-email').setAttribute('href', href);
  }
  catch (err) {
    console.error('Email sharing failed');
  }
}

function getLinkedInShare() {
  try {
    const [h, sh] = getPageHeadlines();
    let href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + location.href;
    console.log(href);
    document.getElementById('dropdown-linkedin').setAttribute('href', href);
  }
  catch (err) {
    console.error('Some headline missing');
  }
}

function getTwitterShare() {
  try {
    const [h, sh] = getPageHeadlines();
    let href = 'https://twitter.com/intent/tweet?url=' + location.href + '&via=AnnenbergMedia&text=' + h;
    console.log(href);
    document.getElementById('dropdown-twitter').setAttribute('href', href);
  }
  catch (err) {
    console.error('Some headline missing');
  }
}

function getFacebookShare() {
  try {
    const [h, sh] = getPageHeadlines();
    let href = 'https://www.facebook.com/sharer.php?u=' + location.href;
    console.log(href);
    document.getElementById('dropdown-facebook').setAttribute('href', href);
  }
  catch (err) {
    console.error('Some headline missing');
  }
}

const shareData = {
  title: "Annenberg Media News app",
  url: "https://bit.ly/ann-news",
  text: "Check out the all-new Annenberg Media News app, now serving the latest videos, freshest articles and best news radio content from USC students ✌🏼 :"
}

if (!navigator.share) {
  document.getElementById("dropdown-more").className = 'hidden';
}
const btn = document.getElementById("dropdown-more");

btn.addEventListener("click", async () => {
  try {
    await navigator.share(shareData);
    console.log("More shared");
  }
  catch (err) {
    console.log("Navigator share error");
  }
}
);

const synth = window.speechSynthesis;
let listenButton = document.getElementById('listen');

function getArticleText() {
  const [h, sh] = getPageHeadlines();
  const article = document.querySelector('article');
  const paragraphs = article.querySelectorAll('p');
  let text = decodeURIComponent(h) + (h.endsWith('.') ? " " : ". ") + decodeURIComponent(sh) + (sh.endsWith('.') ? " " : ". ");

  paragraphs.forEach(paragraph => {
    //remove <font> tags if Google Translate is enabled
    while (paragraph.querySelector('font')) {
      paragraph.innerHTML = paragraph.querySelector('font').innerHTML;
    }
    text += paragraph.textContent + " ";
  });
  console.log(text);
  return text;
}

function stopPlaying() {
  synth.cancel();
  listenButton.innerHTML = `<i id='play_btn' class="bi bi-play-circle" style="color:#990302"></i><span> Listen</span>`;
  listenButton.onclick = readAloudStuff;
}

function readAloudStuff() {
  const article_text = getArticleText();
  console.log("Final text = " + article_text);
  var utterThis = new SpeechSynthesisUtterance(article_text);

  utterThis.addEventListener('start', () => {
    if (synth.speaking) {
      console.log('Speaking');
      listenButton.innerHTML = ` <i id='stop_btn' class="bi bi-stop-circle" style="color:#990302"></i><span> Stop playing</span>`;
      listenButton.onclick = stopPlaying;
    }
  });

  utterThis.addEventListener('end', () => {
    if (!synth.speaking) {
      console.log('Speaking ended');
      listenButton.innerHTML = `<i id='play_btn' class="bi bi-play-circle" style="color:#990302"></i><span> Listen</span>`;
      listenButton.onclick = readAloudStuff;
    }
  });

  utterThis.addEventListener('error', (event) => {
    console.error(`SpeechSynthesisUtterance error: ${event.error}`);
  });

  utterThis.rate = 0.9

  synth.speak(utterThis);
}

function refreshElements() {
  const txt = document.getElementById('copy-link-text');
  txt.innerText = 'Copy Link';

  const ico = document.getElementById('copy-link-icon');
  ico.className = 'bi bi-copy';
  ico.style = '';
}

document.querySelector('.share_btn').addEventListener('click', function (event) {
  var dropdownMenu = this.nextElementSibling;
  dropdownMenu.classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
  var toggleButton = document.querySelector('.share_btn');
  var dropdownMenu = toggleButton.nextElementSibling;

  // Check if the click was outside the toggle button and the dropdown menu
  if (!toggleButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.add('hidden');
    refreshElements();
  }
});

document.querySelector('.translate_btn').addEventListener('click', function (event) {
  var dropdownMenu = this.nextElementSibling;
  dropdownMenu.classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
  var toggleButton = document.querySelector('.translate_btn');
  var dropdownMenu = toggleButton.nextElementSibling;

  // Check if the click was outside the toggle button and the dropdown menu
  if (!toggleButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.add('hidden');
  }
});

let isTypingEffectInitiated = false;

document.querySelector('.summarize_btn').addEventListener('click', function (event) {
  var hiddenCard = document.getElementById('summary-section');
  var ulElement = document.getElementById("summary-list");


  if (hiddenCard.classList.contains('hidden')) {
    // Clear existing list items
    ulElement.innerHTML = '';
    hiddenCard.classList.toggle('hidden');

    const urlPath = window.location.pathname;
    var key = urlPath.slice(1, -1); // Adjust this as per the URL format

    key = '2023/11/08/the-coliseum-one-of-the-most-electric-and-historic-stadiums-ive-got-the-chance-to-shine-in';



    fetch('https://annenberg-media.github.io/summarized-data/data.json')
      .then(response => response.json())
      .then(data => {
        var objectForKey = data[key];
        if (objectForKey && !isTypingEffectInitiated) {
          var summaryArray = objectForKey.summary;
          isTypingEffectInitiated = true; // Set the flag to true

          // Function to simulate typing effect
          function typeText(text, element, index = 0) {
            if (index < text.length) {
              element.textContent += text.charAt(index);
              setTimeout(function () {
                typeText(text, element, index + 1);
              }, 5); // Adjust typing speed as needed
            }
          }

          // Function to iterate over the summary and apply typing effect to each
          function typeList(items, container, index = 0) {
            if (index < items.length) {
              var li = document.createElement("li");
              container.appendChild(li);

              typeText(items[index], li, 0);

              // Wait for the current line to finish typing before starting the next
              setTimeout(function () {
                typeList(items, container, index + 1);
              }, items[index].length * 5 + 500); // Adjust delay as needed
            }
          }

          // Start typing the list
          typeList(summaryArray, ulElement);

        }
        else if (objectForKey && isTypingEffectInitiated) {
          var summaryArray = objectForKey.summary;
          ulElement.innerHTML = summaryArray.map(item => `<li>${item}</li>`).join('');
        }
        else {
          console.log('Summary not found / URL error');
        }
      })
      .catch(error => {
        console.error("Error fetching or parsing JSON:", error);
      })
  }
  else {
    hiddenCard.classList.toggle('hidden');
  }
});