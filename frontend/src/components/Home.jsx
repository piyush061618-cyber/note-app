// import React, { useEffect, useState } from 'react'
// import axios from 'axios';
// const Home = () =>{
//    const [notes ,setNotes] =useState([]);
//    const [error ,setError] =useState("");
//    console.log(notes);

//    const fetchNotes =async () =>{
//       try{
//         const token =localStorage.getItem("token");
//         if(!token){
//           setError("No authentication token found.please Log in");
//           return;
//         }
//         const {data} =await axios.get("/api/notes", {
//           headers:{Authorization : `Bearer ${token}`}
//         });
//         console.log(data);
//         setNotes(data);
//       }catch (error){
//         setError("Failed to fetch notes");
//       }
//    };
//    useEffect( () =>{
//      fetchNotes();
//    } ,[]);
//   return(
//     <div className='container mx-auto px-4 py-8 min-h-screen bg-gray-500'>
//         {
//           error && <p className='text-red-400 mb-4'>{error}</p>
//         }
//         <div>
//           {notes.map((note) =>(
//             <div className='bg-gray-800 p-4 rounded-lg shadow-md' key={note._id}>
//               <h3 className='text-lg font-medium text-white mb-2'>{note.title}</h3>
//               <p>{note.description}</p>
//               <p>{new Date(note.updatedAt).toLocaleString()}</p>
//               <div>
//                 <button>Edit</button>
//                 <button>Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//     </div>
//   )
// };

// export default Home;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  // State for the note being created or edited
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // State to track if we are currently editing a note
  const [editingNoteId, setEditingNoteId] = useState(null);
  // State for alert messages (e.g., "Note copied!")
  const [alertMessage, setAlertMessage] = useState(null);
  // State for confirming deletion (holds the ID of the note pending confirmation)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  // State to disable the form button during submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to get the auth token
  const getToken = () => localStorage.getItem('token');

  // --- Alert System (Custom component replacement for alert/confirm) ---
  const showAlert = (message, bgColor = 'bg-blue-600') => {
    setAlertMessage({ message, bgColor });
    // Auto-hide the alert after 3 seconds
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // --- API Calls ---

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const token = getToken();
      if (!token) {
        // This is handled by App.jsx redirect, but good to keep the check
        setError('No authentication token found. Please log in.');
        return;
      }

      const { data } = await axios.get('/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(data);
    } catch (error) {
      setError('Failed to fetch notes. Please check server status.');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create or Update Note
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return setError('Authentication required');
    if (!title.trim() || !description.trim()) return setError('Title and Description cannot be empty.');

    setIsSubmitting(true); // Disable button
    setError(''); // Clear previous error

    try {
      if (editingNoteId) {
        // Update existing note
        await axios.put(
          `/api/notes/${editingNoteId}`,
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingNoteId(null);
      } else {
        // Create new note
        await axios.post(
          '/api/notes',
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // Clear form and refresh list
      setTitle('');
      setDescription('');
      fetchNotes();
      
      // Show confirmation message
      showAlert(`Note ${editingNoteId ? 'updated' : 'added'} successfully!`);

    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      setError('Failed to save note. Ensure your server is running and data is valid.');
    } finally {
      setIsSubmitting(false); // Enable button
    }
  };

  // --- Note Actions ---

  // Initiates deletion confirmation modal
  const handleInitiateDelete = (id) => {
    setConfirmDeleteId(id);
  };
  
  // Confirms and executes deletion
  const handleDelete = async (id) => {
    setConfirmDeleteId(null); // Close confirmation modal
    const token = getToken();
    if (!token) return setError('Authentication required');
    
    try {
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter the deleted note out of the local state
      setNotes(notes.filter((note) => note._id !== id));
      showAlert('Note deleted successfully!', 'bg-red-600');
    } catch {
      setError('Failed to delete note. Check network or permissions.');
    }
  };

  // Edit note: populate the form with note data
  const handleEdit = (note) => {
    // Scroll to the top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingNoteId(note._id);
    setTitle(note.title);
    setDescription(note.description);
    setError(''); // Clear any existing errors when starting an edit
  };
  
  // Cancel editing and clear the form
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setTitle('');
    setDescription('');
    setError('');
  };

  // Copy note content: uses Clipboard API
  const handleCopy = (note) => {
    // Concatenate title and description
    navigator.clipboard.writeText(`${note.title}\n\n${note.description}`)
      .then(() => {
        showAlert('Note content copied to clipboard!', 'bg-green-600');
      })
      .catch(() => {
        showAlert('Failed to copy. Clipboard access denied.', 'bg-red-600');
      });
  };
  
  // --- Render ---

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-100">
      
      {/* Custom Alert Message (Fades in/out) */}
      {alertMessage && (
        <div className={`fixed top-4 right-4 ${alertMessage.bgColor} text-white p-4 rounded-lg shadow-xl animate-pulse transition-opacity duration-300 z-50`}>
          {alertMessage.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to permanently delete this note?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="max-w-lg mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium shadow-md">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      <div className="max-w-lg mx-auto mb-10 p-6 bg-white shadow-2xl rounded-xl border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">
          {editingNoteId ? 'Edit Your Note' : 'Create a New Note'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-600 transition shadow-inner"
            required
            maxLength="100"
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Write your note description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-4 focus:ring-blue-200 focus:border-blue-600 transition shadow-inner resize-none"
            required
            disabled={isSubmitting}
          ></textarea>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-grow text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting
                ? (editingNoteId ? 'Saving...' : 'Adding...')
                : (editingNoteId ? '💾 Update Note' : '➕ Add Note')}
            </button>
            {editingNoteId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-500 transition duration-200 shadow-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Notes Display */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Your Notes ({notes.length})</h2>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {notes.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-xl py-10 border-2 border-dashed border-gray-300 rounded-xl bg-white shadow-inner">
            You don't have any notes yet. Start by creating one above!
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between border-l-4 border-yellow-500"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 break-words">
                  {note.title}
                </h3>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap break-words min-h-[5rem]">
                  {note.description}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mt-2 mb-4">
                  Last updated: {new Date(note.updatedAt).toLocaleString()}
                </p>
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="flex-grow bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-2 rounded-lg transition font-medium shadow-md"
                    title="Edit Note"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleInitiateDelete(note._id)}
                    className="flex-grow bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg transition font-medium shadow-md"
                    title="Delete Note"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => handleCopy(note)}
                    className="flex-grow bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg transition font-medium shadow-md"
                    title="Copy Note Content"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;