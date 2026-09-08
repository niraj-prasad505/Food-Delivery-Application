// src/components/home/OrderingSteps.jsx
import { Utensils, Wallet, PackageCheck } from "lucide-react";

const ICONS = {
  Utensils,
  Wallet,
  PackageCheck,
};

const OrderingSteps = ({ steps }) => {
  return (
    <section className="bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-md mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">
            Simple and Easy
          </h2>
          <p className="text-sm text-[#6B7280] mt-2">
            Order your favorite meals in just a few steps!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = ICONS[step.icon] ?? Utensils;
            return (
              <div
                key={step.id}
                className="bg-[#FFF9F6] rounded-2xl p-6 text-center hover:shadow-sm transition-shadow"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FF6840]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#FF6840]" />
                </div>
                <h3 className="mt-4 font-semibold text-[#1F1F1F]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#6B7280]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OrderingSteps;