// import { useState } from 'react';

// const API_BASE_URL = 'http://localhost:8000';

// export default function AppointmentScheduler({ sessionId, onBack, onComplete }) {
//   const [formData, setFormData] = useState({
//     patient_name: '',
//     email: '',
//     phone: '',
//     preferred_date: '',
//     preferred_time: '',
//     insurance_provider: '',
//     reason_for_visit: '',
//     emergency_contact: '',
//     emergency_phone: ''
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [appointmentId, setAppointmentId] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/appointment/schedule`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           session_id: sessionId
//         })
//       });

//       const result = await response.json();

//       if (result.success) {
//         setAppointmentId(result.appointment_id);
//         setSubmitted(true);
//       } else {
//         alert('Error scheduling appointment. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error scheduling appointment:', error);
//       alert('Error scheduling appointment. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Get minimum date (today)
//   const today = new Date().toISOString().split('T')[0];

//   // Generate time slots
//   const timeSlots = [
//     '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
//     '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
//     '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
//   ];

//   if (submitted) {
//     return (
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//           <div className="text-6xl mb-4">✅</div>
//           <h2 className="text-2xl font-bold text-green-800 mb-4">
//             Appointment Request Submitted!
//           </h2>
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
//             <p className="text-green-800 mb-2">
//               <strong>Appointment ID:</strong> {appointmentId}
//             </p>
//             <p className="text-green-700">
//               You will receive confirmation within 2 business hours at {formData.email}
//             </p>
//           </div>

//           <div className="text-left mb-6 p-4 bg-gray-50 rounded-lg">
//             <h3 className="font-semibold text-gray-800 mb-3">Appointment Details:</h3>
//             <div className="space-y-2 text-sm">
//               <div><strong>Patient:</strong> {formData.patient_name}</div>
//               <div><strong>Email:</strong> {formData.email}</div>
//               <div><strong>Phone:</strong> {formData.phone}</div>
//               <div><strong>Preferred Date:</strong> {new Date(formData.preferred_date).toLocaleDateString()}</div>
//               <div><strong>Preferred Time:</strong> {formData.preferred_time}</div>
//               {formData.insurance_provider && (
//                 <div><strong>Insurance:</strong> {formData.insurance_provider}</div>
//               )}
//             </div>
//           </div>

//           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
//             <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
//             <ul className="text-sm text-blue-700 space-y-1">
//               <li>• Our scheduling team will review your request</li>
//               <li>• You'll receive confirmation via email and phone</li>
//               <li>• If your preferred time isn't available, we'll offer alternatives</li>
//               <li>• Please arrive 15 minutes early for your appointment</li>
//               <li>• Bring your insurance card and a list of current medications</li>
//             </ul>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={onComplete}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//             >
//               🏠 Return to Home
//             </button>
//             <button
//               onClick={() => window.print()}
//               className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
//             >
//               🖨️ Print Confirmation
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="mb-6">
//         <button
//           onClick={onBack}
//           className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
//         >
//           ← Back to Results
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-lg p-8">
//         <div className="text-center mb-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Schedule Cardiology Appointment
//           </h2>
//           <p className="text-gray-600">
//             Please fill out the form below to schedule your appointment
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Personal Information */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="patient_name"
//                   value={formData.patient_name}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your full name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="your.email@example.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="(555) 123-4567"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Insurance Provider
//                 </label>
//                 <select
//                   name="insurance_provider"
//                   value={formData.insurance_provider}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select Insurance Provider</option>
//                   <option value="aetna">Aetna</option>
//                   <option value="anthem">Anthem</option>
//                   <option value="blue_cross">Blue Cross Blue Shield</option>
//                   <option value="cigna">Cigna</option>
//                   <option value="humana">Humana</option>
//                   <option value="kaiser">Kaiser Permanente</option>
//                   <option value="medicare">Medicare</option>
//                   <option value="medicaid">Medicaid</option>
//                   <option value="united">United Healthcare</option>
//                   <option value="other">Other</option>
//                   <option value="self_pay">Self Pay</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Appointment Preferences */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Preferences</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Preferred Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="preferred_date"
//                   value={formData.preferred_date}
//                   onChange={handleInputChange}
//                   min={today}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Preferred Time *
//                 </label>
//                 <select
//                   name="preferred_time"
//                   value={formData.preferred_time}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select a time</option>
//                   {timeSlots.map(time => (
//                     <option key={time} value={time}>
//                       {new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
//                         hour: 'numeric',
//                         minute: '2-digit',
//                         hour12: true
//                       })}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Additional Information */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Reason for Visit
//                 </label>
//                 <textarea
//                   name="reason_for_visit"
//                   value={formData.reason_for_visit}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Brief description of your symptoms or concerns (optional)"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Emergency Contact Name
//                   </label>
//                   <input
//                     type="text"
//                     name="emergency_contact"
//                     value={formData.emergency_contact}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Emergency contact name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Emergency Contact Phone
//                   </label>
//                   <input
//                     type="tel"
//                     name="emergency_phone"
//                     value={formData.emergency_phone}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="(555) 123-4567"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Important Notes */}
//           <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
//             <h4 className="font-semibold text-blue-800 mb-2">Before Your Appointment:</h4>
//             <ul className="text-sm text-blue-700 space-y-1">
//               <li>• Arrive 15 minutes early for check-in</li>
//               <li>• Bring your insurance card and photo ID</li>
//               <li>• Prepare a list of current medications</li>
//               <li>• Bring any previous cardiac test results</li>
//               <li>• Consider bringing a family member or friend</li>
//             </ul>
//           </div>

//           {/* Submit Button */}
//           <div className="pt-6">
//             <button
//               type="submit"
//               disabled={submitting}
//               className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
//                 submitting
//                   ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                   : 'bg-blue-600 text-white hover:bg-blue-700'
//               }`}
//             >
//               {submitting ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Scheduling Appointment...
//                 </div>
//               ) : (
//                 '📅 Schedule Appointment'
//               )}
//             </button>
//           </div>

//           {/* Terms */}
//           <div className="text-center pt-4">
//             <p className="text-xs text-gray-600">
//               By scheduling this appointment, you agree to our{' '}
//               <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
//               {' '}and{' '}
//               <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
