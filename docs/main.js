import charts from "./charts.js";

const $yearSelect = document.querySelector("select[name=year]");
const $monthSelect = document.querySelector("select[name=month]");
const $daySelect = document.querySelector("select[name=day]");
const $result = document.getElementById("result");

$yearSelect.addEventListener("change", onChange);
$monthSelect.addEventListener("change", onChange);
$daySelect.addEventListener("change", onChange);

function onChange(e) {
  const year = $yearSelect.value;
  const month = $monthSelect.value;
  const day = $daySelect.value;
  const date = `${year}-${month}-${day}`;

  const hitSingle = getHit(date, charts[year].singles);
  const hitAlbum = getHit(date, charts[year].albums);

  const $singles = createSingleOrAlbum("Single", "single", hitSingle);
  const $albums = createSingleOrAlbum("Album", "album", hitAlbum);

  $result.innerHTML = "";
  $result.appendChild($singles);
  $result.appendChild($albums);

  function getHit(date, listOfHits) {
    return listOfHits.find(hit => hit.duration.from <= date && date <= hit.duration.to);
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
    $durationFrom.appendChild(document.createTextNode(hit.duration.from));
    $durationUntil.appendChild(document.createTextNode(hit.duration.to));

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
}
