import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import { useUser } from '../contexts/UserContext';

// Define allowed profile types
type ProfileType = 'Cultural Food Traveler' | 'Food-Driven Traveler' | 'Leisure Traveler';

const guidelinesData: Record<ProfileType, { mustHave: string[]; niceToHave: string[] }> = {
  'Cultural Food Traveler': {
    mustHave: [
      'Use authentic Thai ingredients sourced from Thailand',
      'Traditional dish presentation e.g. banana leaves',
      'Menu design using Thai language and Thai-style fonts',
      'Staff interaction offering dish recommendations and sharing Thai culinary culture',
      'Showcase Thai chefs preparing Thai dishes'
    ],
    niceToHave: [
      'Thai traditional music or calming ambient soundscapes',
      'Cultural activities like Thai dessert wrapping'
    ]
  },
  'Food-Driven Traveler': {
    mustHave: [
      'Use traditional Thai ingredients such as fish sauce, shrimp paste and galangal',
      'Storytelling on the menu about the origin and cultural background of dishes',
      'Staff interaction offering dish recommendations and sharing Thai culinary culture',
      'Thai-style exterior with carved wood, bamboo, or traditional signage'
    ],
    niceToHave: [
      'Cultural storytelling via placemats or QR codes',
      'Open kitchen or chef\'s counter to showcase cooking techniques'
    ]
  },
  'Leisure Traveler': {
    mustHave: [
      'Use fresh Thai herbs and vegetables',
      'Menu design using Thai language and Thai-style fonts',
      'Staff interaction offering dish recommendations and sharing Thai culinary culture',
      'Welcome guests with a traditional Thai greeting'
    ],
    niceToHave: [
      'Showcase Thai chefs preparing Thai dishes',
      'Demonstrate traditional Thai methods like mortar and pestle or clay pot'
    ]
  }
};

const GuidelinesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const profile = (location.state?.customerProfile || 'Cultural Food Traveler') as ProfileType;
  const dimensionScores = location.state?.dimensionScores || [];
  const { mustHave, niceToHave } = guidelinesData[profile];
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.setTextColor(145, 8, 17);
    doc.text(`Guidelines for ${profile}`, 20, y);
    y += 10;

    if (dimensionScores.length === 4) {
      const dimensionLabels = ['Ingredients', 'Visual Appearance', 'Cultural & Local Experiences', 'Servicescape'];
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Spider Chart Scores:', 20, y);
      y += 8;
      dimensionScores.forEach((score: number, i: number) => {
        doc.text(`- ${dimensionLabels[i]}: ${score.toFixed(2)}`, 25, y);
        y += 7;
      });
      y += 10;
    }

    doc.setFontSize(14);
    doc.setTextColor(180, 83, 9);
    doc.text('Must Have', 20, y);
    y += 8;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    mustHave.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`- ${item}`, 25, y);
      y += 7;
    });

    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(74, 103, 65);
    doc.text('Nice to Have', 20, y);
    y += 8;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    niceToHave.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`- ${item}`, 25, y);
      y += 7;
    });

    doc.save(`GET_AUTHENTIC_GUIDELINE_${profile.replace(/\s+/g, '_')}.pdf`);
  };

  const baseUrl = import.meta.env.BASE_URL;

  const travelerImages: Record<string, string[]> = {
    'Leisure Traveler': [`${baseUrl}leisure1.png`, `${baseUrl}leisure2.png`],
    'Food-Driven Traveler': [`${baseUrl}food1.png`, `${baseUrl}food2.png`],
    'Cultural Food Traveler': [`${baseUrl}cultural1.png`, `${baseUrl}cultural2.png`],
  };

  const selectedImages = travelerImages[profile];

  const handleAIRequest = async () => {
    if (!image && !chatInput.trim()) return;
    if (!user?.email) {
      setChatHistory((prev) => [...prev, { sender: 'ai', text: 'User email not found. Please log in again.' }]);
      return;
    }
    const question = chatInput;
    setChatHistory((prev) => [...prev, { sender: 'user', text: question }]);
    setChatInput('');
    setLoading(true);

    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('profile_type', profile);
    formData.append('question', question);
    if (image) formData.append('files', image);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        body: formData,
      });
      const data = await res.text();
      setChatHistory((prev) => [...prev, { sender: 'ai', text: data }]);
    } catch {
      setChatHistory((prev) => [...prev, { sender: 'ai', text: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: '30px 5vw', fontFamily: 'system-ui', position: 'relative' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ backgroundColor: '#910811', color: 'white', border: 'none', borderRadius: '25px', padding: '10px 24px', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px', cursor: 'pointer', marginBottom: '20px' }}
      >BACK</button>

      <div style={{ textAlign: 'center' }}>
        <img src={`${import.meta.env.BASE_URL}logo_R.png`} alt="Logo" style={{ width: 'clamp(120px, 25vw, 200px)', height: 'auto', marginTop: '10px', marginBottom: '10px' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '16px 0' }}>
          {selectedImages.map((imgSrc, idx) => (
            <img key={idx} src={imgSrc} alt={`Traveler ${idx + 1}`} style={{ width: 'clamp(70px, 20vw, 100px)', height: 'clamp(100px, 30vw, 150px)', borderRadius: '50px', objectFit: 'cover' }} />
          ))}
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#910811', marginBottom: '24px' }}>Guidelines for {profile}</h2>

        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#D1A000', color: '#fff', padding: '6px 14px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', fontWeight: 'bold', fontSize: '1rem', width: 'fit-content', marginBottom: '-1px' }}>Must Have</div>
            <div style={{ background: '#FFF9ED', borderRadius: '15px', padding: '12px 16px', textAlign: 'left' }}>
              <ul style={{ paddingLeft: '16px', margin: 0, lineHeight: '1.3', fontSize: '0.85rem' }}>
                {mustHave.map((item, i) => (<li key={i} style={{ marginBottom: '6px' }}>{item}</li>))}
              </ul>
            </div>
          </div>

          <div>
            <div style={{ backgroundColor: '#6E853E', color: '#fff', padding: '6px 14px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', fontWeight: 'bold', fontSize: '1rem', width: 'fit-content', marginBottom: '-1px' }}>Nice to Have</div>
            <div style={{ background: '#FFF9ED', borderRadius: '15px', padding: '12px 16px', textAlign: 'left' }}>
              <ul style={{ paddingLeft: '16px', margin: 0, lineHeight: '1.3', fontSize: '0.85rem' }}>
                {niceToHave.map((item, i) => (<li key={i} style={{ marginBottom: '6px' }}>{item}</li>))}
              </ul>
            </div>
          </div>
        </div>

        <button onClick={downloadPDF} style={{ backgroundColor: '#910811', color: 'white', border: 'none', borderRadius: '35px', padding: '14px 30px', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '40px', width: '100%', maxWidth: '420px', cursor: 'pointer' }}>Download Report</button>
      </div>

      <button onClick={() => setAiModalOpen(true)} style={{ position: 'fixed', bottom: 20, right: 20, backgroundColor: '#910811', color: 'white', border: 'none', borderRadius: '50%', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer' }}>
        <StarIcon />
      </button>

      {aiModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '12px' // Ensures spacing on small screens
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            width: '100%',
            maxWidth: '600px',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: '#910811',
              color: 'white',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <StarIcon style={{ fontSize: 20 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Assistant</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Ask for improvement suggestions</p>
                </div>
              </div>
              <button 
                onClick={() => setAiModalOpen(false)} 
                style={{ 
                  backgroundColor: 'white',
                  color: '#910811',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  padding: 0, // <-- IMPORTANT: remove extra padding
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #910811',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  lineHeight: 1 // Optional: ensures text stays centered vertically
                }}
              >
                ✕
              </button>

            </div>

            {/* File Upload */}
            <div style={{ padding: '12px 20px', backgroundColor: '#f8f8f8', borderBottom: '1px solid #eee' }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px dashed #ccc',
                  borderRadius: 8,
                  backgroundColor: 'white',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              />
              {image && (
                <div style={{
                  marginTop: 8,
                  padding: '6px 12px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: 6,
                  fontSize: '0.85rem',
                  color: '#2d5a2d'
                }}>
                  📎 {image.name}
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              backgroundColor: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {chatHistory.length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
                  No messages yet. Start the conversation!
                </div>
              )}

              {chatHistory.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: msg.sender === 'user' ? '#910811' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#333',
                    fontSize: '0.9rem',
                    whiteSpace: 'pre-wrap',
                    boxShadow: msg.sender === 'ai' ? '0 1px 5px rgba(0,0,0,0.05)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  color: '#aaa',
                  fontSize: '0.85rem'
                }}>
                  AI is typing...
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid #eee',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '10px'
            }}>
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  minHeight: 40,
                  maxHeight: 100,
                  resize: 'none',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  border: '1.5px solid #ccc',
                  borderRadius: 20,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAIRequest();
                  }
                }}
              />
              <button
                onClick={handleAIRequest}
                disabled={loading || (!chatInput.trim() && !image)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: loading || (!chatInput.trim() && !image) ? '#ccc' : '#910811',
                  color: 'white',
                  fontSize: '1.2rem',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: loading || (!chatInput.trim() && !image) ? 'not-allowed' : 'pointer'
                }}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default GuidelinesPage;