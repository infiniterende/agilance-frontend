"use client";
import { useEffect, useState } from "react";

interface Patient {
  id: number;
  name: string;
  gender: string;
  age: number;
  pain_quality: string;
  location: string;
  stress: string;
  sob: string;
  hypertension: string;
  diabetes: string;
  hyperlipidemia: string;
  smoking: string;
}
const API = "http://ec2-18-116-202-251.us-east-2.compute.amazonaws.com";
export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch(`${API}:8000/api/patients`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setPatients(data);
    };

    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Patients</h1>
      <table className="border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Pain Quality</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.gender}</td>
              <td className="border p-2">{p.age}</td>
              <td className="border p-2">{p.pain_quality}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
