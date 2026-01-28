import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Sparkles, Trophy, Target, Zap } from "lucide-react";
import ProgressCircle from "./components/ProgressCircle";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const App = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const validateUserName = (name) => {
    if (!name.trim()) {
      setError("Username required");
      return false;
    }
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,29}$/;
    if (!regex.test(name)) {
      setError("Invalid username format (3-30 chars, alphanumeric/underscore/dash)");
      return false;
    }
    return true;
  };

  const fetchUserDetails = async (e) => {
    e.preventDefault();
    if (!validateUserName(username)) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `https://alfa-leetcode-api.onrender.com/${username}/progress`
      );

      if (!res.ok) {
        if (res.status === 404) throw new Error("LeetCode user not found");
        throw new Error("Failed to fetch data");
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Normalize API arrays safely
  const getStats = (arr) =>
    Object.fromEntries(arr.map((i) => [i.difficulty.toUpperCase(), i.count]));

  const progressData = data?.numAcceptedQuestions || {};
  const accepted = getStats(progressData.numAcceptedQuestions || []);
  const failed = getStats(progressData.numFailedQuestions || []);
  const untouched = getStats(progressData.numUntouchedQuestions || []);
  const beats = Object.fromEntries(
    (progressData.userSessionBeatsPercentage || []).map((i) => [
      i.difficulty.toUpperCase(),
      i.percentage,
    ])
  );

  const getTotal = (diff) =>
    (accepted[diff] || 0) + (failed[diff] || 0) + (untouched[diff] || 0);

  const totalSolved = Object.values(accepted).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-starry-sky bg-cover bg-center bg-fixed flex items-center justify-center p-6">
      <motion.div className="w-full max-w-3xl glass rounded-[2.5rem] p-8 md:p-12">
        {/* HEADER */}
        <header className="text-center mb-10">
          <div className="inline-block bg-leetcode-orange p-3 rounded-2xl mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-5xl font-black text-white">
            Leet<span className="text-leetcode-orange">Metric</span>
          </h1>
          <p className="text-white/40 text-xs tracking-widest uppercase mt-2">
            Performance Analytics Dashboard
          </p>
        </header>

        {/* SEARCH */}
        <form onSubmit={fetchUserDetails} className="relative mb-8">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="LeetCode Username"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white"
          />
          <button
            disabled={loading || !username.trim()}
            className="absolute right-2 top-2 bottom-2 bg-leetcode-orange px-6 rounded-xl flex items-center gap-2 text-white font-bold"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Search />
            )}
            Analyze
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-center mb-6 font-bold">{error}</p>
        )}

        {/* DASHBOARD */}
        <AnimatePresence>
          {data && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {/* PROGRESS CIRCLES */}
              <div className="flex justify-center gap-10 flex-wrap">
                <ProgressCircle
                  label="Easy"
                  solved={accepted.EASY || 0}
                  total={getTotal("EASY")}
                  color="#22c55e"
                />
                <ProgressCircle
                  label="Medium"
                  solved={accepted.MEDIUM || 0}
                  total={getTotal("MEDIUM")}
                  color="#eab308"
                />
                <ProgressCircle
                  label="Hard"
                  solved={accepted.HARD || 0}
                  total={getTotal("HARD")}
                  color="#ef4444"
                />
              </div>

              {/* STATS */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Total Solved",
                    value: totalSolved,
                    icon: <Trophy />,
                  },
                  {
                    label: "Easy Beats",
                    value: `${beats.EASY?.toFixed(1) || 0}%`,
                    icon: <Zap />,
                  },
                  {
                    label: "Medium Beats",
                    value: `${beats.MEDIUM?.toFixed(1) || 0}%`,
                    icon: <Target />,
                  },
                  {
                    label: "Hard Beats",
                    value: `${beats.HARD?.toFixed(1) || 0}%`,
                    icon: <Trophy />,
                  },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="glass-card p-6 rounded-3xl"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {s.icon}
                      <span className="text-white/50 uppercase text-xs">
                        {s.label}
                      </span>
                    </div>
                    <p className="text-4xl font-black text-white">
                      {s.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default App;
