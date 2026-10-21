import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import { backendService } from "../services/backendService.js";

const FamilyContext = createContext(null);

const DEFAULT_FAMILY_MEMBERS = [
  {
    id: 1,
    name: "Ramesh K. (Father)",
    relationship: "Father",
    dateOfBirth: "1962-08-15",
    gender: "Male",
    bloodGroup: "B+",
    chronicConditions: "Hypertension, Type-2 Diabetes",
    allergies: "Penicillin",
    emergencyContact: "+91 98765 43210",
    notes: "Requires bi-weekly fasting glucose monitoring."
  },
  {
    id: 2,
    name: "Sunita K. (Mother)",
    relationship: "Mother",
    dateOfBirth: "1966-11-20",
    gender: "Female",
    bloodGroup: "O+",
    chronicConditions: "Mild Thyroid, Osteoarthritis",
    allergies: "Sulfa drugs",
    emergencyContact: "+91 98765 43210",
    notes: "Thyroxine 50mcg in morning."
  }
];

export function FamilyProvider({ children }) {
  const { currentUser } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [activeMember, setActiveMember] = useState(null); // null means "Self" (primary patient)
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [currentUser?.uid]);

  const loadMembers = async () => {
    if (!currentUser?.uid) return;
    setLoadingMembers(true);
    try {
      const data = await backendService.getFamilyMembers(currentUser.uid);
      if (Array.isArray(data) && data.length > 0) {
        setFamilyMembers(data);
      } else {
        // Fallback to initial demo members
        setFamilyMembers(DEFAULT_FAMILY_MEMBERS);
      }
    } catch (_) {
      // In case backend is not reached yet, load demo family members
      setFamilyMembers(DEFAULT_FAMILY_MEMBERS);
    } finally {
      setLoadingMembers(false);
    }
  };

  const addFamilyMember = async (memberData) => {
    try {
      if (currentUser?.uid) {
        const saved = await backendService.createFamilyMember(currentUser.uid, memberData);
        setFamilyMembers((prev) => [...prev, saved]);
        return saved;
      }
    } catch (_) {
      // Local fallback
      const localSaved = {
        ...memberData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setFamilyMembers((prev) => [...prev, localSaved]);
      return localSaved;
    }
  };

  const removeFamilyMember = async (id) => {
    try {
      if (currentUser?.uid) {
        await backendService.deleteFamilyMember(id, currentUser.uid);
      }
    } catch (_) {}
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    if (activeMember?.id === id) {
      setActiveMember(null);
    }
  };

  const effectiveUserId = activeMember 
    ? `${currentUser?.uid || "demo_user"}_fam_${activeMember.id}`
    : (currentUser?.uid || "demo_user");

  const effectivePatientName = activeMember 
    ? activeMember.name 
    : (currentUser?.displayName || "Primary Account Holder");

  return (
    <FamilyContext.Provider
      value={{
        familyMembers,
        activeMember,
        setActiveMember,
        effectiveUserId,
        effectivePatientName,
        addFamilyMember,
        removeFamilyMember,
        loadingMembers,
        reloadMembers: loadMembers
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return ctx;
}
