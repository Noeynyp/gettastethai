import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

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
      'Open kitchen or chef’s counter to showcase cooking techniques'
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
  const profile = (location.state?.customerProfile || 'Cultural Food Traveler') as ProfileType;
  const dimensionScores = location.state?.dimensionScores || [];
  const { mustHave, niceToHave } = guidelinesData[profile];

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

  const travelerImages: Record<ProfileType, string[]> = {
    'Leisure Traveler': ['/leisure1.png', '/leisure2.png'],
    'Food-Driven Traveler': ['/food1.png', '/food2.png'],
    'Cultural Food Traveler': ['/cultural1.png', '/cultural2.png']
  };

  const selectedImages = travelerImages[profile];


  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: '30px 5vw', fontFamily: 'system-ui' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: '#910811',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          padding: '10px 24px',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          letterSpacing: '1px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        BACK
      </button>

      <div style={{ textAlign: 'center' }}>
        <img
          src="/logo_R.png"
          alt="Logo"
          style={{
            width: 'clamp(120px, 25vw, 200px)',
            maxWidth: '100%',
            height: 'auto',
            marginTop: '10px',
            marginBottom: '10px'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '16px 0' }}>
          {selectedImages.map((imgSrc, idx) => (
            <img
              key={idx}
              src={imgSrc}
              alt={`Traveler ${idx + 1}`}
              style={{
                width: 'clamp(70px, 20vw, 100px)',
                height: 'clamp(100px, 30vw, 150px)',
                borderRadius: '50px',
                objectFit: 'cover'
              }}
            />
          ))}
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#910811', marginBottom: '24px' }}>
          Guidelines for {profile}
        </h2>


        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              backgroundColor: '#D1A000',
              color: '#fff',
              padding: '6px 14px',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              fontWeight: 'bold',
              fontSize: '1rem',
              width: 'fit-content',
              marginBottom: '-1px'
            }}>
              Must Have
            </div>
            <div style={{
              background: '#FFF9ED',
              borderRadius: '15px',
              padding: '16px 20px',
              textAlign: 'left'
            }}>
              <ul style={{ paddingLeft: '18px', margin: 0, lineHeight: '1.5' }}>
                {mustHave.map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px', fontSize: '0.95rem' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div style={{
              backgroundColor: '#6E853E',
              color: '#fff',
              padding: '6px 14px',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              fontWeight: 'bold',
              fontSize: '1rem',
              width: 'fit-content',
              marginBottom: '-1px'
            }}>
              Nice to Have
            </div>
            <div style={{
              background: '#FFF9ED',
              borderRadius: '15px',
              padding: '16px 20px',
              textAlign: 'left'
            }}>
              <ul style={{ paddingLeft: '18px', margin: 0, lineHeight: '1.5' }}>
                {niceToHave.map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px', fontSize: '0.95rem' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>


        <button
          onClick={downloadPDF}
          style={{
            backgroundColor: '#910811',
            color: 'white',
            border: 'none',
            borderRadius: '35px',
            padding: '14px 30px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginTop: '40px',
            width: '100%',
            maxWidth: '420px',
            cursor: 'pointer'
          }}
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default GuidelinesPage;