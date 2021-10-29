function $(sel) {
  return document.querySelector(sel);
}
function $$(sel) {
  return Array.prototype.slice.apply(document.querySelectorAll(sel));
}

function render(content) {
  $("pre").textContent = content;
}

function getUrl(url) {
  return new Promise(function(resolve, reject) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function() {
      resolve(this.responseText);
    });
    oReq.open("GET", url);
    oReq.send();
  });
}

render(document.querySelector("html").outerHTML);
$(".hide").addEventListener("click", function(e) {
  document.body.classList.add("noaside");
});
$(".show").addEventListener("click", function(e) {
  document.body.classList.remove("noaside");
});

$$("aside li").forEach(function(el) {
  el.addEventListener("click", function(e) {
    $$("aside li").forEach(function(el) {
      el.classList.remove("active");
    });
    el.classList.add("active");
    var file = el.textContent.split(" ").pop();
    getUrl("./" + file).then(render);
  });
});
