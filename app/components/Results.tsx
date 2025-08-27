// export default function Results({ result, onScheduleAppointment, onNewAssessment }) {
//   const getRiskLevelColor = (level) => {
//     switch (level) {
//       case 'HIGH':
//         return 'bg-red-100 border-red-500 text-red-800';
//       case 'MODERATE':
//         return 'bg-orange-100 border-orange-500 text-orange-800';
//       case 'LOW_MODERATE':
//         return 'bg-yellow-100 border-yellow-500 text-yellow-800';
//       default:
//         return 'bg-green-100 border-green-500 text-green-800';
//     }
//   };

//   const getRiskIcon = (level) => {
//     switch (level) {
//       case 'HIGH':
//         return '🚨';
//       case 'MODERATE':
//         return '⚠️';
//       case 'LOW_MODERATE':
//         return '⚡';
//       default:
//         return '✅';
//     }
//   };

//   const getActionButton = () => {
//     switch (result.recommendation) {
//       case 'EMERGENCY_ROOM':
//         return (
//           <div className="space-y-3">
//             <button
//               onClick={() => window.open('tel:911', '_self')}
//               className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
//             >
//               📞 Call 911 Now
//             </button>
//             <p className="text-sm text-red-600 text-center">
//               Do not drive yourself. Call for emergency transportation.
//             </p>
//           </div>
//         );
//       case 'URGENT_CARDIOLOGY':
//         return (
//           <div className="space-y-3">
//             <button
//               onClick={onScheduleAppointment}
//               className="w-full bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-colors"
//             >
//               📅 Schedule Urgent Appointment
//             </button>
//             <p className="text-sm text-orange-600 text-center">
//               Recommended within 24-48 hours
//             </p>
//           </div>
//         );
//       case 'CARDIOLOGY_APPOINTMENT':
//         return (
//           <button
//             onClick={onScheduleAppointment}
//             className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
//           >
//             📅 Schedule Cardiology Appointment
//           </button>
//         );
//       default:
//         return (
//           <div className="space-y-3">
//             <button
//               onClick={onScheduleAppointment}
//               className="w-full bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors"
//             >
//               📅 Schedule Follow-up (Optional)
//             </button>
//             <p className="text-sm text-gray-600 text-center">
//               Continue to monitor your symptoms
//             </p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">Assessment Results</h2>
//         <p className="text-gray-600">Based on your responses, here's our recommendation:</p>
//       </div>

//       {/* Main Result Card */}
//       <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
//         {/* Risk Level Badge */}
//         <div className="text-center mb-6">
//           <div className={`inline-flex items-center px-6 py-3 rounded-full border-2 ${getRiskLevelColor(result.risk_level)}`}>
//             <span className="text-2xl mr-2">{getRiskIcon(result.risk_level)}</span>
//             <span className="font-bold text-lg">
//               {result.risk_level.replace('_', ' ')} RISK LEVEL
//             </span>
//           </div>
//         </div>

//         {/* Risk Score */}
//         <div className="text-center mb-6">
//           <div className="text-4xl font-bold text-gray-800 mb-2">
//             Risk Score: {result.risk_score}
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-4">
//             <div
//               className={`h-4 rounded-full transition-all duration-500 ${
//                 result.risk_score >= 8 ? 'bg-red-500' :
//                 result.risk_score >= 5 ? 'bg-orange-500' :
//                 result.risk_score >= 2 ? 'bg-yellow-500' : 'bg-green-500'
//               }`}
//               style={{ width: `${Math.min((result.risk_score / 15) * 100, 100)}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Main Message */}
//         <div className="text-center mb-8">
//           <div className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
//             {result.message}
//           </div>
//         </div>

//         {/* Action Button */}
//         <div className="max-w-md mx-auto">
//           {getActionButton()}
//         </div>
//       </div>

//       {/* Risk Factors */}
//       {result.risk_factors && result.risk_factors.length > 0 && (
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//             <span className="mr-2">⚠️</span>
//             Identified Risk Factors
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {result.risk_factors.map((factor, index) => (
//               <div
//                 key={index}
//                 className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
//               >
//                 <span className="text-yellow-600 mr-2">•</span>
//                 <span className="text-gray-800">{factor}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Important Information */}
//       <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
//         <h4 className="font-semibold text-blue-800 mb-3">Important Information:</h4>
//         <ul className="text-sm text-blue-700 space-y-2">
//           <li>• This assessment is for informational purposes only and does not replace professional medical advice</li>
//           <li>• If your symptoms worsen at any time, seek immediate medical attention</li>
//           <li>• Consider calling 911 if you experience severe chest pain, difficulty breathing, or loss of consciousness</li>
//           <li>• Keep a record of your symptoms and any changes for your healthcare provider</li>
//         </ul>
//       </div>

//       {/* Emergency Contacts */}
//       <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
//         <h4 className="font-semibold text-red-800 mb-3">Emergency Contacts:</h4>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//           <div className="text-center">
//             <div className="font-semibold text-red-800">Emergency</div>
//             <button
//               onClick={() => window.open('tel:911', '_self')}
//               className="text-red-600 hover:text-red-800 font-medium"
//             >
//               911
//             </button>
//           </div>
//           <div className="text-center">
//             <div className="font-semibold text-red-800">Poison Control</div>
//             <button
//               onClick={() => window.open('tel:1-800-222-1222', '_self')}
//               className="text-red-600 hover:text-red-800 font-medium"
//             >
//               1-800-222-1222
//             </button>
//           </div>
//           <div className="text-center">
//             <div className="font-semibold text-red-800">Crisis Text Line</div>
//             <div className="text-red-600">Text HOME to 741741</div>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row gap-4 justify-center">
//         <button
//           onClick={onNewAssessment}
//           className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
//         >
//           🔄 New Assessment
//         </button>

//         <button
//           onClick={() => window.print()}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//         >
//           🖨️ Print Results
//         </button>
//       </div>

//       {/* Disclaimer */}
//       <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
//         <p className="text-xs text-gray-600">
//           This tool is powered by AI and provides general guidance only. It is not a substitute for professional medical advice,
//           diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions
//           you may have regarding a medical condition.
//         </p>
//       </div>
//     </div>
//   );
// }
