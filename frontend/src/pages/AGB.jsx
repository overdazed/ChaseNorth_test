import React from 'react';

const AGB = () => {
  return (
    <div className="min-h-600px bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="max-w-xs">
              <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
                Allgemeine Geschäftsbedingungen (AGB)
              </h1>
              <p className="mt-1 hidden md:block text-neutral-600 dark:text-neutral-400">
                Unsere Geschäftsbedingungen und rechtlichen Hinweise.
              </p>
            </div>
            {/* Desktop "Still have questions?" - Hidden on mobile */}
            <div className="hidden md:block mt-12 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any further questions about our terms and conditions, our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => (window.location.href = "mailto:support@chasenorth.com")}
                    className="w-full bg-black text-white px-6 py-3 text-sm rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors duration-200"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                1. Geltungsbereich
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die Sie mit uns über die Nutzung unserer Website und den Kauf von Produkten schließen.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                2. Vertragsschluss
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Der Kaufvertrag kommt zustande, wenn Sie Ihre Bestellung abschließen und wir diese bestätigen. Die Bestätigung erfolgt per E-Mail.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                3. Preise und Zahlungsbedingungen
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Alle Preise sind in Euro angegeben und enthalten die gesetzliche Mehrwertsteuer. Die Zahlung kann per Kreditkarte, PayPal oder anderen angebotenen Zahlungsmethoden erfolgen.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                4. Lieferung und Versand
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Die Lieferung erfolgt innerhalb der angegebenen Lieferzeiten. Versandkosten werden separat ausgewiesen und sind abhängig vom Bestellwert und Lieferland.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                5. Rücktrittsrecht
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Sie haben das Recht, innerhalb von 14 Tagen ohne Angabe von Gründen vom Vertrag zurückzutreten. Die Rücktrittsfrist beginnt mit dem Erhalt der Ware.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                6. Gewährleistung
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Für unsere Produkte gelten die gesetzlichen Gewährleistungsbestimmungen. Mängel sind uns unverzüglich nach Entdeckung anzuzeigen.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                7. Datenschutz
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Ihre persönlichen Daten werden gemäß unserer Datenschutzerklärung verarbeitet. Diese finden Sie auf unserer Website.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                8. Schlussbestimmungen
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Gültigkeit der übrigen Bestimmungen unberührt.
              </p>

              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Bei Fragen zu unseren AGB können Sie uns jederzeit unter <a href="mailto:support@chasenorth.com" className="text-blue-600 dark:text-blue-400">support@chasenorth.com</a> kontaktieren.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile "Still have questions?" - Only shows on mobile */}
        <div className="md:hidden mt-8 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            If you have any further questions about our terms and conditions, our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={() => (window.location.href = "mailto:support@chasenorth.com")}
                className="w-full bg-black text-white px-6 py-3 text-sm rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors duration-200"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AGB;