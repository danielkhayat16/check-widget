# 🧾 Digital Cheque Widget

**Widget embarquable de chèque digital**, conçu pour les banques et fintechs israéliennes.  
Permet l’affichage, la signature et l’encaissement sécurisé d’un chèque virtuel.

---

## 🚀 Fonctionnalités

- Affichage lisible du chèque (émetteur, bénéficiaire, montant, etc.)
- Signature électronique (dessin ou API e-signature)
- Bouton sécurisé "Encaisser" avec appel API bancaire
- Intégration simple dans toute application bancaire existante
- Architecture isolée et adaptable à chaque banque partenaire

---

## 🏗️ Architecture (simplifiée)

```text
widget/
├── components/    # Composants UI (signature, vue chèque, bouton encaissement)
├── services/      # Intégration API bancaire (OAuth2, virement, vérification IBAN)
├── styles/        # Feuilles de style (CSS / Tailwind)
├── public/        # index.html pour tests
├── main.js        # Point d’entrée du widget
└── config.js      # Configuration dynamique par banque
```

🔧 Intégration dans une banque (exemple)

<script src="https://cdn.chequedigital.io/widget.js"></script>
<div id="cheque-widget-container"></div>

<script>
  initChequeWidget({
    chequeId: "chk_000123",
    authToken: "eyJhbGciOiJIUzI1...",
    bankApi: {
      oauthUrl: "https://bank.co.il/oauth2",
      transferEndpoint: "https://bank.co.il/api/v1/transfer"
    }
  });
</script>
