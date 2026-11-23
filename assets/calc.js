/* Export price builder — EXW -> DDP cost ladder. Plain browser JS, no dependencies, no network. */
(function () {
  "use strict";

  var CUR = {
    USD: { code: "USD", loc: "en-US", sym: "$" },
    INR: { code: "INR", loc: "en-IN", sym: "₹" },
    PHP: { code: "PHP", loc: "en-PH", sym: "₱" }
  };
  var cur = "USD";

  function el(id) { return document.getElementById(id); }

  // Read a numeric input. Empty -> 0; negatives and non-finite -> 0. Never returns NaN/Infinity.
  function num(id) {
    var node = el(id);
    if (!node) return 0;
    var v = parseFloat(node.value);
    if (!isFinite(v) || v < 0) return 0;
    return v;
  }

  function fmt(n) {
    if (!isFinite(n)) n = 0;
    try {
      return new Intl.NumberFormat(CUR[cur].loc, {
        style: "currency",
        currency: CUR[cur].code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(n);
    } catch (e) {
      return CUR[cur].sym + n.toFixed(2);
    }
  }

  function set(id, text) { var n = el(id); if (n) n.textContent = text; }

  function compute() {
    var exworks  = num("exworks");
    var inland   = num("inland");
    var thc      = num("thc");
    var freight  = num("freight");
    var insRate  = num("ins");
    var bank     = num("bank");
    var margin   = num("margin");
    var dest     = num("dest");
    var duty     = num("duty");
    var delivery = num("delivery");

    // Cost ladder.
    var costEXW   = exworks;
    var costFOB   = exworks + inland + thc;
    var costCFR   = costFOB + freight;
    var insurance = (insRate / 100) * (costCFR * 1.10); // CIF +10% convention
    var costCIF   = costCFR + insurance;
    var costDDP   = costCIF + dest + duty + delivery;

    // Margin on cost, bank/LC on value — applied to every Incoterm.
    var mult = (1 + margin / 100) * (1 + bank / 100);
    function sell(v) { return v * mult; }

    // Headline: FOB selling price, with CIF and DDP in the sub.
    set("fobPrice", fmt(sell(costFOB)));
    set("subLine", "CIF " + fmt(sell(costCIF)) + " · DDP " + fmt(sell(costDDP)));

    // Breakdown table: Incoterm | Cost | Selling price.
    set("cEXW", fmt(costEXW)); set("sEXW", fmt(sell(costEXW)));
    set("cFOB", fmt(costFOB)); set("sFOB", fmt(sell(costFOB)));
    set("cCFR", fmt(costCFR)); set("sCFR", fmt(sell(costCFR)));
    set("cCIF", fmt(costCIF)); set("sCIF", fmt(sell(costCIF)));
    set("cDDP", fmt(costDDP)); set("sDDP", fmt(sell(costDDP)));

    // Cost build-up ladder (cost legs added one at a time).
    set("bEX",  fmt(exworks));
    set("bIN",  "+ " + fmt(inland));
    set("bTH",  "+ " + fmt(thc));
    set("bFOB", fmt(costFOB));
    set("bFR",  "+ " + fmt(freight));
    set("bCFR", fmt(costCFR));
    set("bINS", "+ " + fmt(insurance));
    set("bCIF", fmt(costCIF));
    set("bDDE", "+ " + fmt(dest + duty + delivery));
    set("bDDP", fmt(costDDP));
  }

  function setCurrency(code) {
    if (!CUR[code]) return;
    cur = code;
    var pres = document.querySelectorAll(".pre");
    for (var i = 0; i < pres.length; i++) { pres[i].textContent = CUR[code].sym; }
    var btns = document.querySelectorAll("[data-cur]");
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute("aria-pressed", btns[j].getAttribute("data-cur") === code ? "true" : "false");
    }
    compute();
  }

  function init() {
    var btns = document.querySelectorAll("[data-cur]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () { setCurrency(this.getAttribute("data-cur")); });
    }

    var inputs = document.querySelectorAll("input[type=number]");
    for (var k = 0; k < inputs.length; k++) {
      inputs[k].addEventListener("input", compute);
    }

    var p = el("print");
    if (p) p.addEventListener("click", function () { window.print(); });

    var r = el("reset");
    if (r) r.addEventListener("click", function () {
      var all = document.querySelectorAll("input[type=number]");
      for (var m = 0; m < all.length; m++) { all[m].value = ""; }
      compute();
    });

    compute();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
