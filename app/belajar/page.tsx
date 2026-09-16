'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../src/store/authStore';
import { LEARNING_TOPICS, LearningTopic } from '../../src/data/learningTopics';
import { chatBubbleVariants, avatarVariants } from '../../src/components/badge';
import { fetchAIExplanationApi } from '../../src/services/apiService';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
}

function BelajarContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryTopicId = searchParams.get('topicId');
  const initialTopicId = queryTopicId ? parseInt(queryTopicId, 10) : 3;

  const [activeTopicId, setActiveTopicId] = useState<number>(initialTopicId || 3);
  const [activeTab, setActiveTab] = useState<'materi' | 'ai' | 'kuis'>('materi');
  const [completedTopicIds, setCompletedTopicIds] = useState<number[]>([]);
  
  // Code runner state
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [runCodeIndex, setRunCodeIndex] = useState<number | null>(null);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Completion modal
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [awardedXp, setAwardedXp] = useState<number>(0);

  // Load completed topics from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('completed_topics');
      if (saved) {
        setCompletedTopicIds(JSON.parse(saved));
      } else {
        // Defaults: topic 1 & 2 are completed
        const defaultCompleted = [1, 2];
        localStorage.setItem('completed_topics', JSON.stringify(defaultCompleted));
        setCompletedTopicIds(defaultCompleted);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Update activeTopic when search param changes
  useEffect(() => {
    if (queryTopicId) {
      const parsed = parseInt(queryTopicId, 10);
      if (!isNaN(parsed) && LEARNING_TOPICS.some(t => t.id === parsed)) {
        setActiveTopicId(parsed);
      }
    }
  }, [queryTopicId]);

  // Current topic
  const currentTopic: LearningTopic = 
    LEARNING_TOPICS.find(t => t.id === activeTopicId) || (LEARNING_TOPICS[0] as LearningTopic);

  const isCompleted = completedTopicIds.includes(currentTopic.id);

  // Reset chat & quiz when switching topic
  useEffect(() => {
    const studentDisplayName = user?.email ? user.email.split('@')[0] : 'Mahasiswa';
    setChatMessages([
      {
        id: 'welcome-1',
        role: 'bot',
        text: `Halo ${studentDisplayName}! 👋 Saya **NEXED AI Tutor** untuk materi perkuliahan **"${currentTopic.title}"** oleh **${currentTopic.lecturer}**.\n\nSilakan baca materi kuliah di sebelah kiri, atau tanyakan apapun yang belum kamu pahami dari topik ini!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setRunCodeIndex(null);
  }, [activeTopicId, user?.email, currentTopic.title, currentTopic.lecturer]);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'ai') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTyping, activeTab]);

  // Copy code handler
  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Run simulation handler
  const handleRunCode = (index: number) => {
    setRunCodeIndex(index);
  };

  // Send AI Message handler
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || chatInput;
    if (!textToSend.trim() || isAiTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setChatInput('');
    setIsAiTyping(true);

    try {
      // Use existing API service with intelligent fallback
      const apiResponse = await fetchAIExplanationApi(textToSend);
      let responseText = apiResponse.message;

      // Augment response if general
      const lower = textToSend.toLowerCase();
      if (lower.includes('analogi') || lower.includes('sehari-hari')) {
        if (currentTopic.id === 3) {
          responseText = `💡 **Analogi Kehidupan Nyata (Looping):**\n\n• **FOR Loop** seperti menekan tombol dispenser air untuk mengisi 5 botol minum secara berurutan. Kamu sudah tahu persis jumlah botolnya (5).\n• **WHILE Loop** seperti mengisi bak mandi hingga pelampung batas air naik. Kamu tidak menghitung berapa liter air mengalir, yang penting berhenti saat bak sudah penuh!`;
        } else if (currentTopic.id === 2) {
          responseText = `💡 **Analogi Kehidupan Nyata (Kondisional):**\n\nKondisional itu seperti lampu lalu lintas! JIKA lampu berwarna HIJAU, mobil melaju. JIKA KUNING, hati-hati. SELAIN ITU (MERAH), mobil harus berhenti total.`;
        } else {
          responseText = `💡 **Analogi Konseptual:**\nKonsep "${currentTopic.title}" ibarat resep memasak langkah-demi-langkah. Setiap instruksi harus jelas, runut, dan memiliki hasil akhir yang terukur.`;
        }
      } else if (lower.includes('contoh') || lower.includes('studi kasus')) {
        if (currentTopic.id === 3) {
          responseText = `💻 **Contoh Kasus Nyata Looping:**\n\nMisalkan kamu ingin memeriksa status kelulusan 100 mahasiswa:\n\`\`\`python\nfor mhs in daftar_mahasiswa:\n    if mhs['nilai'] >= 60:\n        print(f"{mhs['nama']} LULUS!")\n\`\`\`\nLooping menghemat 99 baris kode manual!`;
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: `Maaf, terjadi gangguan jaringan saat memproses jawaban. Namun untuk topik **${currentTopic.title}**, pastikan kamu memahami ${currentTopic.keyConcepts[0]?.subtitle || 'konsep dasar'} ya!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Complete Topic Handler
  const handleCompleteTopic = () => {
    if (!completedTopicIds.includes(currentTopic.id)) {
      const updated = [...completedTopicIds, currentTopic.id];
      setCompletedTopicIds(updated);
      try {
        localStorage.setItem('completed_topics', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      setAwardedXp(currentTopic.xp);
      setShowCompletionModal(true);
    } else {
      setShowCompletionModal(true);
      setAwardedXp(0);
    }
  };

  const handleNextTopic = () => {
    setShowCompletionModal(false);
    const nextTopic = LEARNING_TOPICS.find(t => t.id === currentTopic.id + 1);
    if (nextTopic) {
      setActiveTopicId(nextTopic.id);
      router.push(`/belajar?topicId=${nextTopic.id}`);
    } else {
      router.push('/mahasiswa');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col relative font-['Outfit'] overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/mahasiswa')}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs font-semibold shadow-sm"
              title="Kembali ke Dashboard Mahasiswa"
            >
              <span>&larr;</span>
              <span className="hidden sm:inline">Kembali ke Dashboard</span>
              <span className="sm:hidden">Kembali</span>
            </button>
            <div className="h-5 w-[1px] bg-white/10 hidden md:block"></div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{currentTopic.courseName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{currentTopic.classGroup}</span>
              </div>
              <h1 className="text-sm md:text-base font-extrabold text-white tracking-tight truncate max-w-[280px] sm:max-w-md">
                {currentTopic.meeting}: {currentTopic.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <span>👨‍🏫 Dosen:</span>
              <span className="text-white">{currentTopic.lecturer}</span>
            </div>

            <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300 text-xs font-extrabold shadow-sm">
              <span>⚡</span>
              <span>+{currentTopic.xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar: Silabus Materi Kuliah */}
        <aside className="w-full lg:w-80 shrink-0 space-y-4">
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <span>📚 Silabus Perkuliahan</span>
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {completedTopicIds.length}/{LEARNING_TOPICS.length} Selesai
              </span>
            </div>
            
            <p className="text-xs text-slate-400 font-light mb-4 leading-relaxed">
              Materi disusun langsung oleh <strong>{currentTopic.lecturer}</strong> untuk kurikulum Algoritma Pemrograman.
            </p>

            <div className="space-y-2">
              {LEARNING_TOPICS.map((topic) => {
                const isActive = topic.id === activeTopicId;
                const isItemCompleted = completedTopicIds.includes(topic.id);

                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setActiveTopicId(topic.id);
                      router.push(`/belajar?topicId=${topic.id}`);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 border flex items-start gap-3 relative group ${
                      isActive
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                        : isItemCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300 hover:bg-white/5'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isItemCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isActive
                        ? 'bg-purple-500 text-white shadow-md shadow-purple-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isItemCompleted ? '✓' : topic.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{topic.meeting}</span>
                        {topic.id === 3 && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            AI Rekomendasi
                          </span>
                        )}
                      </div>
                      <h3 className={`text-xs font-bold truncate ${isActive ? 'text-white font-extrabold' : 'text-slate-300'}`}>
                        {topic.title}
                      </h3>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>⚡ +{topic.xp} XP</span>
                        <span>•</span>
                        <span>⏱️ {topic.duration}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dosen Notes Box */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 p-5 rounded-3xl border border-indigo-500/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">💡</span>
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Pesan Dosen Pengampu</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light italic">
              &quot;Pelajari materi konsep secara menyeluruh sebelum mencoba latihan kuis. Gunakan NEXED AI Bot jika mengalami kebuntuan logika pemrograman!&quot;
            </p>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>{currentTopic.lecturer}</span>
              <span className="text-emerald-400 font-semibold">Aktif Membimbing</span>
            </div>
          </div>
        </aside>

        {/* Right Main Panel: Learning Workspace */}
        <main className="flex-1 flex flex-col gap-6">
          
          {/* Top Banner of Active Topic */}
          <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-white/15 overflow-hidden bg-gradient-to-br from-white/5 via-slate-900/50 to-purple-950/20 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                    {currentTopic.meeting} • {currentTopic.duration}
                  </span>
                  {isCompleted && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ✓ Sudah Dikuasai
                    </span>
                  )}
                  {currentTopic.status === 'recommended' && !isCompleted && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse">
                      🔥 Target AI Recommendation
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2 font-medium">
                  <span>Bobot: <strong>{currentTopic.sks} SKS</strong></span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
                {currentTopic.title}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-3xl mb-6">
                {currentTopic.description}
              </p>

              {/* Navigation Tabs */}
              <div className="flex gap-2 border-b border-white/10 pb-0 overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setActiveTab('materi')}
                  className={`px-5 py-3 rounded-t-2xl font-bold text-xs sm:text-sm transition-all border-t border-x flex items-center gap-2 ${
                    activeTab === 'materi'
                      ? 'bg-slate-900 border-purple-500 text-purple-300 border-b-2 border-b-transparent -mb-[1px] shadow-lg'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>📖</span>
                  <span>Materi & Teori Dosen</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-5 py-3 rounded-t-2xl font-bold text-xs sm:text-sm transition-all border-t border-x flex items-center gap-2 ${
                    activeTab === 'ai'
                      ? 'bg-slate-900 border-purple-500 text-purple-300 border-b-2 border-b-transparent -mb-[1px] shadow-lg'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>🤖</span>
                  <span>NEXED AI Tutor</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </button>

                <button
                  onClick={() => setActiveTab('kuis')}
                  className={`px-5 py-3 rounded-t-2xl font-bold text-xs sm:text-sm transition-all border-t border-x flex items-center gap-2 ${
                    activeTab === 'kuis'
                      ? 'bg-slate-900 border-purple-500 text-purple-300 border-b-2 border-b-transparent -mb-[1px] shadow-lg'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>✍️</span>
                  <span>Kuis Pemahaman</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 font-mono">
                    {currentTopic.quiz.length} Soal
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: MATERI & TEORI DOSEN */}
          {activeTab === 'materi' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              
              {/* Capaian Pembelajaran Lulusan (CPMK) */}
              <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-purple-400 text-lg">🎯</span>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Capaian Pembelajaran Mata Kuliah (CPMK Dosen)
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {currentTopic.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-light">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Konsep Inti */}
              <div className="space-y-6">
                {currentTopic.keyConcepts.map((concept, idx) => (
                  <div key={idx} className="bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/10 space-y-4">
                    <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>{concept.subtitle}</span>
                    </h4>
                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                      {concept.explanation}
                    </p>

                    {/* Interactive Code Block */}
                    {concept.codeSnippet && (
                      <div className="mt-4 rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0d1117] shadow-xl">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
                          <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                            <span className="ml-2 text-slate-400">script.py</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleCopyCode(concept.codeSnippet || '', idx)}
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-all flex items-center space-x-1"
                            >
                              <span>{copiedCodeIndex === idx ? '✓ Tersalin!' : '📋 Salin Kode'}</span>
                            </button>
                            <button
                              onClick={() => handleRunCode(idx)}
                              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-600/30 flex items-center space-x-1"
                            >
                              <span>▶️ Jalankan Simulasi</span>
                            </button>
                          </div>
                        </div>

                        <pre className="p-4 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                          <code>{concept.codeSnippet}</code>
                        </pre>

                        {runCodeIndex === idx && concept.codeOutput && (
                          <div className="border-t border-slate-800 bg-black/70 p-4 font-mono text-xs">
                            <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                              <span>✓ Output Terminal (Simulasi):</span>
                            </div>
                            <pre className="text-slate-300 whitespace-pre-wrap">{concept.codeOutput}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Tips Dosen Alert Box */}
              <div className="p-6 rounded-3xl bg-amber-950/30 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">⚠️</span>
                  <h4 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider">
                    Catatan Khusus & Tips Ujian dari Dosen
                  </h4>
                </div>
                <ul className="space-y-2">
                  {currentTopic.lecturerTips.map((tip, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-amber-200/90 font-light flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons to proceed */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => setActiveTab('ai')}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-all flex items-center gap-2"
                >
                  <span>🤖 Tanya NEXED Bot Tentang Topik Ini</span>
                </button>

                <button
                  onClick={handleCompleteTopic}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 border border-emerald-400/40 transition-all transform hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>{isCompleted ? '✓ Pelajaran Sudah Selesai' : `✅ Selesaikan Materi (+${currentTopic.xp} XP)`}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: NEXED AI TUTOR (CHAT INTERAKTIF) */}
          {activeTab === 'ai' && (
            <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/10 flex flex-col h-[650px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
              
              {/* Chat Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
                <div className="flex items-center space-x-3">
                  <div className={avatarVariants({ role: 'bot' })}>
                    NX
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-white">NEXED AI Tutor</h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                    <p className="text-[11px] text-slate-400">Membimbing topik: <strong>{currentTopic.title}</strong></p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
                  Didukung Silabus Dosen
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={avatarVariants({ role: msg.role })}>
                        {isUser ? 'ME' : 'NX'}
                      </div>
                      <div className="flex flex-col gap-1 max-w-[85%]">
                        <div
                          className={chatBubbleVariants({ role: msg.role })}
                          style={{
                            background: isUser
                              ? 'linear-gradient(135deg, #9333ea, #7c3aed)'
                              : '#1e293b',
                            color: '#ffffff',
                            border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                            {msg.text}
                          </div>
                        </div>
                        <span className={`text-[10px] text-slate-500 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isAiTyping && (
                  <div className="flex items-start gap-3">
                    <div className={avatarVariants({ role: 'bot' })}>NX</div>
                    <div className="p-4 rounded-2xl bg-slate-800 text-slate-400 rounded-tl-none border border-white/10 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-xs text-slate-400 ml-2">NEXED Bot sedang merumuskan jawaban...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Starter Question Chips */}
              <div className="p-3 bg-black/40 border-t border-white/5 overflow-x-auto hide-scrollbar flex gap-2">
                <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap self-center mr-1">Rekomendasi Pertanyaan:</span>
                {currentTopic.suggestedQuestions.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    disabled={isAiTyping}
                    className="px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs whitespace-nowrap transition-all hover:scale-[1.02]"
                  >
                    💬 {promptText}
                  </button>
                ))}
              </div>

              {/* Chat Input Box */}
              <div className="p-4 bg-slate-900 border-t border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Tanyakan materi ${currentTopic.title} ke NEXED Bot...`}
                    className="flex-1 bg-black/40 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isAiTyping || !chatInput.trim()}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Kirim</span>
                    <span>&rarr;</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: KUIS PEMAHAMAN */}
          {activeTab === 'kuis' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Evaluasi Pemahaman Topik</h3>
                    <p className="text-xs text-slate-400 font-light mt-1">
                      Kuis formatif disiapkan oleh <strong>{currentTopic.lecturer}</strong> untuk menguji ketuntasan belajar.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {currentTopic.quiz.length} Pertanyaan
                  </span>
                </div>

                {/* Questions List */}
                <div className="space-y-8">
                  {currentTopic.quiz.map((q, qIndex) => {
                    const answered = selectedAnswers[qIndex] !== undefined;
                    const selectedIdx = selectedAnswers[qIndex];
                    const isCorrect = selectedIdx === q.correctIndex;

                    return (
                      <div key={qIndex} className="space-y-4 p-5 rounded-2xl bg-black/30 border border-white/5">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-300 flex items-center justify-center text-xs font-black shrink-0">
                            {qIndex + 1}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                            {q.question}
                          </h4>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10">
                          {q.options.map((option, optIdx) => {
                            const isSelected = selectedIdx === optIdx;
                            let btnStyle = "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10";

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = "bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20";
                              } else if (isSelected && !isCorrect) {
                                btnStyle = "bg-red-950/50 border-red-500 text-red-300";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-purple-600/30 border-purple-500 text-white shadow-md shadow-purple-500/20";
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIdx }));
                                }}
                                className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                              >
                                <span className="font-mono font-bold mr-2 text-slate-400">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{option}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation when submitted */}
                        {quizSubmitted && (
                          <div className={`mt-3 ml-10 p-3.5 rounded-xl text-xs leading-relaxed border ${
                            isCorrect
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                              : 'bg-red-950/30 border-red-500/30 text-red-200'
                          }`}>
                            <div className="font-bold mb-1">
                              {isCorrect ? '✅ Jawaban Benar!' : '❌ Jawaban Kurang Tepat'}
                            </div>
                            <div>{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quiz Action Bar */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={Object.keys(selectedAnswers).length < currentTopic.quiz.length}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all"
                    >
                      Periksa Jawaban Kuis
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedAnswers({});
                        }}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                      >
                        🔄 Coba Lagi
                      </button>

                      <button
                        onClick={handleCompleteTopic}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30"
                      >
                        ✅ Selesaikan Topik & Klaim XP
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none -mr-10 -mt-10"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/40">
              🎉
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Selamat! Topik Tuntas</h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light mt-2 leading-relaxed">
                Kamu telah menyelesaikan sesi pembelajaran pada topik <strong>{currentTopic.title}</strong> bersama NEXED AI!
              </p>
            </div>

            {awardedXp > 0 && (
              <div className="py-3 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-lg inline-block">
                ⚡ +{awardedXp} XP Berhasil Ditambahkan!
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={handleNextTopic}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all"
              >
                Lanjut ke Topik Berikutnya &rarr;
              </button>

              <button
                onClick={() => router.push('/mahasiswa')}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-bold text-sm border border-white/10 transition-all"
              >
                Kembali ke Dashboard Mahasiswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BelajarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-['Outfit']">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-300">Memuat Ruang Belajar NEXED...</span>
        </div>
      </div>
    }>
      <BelajarContent />
    </Suspense>
  );
}
