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

  const $singles = document.createElement("div");
  $singles.appendChild(document.createTextNode("Single: " + JSON.stringify(hitSingle)));
  const $albums = document.createElement("div");
  $albums.appendChild(document.createTextNode("Album: " + JSON.stringify(hitAlbum)));

  $result.innerHTML = "";
  $result.appendChild($singles);
  $result.appendChild($albums);

  function getHit(date, listOfHits) {
    return listOfHits.find(hit => hit.duration.from <= date && date <= hit.duration.to);
  }
}
