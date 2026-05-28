import { useState } from "react";
import jsPDF from "jspdf";

const AgreementPage = () => {
  const [ownerName, setOwnerName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [startDate, setStartDate] = useState("");

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("RENT AGREEMENT", 70, 20);

    doc.setFontSize(14);

    doc.text(
      `This Rent Agreement is made between ${ownerName} (Owner) and ${tenantName} (Tenant).`,
      20,
      50
    );

    doc.text(
      `The property located at ${propertyAddress} is rented for a monthly rent of ₹${rentAmount}.`,
      20,
      70
    );

    doc.text(
      `The rental agreement starts from ${startDate}.`,
      20,
      90
    );

    doc.text(
      "Both parties agree to the terms and conditions of the rental agreement.",
      20,
      110
    );

    doc.text("Owner Signature: ___________________", 20, 160);

    doc.text("Tenant Signature: ___________________", 20, 180);

    doc.save("RentAgreement.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-2xl">

        <h1 className="mb-8 text-center text-4xl font-extrabold text-slate-900">
          Rent Agreement Generator
        </h1>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-semibold">
              Owner Name
            </label>

            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter owner name"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Tenant Name
            </label>

            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter tenant name"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold">
              Property Address
            </label>

            <textarea
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
              rows={4}
              placeholder="Enter property address"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Monthly Rent
            </label>

            <input
              type="number"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter rent amount"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Agreement Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

        </div>

        <button
          onClick={generatePDF}
          className="mt-10 w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:opacity-90"
        >
          Generate Agreement PDF
        </button>

      </div>

    </div>
  );
};

export default AgreementPage;