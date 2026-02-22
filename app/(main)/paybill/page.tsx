"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AppHeader from "@/components/layout/AppHeader";
import CardContainer from "@/components/ui/CardContainer";
import FormInput from "@/components/forms/FormInput";
import PrimaryButton from "@/components/ui/PrimaryButton";

/**
 * Pay Bill - Bill payment page
 * Account lookup, amount entry
 */
export default function PayBillPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  return (
    <>
      <AppHeader title="Pay Bill" useRouterBack />
      <div className="flex-1 px-5 py-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardContainer className="mb-6">
            <h3 className="font-semibold text-white mb-2">Quick Pay</h3>
            <p className="text-sm text-white/70">
              Enter your account number and amount to pay your bill securely.
            </p>
          </CardContainer>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Account Number"
              type="text"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
            <FormInput
              label="Amount (KES)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <PrimaryButton type="submit" loading={loading}>
              Pay Now
            </PrimaryButton>
          </form>
        </motion.div>
      </div>
    </>
  );
}
