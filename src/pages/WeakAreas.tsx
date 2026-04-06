import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import AIInsights from '../components/AIInsights';
import { db } from '../firebase';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";

export default function WeakAreas() {
  const { recommendations, subjects, user, addToast } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeRecommendation = async (id: string) => {
    if (!user) return;
    const rec = recommendations.find(r => r.id === id);
    if (!rec) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'recommendations', id), { liked: !rec.liked });
    } catch (e) {
      console.error("Failed to like recommendation", e);
    }
  };

  const handleDismissRecommendation = async (id: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'recommendations', id), { dismissed: true });
    } catch (e) {
      console.error("Failed to dismiss recommendation", e);
    }
  };

  const generateAIInsights = async () => {
    if (!user) return;
    setIsLoading(true);
    addToast("AI is analyzing your performance...", "info");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `Analyze this A/L student's study data and provide 2-3 actionable recommendations. 
      Subjects: ${JSON.stringify(subjects.map(s => ({ name: s.name, readiness: s.readiness, weakCount: s.weakCount })))}
      Return a JSON array of objects with fields: id, title, description, priority (High/Medium/Low), reason.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const newRecs = JSON.parse(response.text || "[]");
      const batch = writeBatch(db);
      newRecs.forEach((rec: any) => {
        const id = Math.random().toString(36).substr(2, 9);
        const recRef = doc(db, 'users', user.uid, 'recommendations', id);
        batch.set(recRef, { ...rec, id, liked: false, dismissed: false });
      });
      await batch.commit();
      addToast("New AI recommendations generated!", "success");
    } catch (error) {
      console.error("AI Analysis failed:", error);
      addToast("AI analysis failed. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Weak Areas & AI Insights</h1>
            <p className="text-gray-400">Actionable recommendations based on your study patterns.</p>
          </div>
          <button 
            onClick={generateAIInsights}
            disabled={isLoading}
            className="px-6 py-3 bg-[#1DB954] text-black rounded-full font-bold hover:scale-105 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Refresh Insights'}
          </button>
        </div>
        <AIInsights 
          recommendations={recommendations} 
          onLike={handleLikeRecommendation} 
          onDismiss={handleDismissRecommendation} 
          isLoading={isLoading} 
        />
      </div>
    </motion.div>
  );
}
