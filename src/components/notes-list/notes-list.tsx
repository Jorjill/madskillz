import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import Particles from 'react-particles';
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import { Canvas } from '@react-three/fiber';
import "./notes-list.less";
import { Scene3D } from './Scene3D';
import {
  selectNote,
  selectAddNoteMode,
  selectEditNoteMode,
} from "../../slices/notesSlice";
import { DeleteModal } from "../modal/delete-modal";
import { notesThunks } from "../../slices/notesSlice";

interface Note {
  id: string;
  notes_title: string;
  content: string;
  tags: string[];
  updated_at: string;
}

const NoteCard = ({ note, onDelete, onEdit }: { note: Note; onDelete: (id: string) => void; onEdit: (title: string) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  const { scale } = useSpring({
    scale: isHovered ? 1.1 : 1,
    config: { mass: 1, tension: 200, friction: 20 }
  });

  return (
    <animated.div
      ref={cardRef}
      className="list-box"
      style={{
        scale,
        transform: isHovered ? 'translateZ(50px)' : 'translateZ(0px)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(note.notes_title)}
    >
      <motion.div 
        className="glow-effect"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.2 : 0 }}
      />
      <div className="title-icons">
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {note.notes_title}
        </motion.h3>
        <div className="actions">
          <motion.i 
            className="ri-edit-line"
            whileHover={{ scale: 1.2, rotate: 15 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note.notes_title);
            }}
          />
          <motion.i 
            className="ri-delete-bin-7-line"
            whileHover={{ scale: 1.2, rotate: -15 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
          />
        </div>
      </div>
      <motion.div 
        className="content"
        style={{ transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)' }}
      >
        {note.content}
      </motion.div>
      <div className="tags">
        {note.tags?.map((tag, index) => (
          <motion.span
            key={index}
            className="tag"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{ '--tag-index': index }}
            whileHover={{
              scale: 1.2,
              rotate: Math.random() * 10 - 5,
              transition: { duration: 0.2 }
            }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </animated.div>
  );
};

export const NotesList = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const reactNotes = useSelector((state) => state.notes.notes);

  const handleShowDeleteConfirmation = (title, id) => {
    setSelectedNote({ title, id });
    setShowDeleteConfirmation(true);
  };

  const extractTextFromHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const particlesInit = async (engine: Engine) => {
    console.log("Initializing particles");
    await loadFull(engine);
  };

  const particlesConfig = {
    fpsLimit: 60,
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#93c5b1"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#93c5b1",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
  };

  const filteredNotes = reactNotes.filter(
    (item) =>
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const filteredAndSortedNotes = [...filteredNotes].sort((a, b) => {
    if (!a.updated_at && !b.updated_at) return 0;
    if (!a.updated_at) return 1;
    if (!b.updated_at) return -1;
    return b.updated_at.localeCompare(a.updated_at);
  });

  return (
    <div className="notes-component">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        className="particles-bg"
      />
      
      <div className="view-controls">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode('grid')}
          className={viewMode === 'grid' ? 'active' : ''}
        >
          <i className="ri-grid-fill" /> Grid
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode('flow')}
          className={viewMode === 'flow' ? 'active' : ''}
        >
          <i className="ri-flow-chart" /> Flow
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode('3d')}
          className={viewMode === '3d' ? 'active' : ''}
        >
          <i className="ri-cube-line" /> 3D
        </motion.button>
      </div>

      <div className="input-and-button">
        <motion.input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          className="button"
          onClick={() => dispatch(selectAddNoteMode())}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="ri-add-line" /> Create Note
        </motion.button>
      </div>

      {viewMode === '3d' ? (
        <div className="canvas-container">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Scene3D />
          </Canvas>
        </div>
      ) : (
        <motion.div 
          className={`items-list-container ${viewMode}`}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              className="items-list"
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {filteredAndSortedNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NoteCard
                    note={note}
                    onDelete={(id) => handleShowDeleteConfirmation(note.notes_title, id)}
                    onEdit={(title) => {
                      dispatch(selectNote(title));
                      dispatch(selectEditNoteMode());
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {showDeleteConfirmation && (
        <DeleteModal
          show={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={() => {
            dispatch(notesThunks.deleteNote(selectedNote.id));
            setShowDeleteConfirmation(false);
          }}
          title={selectedNote?.title}
        />
      )}
    </div>
  );
};
