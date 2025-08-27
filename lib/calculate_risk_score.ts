// import { AssessmentResponse } from "@/app/types";

// import { ASSESSMENT_QUESTIONS } from "./assessment_questions";

// export function classifyChestPain(
//   locationScore: number,
//   triggerScore: number,
//   reliefScore: number
// ): number {
//   // Typical angina: 3 points, Atypical angina: 2 points, Non-cardiac: 0-1 points
//   const totalScore = locationScore + triggerScore + reliefScore;

//   if (totalScore >= 3) return 3; // Typical angina
//   if (totalScore === 2) return 2; // Atypical angina
//   return 1; // Non-cardiac chest pain
// }

// type RiskFactors = {
//   age: number;
//   male: number;
//   chest_pain_type: number;
//   diabetes: number;
//   hypertension: number;
//   hyperlipidemia: number;
//   smoking: number;
// };
// export const cadc_clinical_risk = ({
//   age,
//   male,
//   chest_pain_type,
//   diabetes,
//   hypertension,
//   hyperlipidemia,
//   smoking,
// }: RiskFactors) => {
//   const b0 = -7.539;
//   const b_age = 0.062;
//   const b_male = 1.332;
//   const b_atyp = 0.633;
//   const b_typ = 1.998;
//   const b_diab = 0.828;
//   const b_htn = 0.338;
//   const b_dlp = 0.422;
//   const b_smk = 0.461;
//   const b_interact = -0.402;

//   let cp_atyp = 0;
//   if (chest_pain_type <= 2) {
//     cp_atyp = 1;
//   } else {
//     cp_atyp = 0;
//   }

//   let cp_typ = 0;
//   if (chest_pain_type >= 3) {
//     cp_typ = 1;
//   } else {
//     cp_typ = 0;
//   }
//   let dm = 0;
//   diabetes ? (dm = 1) : (dm = 0);

//   let htn = 0;

//   hypertension ? (htn = 1) : (htn = 0);

//   let dlp = 0;

//   hyperlipidemia ? (dlp = 1) : (dlp = 0);

//   let smk = 0;

//   smoking ? (smk = 1) : (smk = 0);

//   const logit_p =
//     b0 +
//     b_age * age +
//     b_male * male +
//     b_atyp * cp_atyp +
//     b_typ * cp_typ +
//     b_diab * dm +
//     b_htn * htn +
//     b_dlp * dlp +
//     b_smk * smk +
//     b_interact * (dm * cp_typ);

//   return 1 / (1 + Math.exp(-logit_p));
// };

// type ResponseScore = {
//   responses: Record<string, string>;
// };
// export function calculateRiskScore(responses: ResponseScore) {
//   let locationScore = 0;
//   let triggerScore = 0;
//   let reliefScore = 0;
//   let age = 0;
//   let male = 0;
//   let diabetesScore = 0;
//   let hypertensionScore = 0;
//   let dyslipidemia = 0;
//   let smokingScore = 0;

//   ASSESSMENT_QUESTIONS.forEach((question) => {
//     const questionId = question.id;
//     if (questionId in responses) {
//       const response = String(responses[questionId]).toLowerCase();

//       // Location scoring
//       if (questionId === "location") {
//         Object.keys(question.scoring).forEach((keyword) => {
//           if (response.includes(keyword)) {
//             locationScore = 1;
//           }
//         });
//       }

//       // Trigger scoring
//       if (questionId === "trigger") {
//         Object.keys(question.scoring).forEach((keyword) => {
//           if (response.includes(keyword)) {
//             triggerScore = 1;
//           }
//         });
//       }

//       // Relief scoring
//       if (questionId === "relief") {
//         Object.keys(question.scoring).forEach((keyword) => {
//           if (response.includes(keyword)) {
//             reliefScore = 1;
//           }
//         });
//       }

//       // Age
//       if (questionId === "age") {
//         age = parseInt(response);
//       }

//       // Gender
//       if (questionId === "sex" && response.includes("male")) {
//         male = 1;
//       }

//       // Risk factors
//       if (questionId === "risk_factors") {
//         if (response.includes("diabetes")) diabetesScore = 1;
//         if (response.includes("pressure")) hypertensionScore = 1;
//         if (response.includes("cholesterol")) dyslipidemia = 1;
//         if (response.includes("smoking")) smokingScore = 1;
//       }
//     }
//   });

//   const chestPainType = classifyChestPain(
//     locationScore,
//     triggerScore,
//     reliefScore
//   );
//   const riskProbability = cadc_clinical_risk({
//     age: age,
//     male: male,
//     chest_pain_type: chestPainType,
//     diabetes: diabetesScore,
//     hypertension: hypertensionScore,
//     hyperlipidemia: dyslipidemia,
//     smoking: smokingScore,
//   });

//   return riskProbability * 100;
// }
