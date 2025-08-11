import React, { useState, useEffect } from 'react';
import TypingPractice from './TypingPractice';
import './TypingPracticeWithExercises.less';
import { apiClient } from '../../utils/apiClient';
import { useSelector } from 'react-redux';
import { selectSkills } from '../../slices/skillsSlice';

interface Exercise {
  id: number;
  title: string;
  code: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  skill: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const TypingPracticeWithExercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showEditExercise, setShowEditExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newExercise, setNewExercise] = useState({
    title: '',
    code: '',
    difficulty: 'Medium' as const,
    language: 'JavaScript'
  });
  const [editExercise, setEditExercise] = useState({
    title: '',
    code: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    language: 'JavaScript'
  });

  // Get current skill from Redux store
  const skills = useSelector(selectSkills);
  const selectedSkill = skills.find(skill => skill.title) || { title: 'JavaScript' };
  const currentSkill = selectedSkill.title;

  // Load exercises from backend API on component mount
  useEffect(() => {
    const fetchExercises = async () => {
      if (!currentSkill) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.get(`/typing-exercises/${encodeURIComponent(currentSkill)}`);
        const exercisesData = response.data;
        
        setExercises(exercisesData);
        if (exercisesData.length > 0) {
          setSelectedExercise(exercisesData[0]);
        }
      } catch (err: any) {
        console.error('Error fetching typing exercises:', err);
        setError(err.response?.data?.error || 'Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [currentSkill]);

  // No longer need localStorage - exercises are managed by backend

  const handleAddExercise = async () => {
    if (!newExercise.title.trim() || !newExercise.code.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await apiClient.post('/typing-exercises', {
        title: newExercise.title,
        code: newExercise.code,
        difficulty: newExercise.difficulty,
        language: newExercise.language,
        skill: currentSkill
      });

      const newExerciseData = response.data;
      setExercises(prev => [newExerciseData, ...prev]);
      setNewExercise({
        title: '',
        code: '',
        difficulty: 'Medium',
        language: 'JavaScript'
      });
      setShowAddExercise(false);

      // Auto-select the new exercise
      setSelectedExercise(newExerciseData);
    } catch (err: any) {
      console.error('Error adding exercise:', err);
      alert(err.response?.data?.error || 'Failed to add exercise');
    }
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setEditExercise({
      title: exercise.title,
      code: exercise.code,
      difficulty: exercise.difficulty,
      language: exercise.language
    });
    setShowEditExercise(true);
  };

  const handleUpdateExercise = async () => {
    if (!editExercise.title.trim() || !editExercise.code.trim() || !editingExercise) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await apiClient.put(`/typing-exercises/${editingExercise.id}`, {
        title: editExercise.title,
        code: editExercise.code,
        difficulty: editExercise.difficulty,
        language: editExercise.language,
        skill: currentSkill
      });

      const updatedExercise = response.data;
      setExercises(prev => prev.map(ex => 
        ex.id === editingExercise.id ? updatedExercise : ex
      ));

      // Update selected exercise if it's the one being edited
      if (selectedExercise?.id === editingExercise.id) {
        setSelectedExercise(updatedExercise);
      }

      setEditExercise({
        title: '',
        code: '',
        difficulty: 'Medium',
        language: 'JavaScript'
      });
      setEditingExercise(null);
      setShowEditExercise(false);
    } catch (err: any) {
      console.error('Error updating exercise:', err);
      alert(err.response?.data?.error || 'Failed to update exercise');
    }
  };

  const handleDeleteExercise = async (exerciseId: number) => {
    if (exercises.length <= 1) {
      alert('Cannot delete the last exercise. At least one exercise must remain.');
      return;
    }

    if (confirm('Are you sure you want to delete this exercise?')) {
      try {
        await apiClient.delete(`/typing-exercises/${exerciseId}`);
        
        setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
        
        // If the deleted exercise was selected, select the first remaining one
        if (selectedExercise?.id === exerciseId) {
          const remainingExercises = exercises.filter(ex => ex.id !== exerciseId);
          setSelectedExercise(remainingExercises[0] || null);
        }
      } catch (err: any) {
        console.error('Error deleting exercise:', err);
        alert(err.response?.data?.error || 'Failed to delete exercise');
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#f44336';
      default: return '#65877a';
    }
  };

  return (
    <div className="typing-practice-with-exercises">
      <div className="exercises-sidebar">
        <div className="sidebar-header">
          <h3>Typing Exercises</h3>
          <button 
            className="add-exercise-btn"
            onClick={() => setShowAddExercise(true)}
            title="Add New Exercise"
          >
            +
          </button>
        </div>

        <div className="exercises-list">
          {exercises.map((exercise) => (
            <div 
              key={exercise.id}
              className={`exercise-item ${selectedExercise?.id === exercise.id ? 'selected' : ''}`}
              onClick={() => setSelectedExercise(exercise)}
            >
              <div className="exercise-header">
                <h4 className="exercise-title">{exercise.title}</h4>
                <div className="exercise-actions">
                  <button 
                    className="edit-exercise-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditExercise(exercise);
                    }}
                    title="Edit Exercise"
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-exercise-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExercise(exercise.id);
                    }}
                    title="Delete Exercise"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="exercise-meta">
                <span className="exercise-language">{exercise.language}</span>
                <span 
                  className="exercise-difficulty"
                  style={{ color: getDifficultyColor(exercise.difficulty) }}
                >
                  {exercise.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="typing-practice-main">
        {loading ? (
          <div className="loading-state">
            <p>Loading exercises...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : selectedExercise ? (
          <TypingPractice 
            key={selectedExercise.id}
            codeText={selectedExercise.code}
          />
        ) : (
          <div className="no-exercise-selected">
            <p>Select an exercise from the sidebar to start practicing</p>
          </div>
        )}
      </div>

      {showAddExercise && (
        <div className="add-exercise-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Exercise</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddExercise(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Exercise Title</label>
                <input
                  type="text"
                  value={newExercise.title}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter exercise title..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Language</label>
                  <select
                    value={newExercise.language}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, language: e.target.value }))}
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="React">React</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="CSS">CSS</option>
                    <option value="HTML">HTML</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={newExercise.difficulty}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Code</label>
                <textarea
                  value={newExercise.code}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter the code to practice typing..."
                  rows={12}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddExercise(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleAddExercise}
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditExercise && (
        <div className="add-exercise-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Exercise</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditExercise(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Exercise Title</label>
                <input
                  type="text"
                  value={editExercise.title}
                  onChange={(e) => setEditExercise(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter exercise title..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Language</label>
                  <select
                    value={editExercise.language}
                    onChange={(e) => setEditExercise(prev => ({ ...prev, language: e.target.value }))}
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="React">React</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="CSS">CSS</option>
                    <option value="HTML">HTML</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={editExercise.difficulty}
                    onChange={(e) => setEditExercise(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Code</label>
                <textarea
                  value={editExercise.code}
                  onChange={(e) => setEditExercise(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter the code to practice typing..."
                  rows={12}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowEditExercise(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleUpdateExercise}
              >
                Update Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingPracticeWithExercises;
