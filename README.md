# Export price builder (EXW → DDP)

A free, single-page tool that turns an **ex-works cost** into the right quote at every Incoterm — **EXW, FOB, CFR, CIF and DDP** — by adding each cost leg one step at a time, then applying your margin and bank / LC charge on top.

Enter the ex-works cost of goods, inland haulage, terminal handling with export clearance (THC), freight, insurance rate, bank / LC charge, margin, and the destination charges, import duty and last-mile delivery used for DDP. The tool shows the headline FOB selling price, a full Incoterm breakdown (cost and selling price for each term), and a transparent cost build-up ladder. Amounts are per shipment and can be shown in USD, INR or PHP.

## Who it's for

First-time exporters and trading units in **India and the Philippines** who need to price an international shipment correctly and explain, line by line, how the FOB / CIF / DDP numbers are built.

## The standard it follows

Term definitions and the buyer / seller handover points follow **Incoterms® 2020** (ICC). The tool models the **cost split** along the ladder — it does not advise on risk transfer, named-place variants, or legal obligations. Insurance uses the common CIF convention of insuring **110% of the CFR value**.

## How the numbers work

```
cost_EXW  = ex-works
cost_FOB  = ex-works + inland haulage + THC
cost_CFR  = cost_FOB + freight
insurance = (insurance rate % / 100) × (cost_CFR × 1.10)
cost_CIF  = cost_CFR + insurance
cost_DDP  = cost_CIF + destination charges + import duty + last-mile delivery

selling(value) = value × (1 + margin % / 100) × (1 + bank % / 100)
```

Margin is applied on cost and the bank / LC charge is applied on value, and both are applied to **every** Incoterm, so each term shows both its landed cost and its selling price.

## Run it locally

No build step and no dependencies. Serve the folder with any static server, for example:

```sh
python3 -m http.server 8137
```

Then open <http://localhost:8137/>.

## Scope & accuracy

The figures are **indicative planning estimates**, only as good as the quotes you enter. Real freight, terminal handling, insurance premiums and import duty vary by lane, carrier, commodity and HS code, and insurance pricing is not always exactly 110% of CFR. Confirm live quotes and the obligations of each Incoterm with your freight forwarder, insurer and customs broker before you commit to a price.

MIT licensed.
