const SOCIAL_NETWORKS = {
  Facebook: `https://www.facebook.com/search/people/?q=%`,
  LinkedIn: `https://www.linkedin.com/search/results/people/?keywords=%`,
  Twitter: `https://twitter.com/search?src=typed_query&f=user&q=%`
  // Note: Instagram unfortunatelly not works this way
};

const vcardElement = document.getElementById("vcard") as HTMLTextAreaElement;
const socialElement = document.getElementById("social");
const openAllElement = document.getElementById("open-all");
const sumElement = document.getElementById("sum");


vcardElement.addEventListener('drop',async (event)=>{
  event.preventDefault();

  const item = event.dataTransfer.items[0];
  const file = item.getAsFile();
  const content = await file.text();
  vcardElement.value = content;
  convert();

});

openAllElement.addEventListener("click", () => {
  openAll();
});
vcardElement.addEventListener("keydown", convert);
vcardElement.addEventListener("change", convert);
convert();

function convert() {
  const source = vcardElement.value;

  socialElement.innerHTML = "";

  let sum = 0;
  for (const name of parseVcard(source)) {
    sum++;
    for (const [socialNetworkName, socialNetworkUrlTemplate] of Object.entries(
      SOCIAL_NETWORKS
    )) {
      const aElement = document.createElement("A") as HTMLAnchorElement;
      aElement.innerText = `${name} on ${socialNetworkName}`;
      const url = (aElement.href = socialNetworkUrlTemplate
        .split("%")
        .join(encodeURIComponent(name)));

      aElement.href = url;
      aElement.target = "_blank";
      aElement.addEventListener("click", (event) => {
        // Note: this is bacause annoying FB CORS rules on search page
        //event.preventDefault();
        //window.open(url);
      });

      socialElement.appendChild(aElement);
    }
  }
  sumElement.innerHTML = `&nbsp;${sum}&nbsp;`;
}

async function openAll() {
  for (const aElement of Array.from(socialElement.querySelectorAll("a"))) {
    console.log(`Opening "${aElement.href}"`);
    window.open(aElement.href, "_blank");
    await forTime(1);
    // Note: In a browser plugin or with a manifest> chrome.tabs.create({ url: aElement.href });
  }
}

/*
interface IContact{
  name?: string; 
}
*/

function parseVcard(vcard: string): string[] {
  return Array.from(vcard.matchAll(/^(FN:(?<firstname>.*?))$/gms)).map(
    (match) => match.groups.firstname
  );
}

function forTime(miliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, miliseconds);
  });
}
