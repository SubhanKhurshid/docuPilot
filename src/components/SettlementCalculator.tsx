import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalculatorIcon,
  CheckIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  ClockIcon,
  DollarSignIcon
} from 'lucide-react';

interface InjuryData {
  [key: string]: {
    medicalBills: number;
    lostWages: number;
    painMultiplier: number;
    description: string;
  };
}

const SettlementCalculator: React.FC = () => {
  const [selectedInjury, setSelectedInjury] = useState('');
  const [medicalBills, setMedicalBills] = useState(0);
  const [futureMedical, setFutureMedical] = useState(0);
  const [lostWages, setLostWages] = useState(0);
  const [futureLostWages, setFutureLostWages] = useState(0);
  const [propertyDamage, setPropertyDamage] = useState(0);
  const [painMultiplier, setPainMultiplier] = useState(2);
  const [negligencePercentage, setNegligencePercentage] = useState(0);
  const policyLimit = 100000;
  const evidenceStrength = 0.8;

  const injuryDefaults: InjuryData = {
    'whiplash': { medicalBills: 3500, lostWages: 2000, painMultiplier: 2, description: 'Neck strain from sudden movement' },
    'broken-arm': { medicalBills: 8000, lostWages: 4000, painMultiplier: 2.5, description: 'Fractured arm bone requiring treatment' },
    'burn': { medicalBills: 12000, lostWages: 6000, painMultiplier: 3, description: 'Thermal injury to skin and tissue' },
    'acl-tear': { medicalBills: 25000, lostWages: 8000, painMultiplier: 3.5, description: 'Anterior cruciate ligament injury' },
    'concussion': { medicalBills: 15000, lostWages: 5000, painMultiplier: 3, description: 'Traumatic brain injury' },
    'knee-injury': { medicalBills: 18000, lostWages: 6000, painMultiplier: 3, description: 'Knee joint damage' },
    'shoulder-dislocation': { medicalBills: 6000, lostWages: 3000, painMultiplier: 2.5, description: 'Shoulder joint displacement' },
    'fractured-rib': { medicalBills: 7000, lostWages: 3500, painMultiplier: 2.5, description: 'Broken rib bone' },
    'hip-fracture': { medicalBills: 35000, lostWages: 12000, painMultiplier: 4, description: 'Hip bone fracture' },
    'ankle-fracture': { medicalBills: 10000, lostWages: 4000, painMultiplier: 2.5, description: 'Broken ankle bone' },
    'back-strain': { medicalBills: 5000, lostWages: 3000, painMultiplier: 2.5, description: 'Lower back muscle strain' },
    'herniated-disc': { medicalBills: 20000, lostWages: 8000, painMultiplier: 3.5, description: 'Spinal disc displacement' },
    'brain-injury': { medicalBills: 75000, lostWages: 25000, painMultiplier: 5, description: 'Traumatic brain injury' },
    'spinal-cord-injury': { medicalBills: 150000, lostWages: 50000, painMultiplier: 5, description: 'Spinal cord damage' }
  };

  const handleInjuryChange = (injury: string) => {
    setSelectedInjury(injury);
    if (injury && injuryDefaults[injury]) {
      const defaults = injuryDefaults[injury];
      setMedicalBills(defaults.medicalBills);
      setLostWages(defaults.lostWages);
      setPainMultiplier(defaults.painMultiplier);
    }
  };

  const calculateSettlement = () => {
    const totalMedical = medicalBills + futureMedical;
    const totalWages = lostWages + futureLostWages;
    const economicDamages = totalMedical + totalWages + propertyDamage;
    const painAndSuffering = totalMedical * painMultiplier;
    const grossSettlement = economicDamages + painAndSuffering;
    const adjustedForNegligence = grossSettlement * (1 - negligencePercentage / 100);
    const finalSettlement = Math.min(adjustedForNegligence * evidenceStrength, policyLimit);
    
    return Math.round(finalSettlement);
  };

  const estimatedValue = calculateSettlement();

  return (
    <section className="py-24 border-t border-[#222222] bg-gradient-to-b from-[#0a0a0a] to-[#111111]">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 mb-6 rounded-full border border-[#333333] bg-[#111111]/80 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl">🧾</div>
              <span className="text-sm text-gray-300 font-medium">Settlement Value Calculator</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
              Estimate Your Claim Value in Minutes
            </h2>
            <p className="text-xl text-gray-300 font-normal max-w-3xl mx-auto leading-relaxed">
              Wondering what your personal injury claim could be worth? Use our Settlement Value Calculator to get a quick, personalized estimate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Calculator Form */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#333333]/50 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8dff2d] to-[#7be525] flex items-center justify-center">
                      <CalculatorIcon className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Settlement Calculator</h3>
                      <p className="text-sm text-gray-400">Get your personalized estimate</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Injury Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Your Injury Type
                      </label>
                      <select
                        value={selectedInjury}
                        onChange={(e) => handleInjuryChange(e.target.value)}
                        className="w-full bg-[#222222]/80 border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent"
                      >
                        <option value="">-- Select Injury --</option>
                        <option value="whiplash">Whiplash</option>
                        <option value="broken-arm">Broken Arm</option>
                        <option value="burn">Burn Injury</option>
                        <option value="acl-tear">ACL Tear</option>
                        <option value="concussion">Concussion</option>
                        <option value="knee-injury">Knee Injury</option>
                        <option value="shoulder-dislocation">Shoulder Dislocation</option>
                        <option value="fractured-rib">Fractured Rib</option>
                        <option value="hip-fracture">Hip Fracture</option>
                        <option value="ankle-fracture">Ankle Fracture</option>
                        <option value="back-strain">Back Strain</option>
                        <option value="herniated-disc">Herniated Disc</option>
                        <option value="brain-injury">Traumatic Brain Injury</option>
                        <option value="spinal-cord-injury">Spinal Cord Injury</option>
                      </select>
                    </div>

                    {/* Medical Bills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Past Medical Bills ($)
                        </label>
                        <input
                          type="number"
                          value={medicalBills}
                          onChange={(e) => setMedicalBills(Number(e.target.value))}
                          className="w-full bg-[#222222]/80 border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Future Medical Bills ($)
                        </label>
                        <input
                          type="number"
                          value={futureMedical}
                          onChange={(e) => setFutureMedical(Number(e.target.value))}
                          className="w-full bg-[#222222]/80 border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Lost Wages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Past Lost Wages ($)
                        </label>
                        <input
                          type="number"
                          value={lostWages}
                          onChange={(e) => setLostWages(Number(e.target.value))}
                          className="w-full bg-[#222222]/80 border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Future Lost Wages ($)
                        </label>
                        <input
                          type="number"
                          value={futureLostWages}
                          onChange={(e) => setFutureLostWages(Number(e.target.value))}
                          className="w-full bg-[#222222]/80 border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Property Damage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Property Damage & Expenses ($)
                      </label>
                      <input
                        type="number"
                        value={propertyDamage}
                        onChange={(e) => setPropertyDamage(Number(e.target.value))}
                        className="w-full bg-[#222222]/80 border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    {/* Pain & Suffering Multiplier */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pain & Suffering Multiplier: {painMultiplier}x
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={painMultiplier}
                        onChange={(e) => setPainMultiplier(Number(e.target.value))}
                        className="w-full h-2 bg-[#333333] rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Minor (1x)</span>
                        <span>Life-changing (5x)</span>
                      </div>
                    </div>

                    {/* Comparative Negligence */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Fault Percentage: {negligencePercentage}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={negligencePercentage}
                        onChange={(e) => setNegligencePercentage(Number(e.target.value))}
                        className="w-full h-2 bg-[#333333] rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Estimated Settlement */}
                    <motion.div
                      className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#8dff2d]/10 to-[#7be525]/10 border border-[#8dff2d]/20"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-center">
                        <p className="text-sm text-gray-300 mb-2">Estimated Settlement Value</p>
                        <div className="text-4xl font-bold text-[#8dff2d] mb-2">
                          ${estimatedValue.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-400">
                          *This is an estimate. Actual results may vary.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Information Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {/* How It Works */}
              <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#333333]/50">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <ClockIcon className="h-6 w-6 text-[#8dff2d]" />
                  How It Works
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Just enter the details you know — no legal jargon, no guesswork:
                </p>
                <div className="space-y-4">
                  {[
                    "Medical Bills (Past & Future): The care you've already received and any treatment you'll still need.",
                    "Lost Wages (Past & Future): Income you've missed and any reduced earning ability moving forward.",
                    "Property Damage & Expenses: Repairs, replacements, and out-of-pocket costs tied to your accident.",
                    "Pain & Suffering Multiplier: Reflects the severity of your injuries (minor to life-changing).",
                    "Comparative Negligence: Adjusts if you share responsibility for the accident.",
                    "Policy Limits & Evidence Strength: Factors that affect how much insurance will actually pay."
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-2 h-2 bg-[#8dff2d] rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Why It Matters */}
              <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#333333]/50">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <TrendingUpIcon className="h-6 w-6 text-[#8dff2d]" />
                  Why It Matters
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  The calculator gives you a realistic ballpark figure — but the difference between a low settlement and the maximum payout comes down to how your claim is handled.
                </p>
              </div>

              {/* Why Choose Us */}
              <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#333333]/50">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-[#8dff2d]" />
                  Why Choose Us
                </h3>
                <p className="text-gray-300 mb-6">When you sign up, we help you:</p>
                <div className="space-y-3">
                  {[
                    "Present the strongest evidence to raise your payout",
                    "Ensure all damages (medical, wage loss, future costs) are fully counted",
                    "Prevent insurers from unfairly reducing your settlement",
                    "Strategically negotiate within policy limits"
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CheckIcon className="h-5 w-5 text-[#8dff2d] flex-shrink-0" />
                      <p className="text-gray-300">{benefit}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Take the Next Step */}
              <div className="bg-gradient-to-r from-[#8dff2d]/10 to-[#7be525]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#8dff2d]/20">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <DollarSignIcon className="h-6 w-6 text-[#8dff2d]" />
                  Take the Next Step
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Use the calculator today, then let us guide you through the process to secure the highest settlement possible for your case.
                </p>
                <motion.button
                  className="w-full bg-[#8dff2d] text-black font-semibold py-4 px-6 rounded-xl hover:bg-[#7be525] transition-all duration-300 shadow-lg hover:shadow-[#8dff2d]/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started with DocuPilot AI
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #8dff2d;
            cursor: pointer;
            border: 2px solid #111111;
            box-shadow: 0 0 10px rgba(141, 255, 45, 0.3);
          }

          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #8dff2d;
            cursor: pointer;
            border: 2px solid #111111;
            box-shadow: 0 0 10px rgba(141, 255, 45, 0.3);
          }
        `
      }} />
    </section>
  );
};

export default SettlementCalculator;
