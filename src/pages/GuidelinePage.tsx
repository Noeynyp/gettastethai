import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const { mustHave, niceToHave } = guidelinesData[profile];

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
        <img src="/logo_R.png" alt="Logo" style={{ width: '140px', marginBottom: '20px' }} />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#910811', marginBottom: '30px' }}>
          Guidelines for {profile}
        </h2>

        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ background: '#FFF4D8', borderRadius: '15px', padding: '20px 24px', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ color: '#B45309', fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>Must Have</div>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {mustHave.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
            </ul>
          </div>

          <div style={{ background: '#F1F9E8', borderRadius: '15px', padding: '20px 24px', textAlign: 'left' }}>
            <div style={{ color: '#4A6741', fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>Nice to Have</div>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {niceToHave.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
            </ul>
          </div>
        </div>

        <button
          onClick={() => console.log('Download report')}
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
