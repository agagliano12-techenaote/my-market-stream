import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface NotesWidgetProps {
  onRemove: () => void;
}

interface Note {
  id: string;
  content: string;
  timestamp: Date;
}

export const NotesWidget = ({ onRemove }: NotesWidgetProps) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('dashboard-notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }));
    }
    return [{ id: '1', content: 'Welcome to your notes! Click to edit.', timestamp: new Date() }];
  });
  const [activeNote, setActiveNote] = useState<string | null>(notes[0]?.id || null);

  useEffect(() => {
    localStorage.setItem('dashboard-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      timestamp: new Date(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content, timestamp: new Date() } : n));
  };

  const deleteNote = (id: string) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (activeNote === id) {
      setActiveNote(filtered[0]?.id || null);
    }
  };

  const activeNoteData = notes.find(n => n.id === activeNote);

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title">Notes</span>
        <div className="flex gap-2">
          <button onClick={addNote} className="text-muted-foreground hover:text-success transition-colors">
            <Plus size={16} />
          </button>
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="widget-content h-[calc(100%-52px)] flex flex-col">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
          {notes.map((note, index) => (
            <button
              key={note.id}
              onClick={() => setActiveNote(note.id)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeNote === note.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              Note {index + 1}
              {notes.length > 1 && (
                <span
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="hover:text-destructive"
                >
                  <Trash2 size={12} />
                </span>
              )}
            </button>
          ))}
        </div>
        {activeNoteData && (
          <div className="flex-1 flex flex-col">
            <textarea
              value={activeNoteData.content}
              onChange={(e) => updateNote(activeNoteData.id, e.target.value)}
              className="flex-1 bg-secondary/50 border border-border rounded-lg p-4 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary font-mono scrollbar-thin"
              placeholder="Start typing your note..."
            />
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Save size={12} />
                Auto-saved
              </span>
              <span>
                Last edited: {activeNoteData.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
