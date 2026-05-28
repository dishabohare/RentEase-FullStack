import { useState } from "react";

const AffordabilityCalculator = () => {
  const [salary, setSalary] = useState("");
  const [recommendedRent, setRecommendedRent] = useState<number | null>(null);

  const calculateRent = () => {
    const monthlySalary = Number(salary);

    if (!monthlySalary || monthlySalary <= 0) {
      setRecommendedRent(null);
      return;
    }

    // 30% salary rule
    const affordableRent = Math.floor(monthlySalary * 0.3);

    setRecommendedRent(affordableRent);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-2xl">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-extrabold text-slate-900">
            Affordability Calculator
          </h1>

          <p className="mt-3 text-muted-foreground">
            Find the ideal rent you can comfortably afford.
          </p>

        </div>

        <div className="space-y-6">

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Monthly Salary (₹)
            </label>

            <input
              type="number"
              placeholder="Enter your monthly salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full rounded-2xl border p-4 text-lg outline-none transition focus:ring-2 focus:ring-black"
            />

          </div>

          <button
            onClick={calculateRent}
            className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:opacity-90"
          >
            Calculate Affordable Rent
          </button>

          {recommendedRent !== null && (

            <div className="rounded-3xl bg-green-100 p-8 text-center shadow-inner">

              <h2 className="text-2xl font-bold text-green-800">
                Recommended Rent Budget
              </h2>

              <p className="mt-4 text-5xl font-extrabold text-green-700">
                ₹{recommendedRent.toLocaleString()}
              </p>

              <p className="mt-3 text-sm text-green-700">
                Based on the recommended 30% salary allocation rule.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default AffordabilityCalculator;