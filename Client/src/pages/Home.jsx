import React, { useState } from "react";
import christmasBG from "../assets/christmasBG.jpeg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    difficulty: "",
    board: "", // Use integers to represent board sizes (4 or 9)
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "board" ? parseInt(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.difficulty || !form.board) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate form submission, e.g., sending data to a backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to the game page with the form data as state
      navigate("/game", { state: form });
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat py-10"
      style={{ backgroundImage: `url(${christmasBG})` }}
    >
      <div className="text-center">
        <h1 className="font-extrabold text-white text-4xl md:text-5xl">Home</h1>
        <h2 className="mt-4 text-lg text-white max-w-lg mx-auto">
          Welcome to Edamame's Sudoku Game
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md mt-8 space-y-6">
        {/* Name */}
        <div className="flex flex-col gap-2 mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-100"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block w-full p-3 transition-all duration-200 ease-in-out"
            placeholder="Enter your name"
          />
        </div>

        {/* Difficulty Level */}
        <div className="flex flex-col gap-2 mb-4">
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-gray-100"
          >
            Select Difficulty Level
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block w-full p-3 appearance-none"
          >
            <option value="">Select an Option</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Board Size */}
        <div className="flex flex-col gap-2 mb-4">
          <label
            htmlFor="board"
            className="block text-sm font-medium text-gray-100"
          >
            Select Board Size
          </label>
          <select
            id="board"
            name="board"
            value={form.board}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block w-full p-3"
          >
            <option value="">Select an Option</option>
            <option value="4">4x4</option>
            <option value="9">9x9</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mb-4 flex justify-center items-center">
          <button
            type="submit"
            style={{
              backgroundColor: loading ? "#6469ff" : "#6469ff",
              color: "white",
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#6469ff] text-white text-sm font-medium rounded-lg transition-all duration-200 ease-in-out hover:bg-[#5a60e8] focus:ring-4 focus:ring-[#4649ff] disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Loading..." : "Start Game"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Home;
