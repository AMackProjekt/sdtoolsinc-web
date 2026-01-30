"use client";

import { useState } from "react";
import { CourseType, DifficultyLevel, programs } from "@/lib/courseData";
import { motion } from "framer-motion";

interface CourseFilterProps {
  onFilterChange: (filters: {
    programId?: string;
    type?: CourseType;
    level?: DifficultyLevel;
    search?: string;
  }) => void;
}

export function CourseFilter({ onFilterChange }: CourseFilterProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<CourseType | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleProgramChange = (value: string) => {
    setSelectedProgram(value);
    notifyFilterChange(value, selectedType, selectedLevel, searchQuery);
  };

  const handleTypeChange = (value: CourseType | "all") => {
    setSelectedType(value);
    notifyFilterChange(selectedProgram, value, selectedLevel, searchQuery);
  };

  const handleLevelChange = (value: DifficultyLevel | "all") => {
    setSelectedLevel(value);
    notifyFilterChange(selectedProgram, selectedType, value, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    notifyFilterChange(selectedProgram, selectedType, selectedLevel, value);
  };

  const notifyFilterChange = (
    program: string,
    type: CourseType | "all",
    level: DifficultyLevel | "all",
    search: string
  ) => {
    onFilterChange({
      programId: program !== "all" ? program : undefined,
      type: type !== "all" ? (type as CourseType) : undefined,
      level: level !== "all" ? (level as DifficultyLevel) : undefined,
      search: search || undefined,
    });
  };

  const resetFilters = () => {
    setSelectedProgram("all");
    setSelectedType("all");
    setSelectedLevel("all");
    setSearchQuery("");
    onFilterChange({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-panel/50 backdrop-blur-xl border border-border rounded-xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text">Filter Courses</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-brand hover:text-brand2 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Search</label>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-text placeholder-muted focus:outline-none focus:border-brand transition-colors text-sm"
          />
        </div>

        {/* Program Filter */}
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => handleProgramChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-text focus:outline-none focus:border-brand transition-colors text-sm"
          >
            <option value="all">All Programs</option>
            {programs.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Course Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Course Type</label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value as CourseType | "all")}
            className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-text focus:outline-none focus:border-brand transition-colors text-sm"
          >
            <option value="all">All Types</option>
            <option value="online">Online</option>
            <option value="in-class">In-Class</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Difficulty Level Filter */}
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => handleLevelChange(e.target.value as DifficultyLevel | "all")}
            className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-text focus:outline-none focus:border-brand transition-colors text-sm"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
