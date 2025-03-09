import React, { useState } from "react";
import { Plus, Trash, Calendar, MessageSquare, ArrowRight, CheckCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function SurveyTool() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    type: "multiple-choice",
    question: "",
    options: []
  });
  const [duration, setDuration] = useState(1);
  const [surveyTitle, setSurveyTitle] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion({ ...newQuestion, [name]: value });
  };

  const handleTitleChange = (e) => {
    setSurveyTitle(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleAddOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, ""]
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    if (newQuestion.question.trim() === "") return;
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ 
      type: newQuestion.type, 
      question: "", 
      options: newQuestion.type === "multiple-choice" || newQuestion.type === "dropdown-checkbox" ? [] : newQuestion.options 
    });
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!surveyTitle.trim()) {
      alert("Please provide a survey title");
      return;
    }
    
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    const surveyData = {
      title: surveyTitle,
      duration,
      questions,
    };
  
    const res=await fetch(`/api/survey/upload_survey/${currentUser.usertype}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(surveyData),
    })
    const data=await res.json();
    if(data.success===false){
      console.log(data.message);
      return;
    }
    console.log("Survey Submitted", { title: surveyTitle, questions, duration });
    navigate('/');
  };

  const getQuestionTypeIcon = (type) => {
    switch(type) {
      case "multiple-choice": 
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "open-ended": 
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case "rating-scale": 
        return <Settings className="w-4 h-4 text-orange-500" />;
      default: 
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-12">
      <div className="w-full max-w-2xl p-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Create a Survey</h1>
            <p className="text-gray-500">Design your Survey form</p>
          </div>

          {/* Survey Title */}
          <div className="space-y-3">
            <label htmlFor="survey-title" className="text-sm font-medium text-gray-700 block">
              Survey Title
            </label>
            <input
              type="text"
              id="survey-title"
              value={surveyTitle}
              onChange={handleTitleChange}
              placeholder="Enter survey title"
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Survey Duration */}
          <div className="space-y-3">
            <label htmlFor="duration" className="text-sm font-medium text-gray-700 block">
              Survey Duration (days)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                id="duration"
                min="1"
                value={duration}
                onChange={handleDurationChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Add New Question Section */}
          <div className="space-y-4 border border-gray-200 rounded-xl p-4">
            <h3 className="text-lg font-medium text-gray-800">Add New Question</h3>
            
            {/* Question Type */}
            <div className="space-y-2">
              <label htmlFor="question-type" className="text-sm font-medium text-gray-700 block">
                Question Type
              </label>
              <select
                id="question-type"
                name="type"
                value={newQuestion.type}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="rating-scale">Rating Scale</option>
                <option value="open-ended">Open-Ended</option>
                <option value="yes-no">Yes/No</option>
              </select>
            </div>
            
            {/* Question Text */}
            <div className="space-y-2">
              <label htmlFor="question-text" className="text-sm font-medium text-gray-700 block">
                Question Text
              </label>
              <input
                type="text"
                id="question-text"
                name="question"
                value={newQuestion.question}
                onChange={handleInputChange}
                placeholder="Enter your question"
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            {/* Options for Multiple Choice or Dropdown */}
            {(newQuestion.type === "multiple-choice" || newQuestion.type === "dropdown-checkbox") && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">
                  Answer Options
                </label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="relative">
                    <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                ))}
                <button 
                  onClick={handleAddOption} 
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Option</span>
                </button>
              </div>
            )}
            
            {/* Add Question Button */}
            <button 
              onClick={addQuestion} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2"
              disabled={!newQuestion.question.trim()}
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Questions List */}
          {questions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800">Survey Questions</h3>
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {getQuestionTypeIcon(q.type)}
                      <span className="text-gray-800">{q.question}</span>
                    </div>
                    <button 
                      onClick={() => removeQuestion(index)} 
                      className="text-red-500 hover:text-red-700 transition duration-200"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Survey Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 group"
            disabled={questions.length === 0 || !surveyTitle.trim()}
          >
            <span>Create Survey</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}