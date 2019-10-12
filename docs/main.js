const charts = {};

const $yearSelect = document.querySelector("select[name=year]");
const $monthSelect = document.querySelector("select[name=month]");
const $daySelect = document.querySelector("select[name=day]");
const $result = document.getElementById("result");

$yearSelect.addEventListener("change", onChange);
$monthSelect.addEventListener("change", onChange);
$daySelect.addEventListener("change", onChange);

createOptionsForSelect($yearSelect, 1953, 2019);

function createOptionsForSelect($select, from, to) {
  [...$select.children].forEach(child => child.remove());
  new Array(to - from + 1).fill(1).forEach((_, idx) => {
    const $option = document.createElement("option");
    $option.value = from + idx;
    $option.innerText = from + idx;
    $select.appendChild($option);
  });
}

async function onChange() {
  const year = $yearSelect.value;
  const month = $monthSelect.value;
  const day = $daySelect.value;
  const date = `${year}-${month}-${day}`;

  if (!charts[year]) {
    charts[year] = (await import(`./charts/${year}.js`)).default;
  }

  const hitSingle = getHit(date, charts[year].singles);
  const hitAlbum = getHit(date, charts[year].albums);

  const $singles = hitSingle ? createSingleOrAlbum("Single", "single", hitSingle) : createMissing("single");
  const $albums = hitAlbum ? createSingleOrAlbum("Album", "album", hitAlbum) : createMissing("album");

  $result.innerHTML = "";
  $result.appendChild($singles);
  $result.appendChild($albums);
}

function getHit(date, listOfHits) {
  return listOfHits.find(hit => hit.duration.from <= date && date <= hit.duration.to);
}

function createMissing(singleOrAlbum) {
  const $missing = document.createElement("div");
  const $header = document.createElement("div");
  const $title = document.createElement("div");

  $header.appendChild(document.createTextNode(`Keine ${singleOrAlbum}`));
  $title.appendChild(document.createTextNode(`Sorry, es wurde kein ${singleOrAlbum} gefunden!`));

  $header.classList.add("header");
  $title.classList.add("title");

  $missing.appendChild($header);
  $missing.appendChild($title);
  $missing.classList.add(singleOrAlbum);

  return $missing;
}

function createSingleOrAlbum(header, singleOrAlbum, hit) {
  const $singleOrAlbum = document.createElement("div");
  const $header = document.createElement("div");
  const $interpret = document.createElement("div");
  const $title = document.createElement("div");
  const $durationFrom = document.createElement("span");
  const $durationUntil = document.createElement("span");
  const $duration = document.createElement("div");

  $header.appendChild(document.createTextNode(header));
  $interpret.appendChild(document.createTextNode(hit.interpret));
  $title.appendChild(document.createTextNode(hit.title));
  $durationFrom.appendChild(document.createTextNode(durationToTime(hit.duration.from)));
  $durationUntil.appendChild(document.createTextNode(durationToTime(hit.duration.to)));

  $header.classList.add("header");
  $interpret.classList.add("interpret");
  $title.classList.add("title");
  $durationFrom.classList.add("durationFrom");
  $durationUntil.classList.add("durationUntil");
  $duration.classList.add("duration");

  $duration.appendChild($durationFrom);
  $duration.appendChild(document.createTextNode(" bis "));
  $duration.appendChild($durationUntil);

  $singleOrAlbum.appendChild($header);
  $singleOrAlbum.appendChild($title);
  $singleOrAlbum.appendChild($interpret);
  $singleOrAlbum.appendChild($duration);
  $singleOrAlbum.classList.add(singleOrAlbum);

  return $singleOrAlbum;
}

function durationToTime(date) {
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8);
  return `${day}.${month}.${year}`;
}
