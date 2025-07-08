import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AssessmentPage = () => {
  const questions = [
    { text: "We use ingredients locally sourced from Thailand such as kaffir lime, lemongrass, Thai lime and Thai chili.", category: "Ingredients" },
    { text: "We use fresh Thai herbs and vegetables in our dishes.", category: "Ingredients" },
    { text: "We use hot and spicy ingredients like Thai chili or chili paste in our menu.", category: "Ingredients" },
    { text: "Our dishes use traditional Thai flavor ingredients such as fish sauce, shrimp paste, and galangal.", category: "Ingredients" },
    { text: "We serve Thai dishes that feature unique or less familiar ingredients.", category: "Ingredients" },
    { text: "Our Thai dishes are carefully plated with attention to visual presentation.", category: "Visual Appearance" },
    { text: "We use visual presentation elements such as banana leaves or vegetable carving.", category: "Visual Appearance" },
    { text: "Our menu uses Thai language or Thai-style fonts to reflect Thai identity.", category: "Visual Appearance" },
    { text: "Our menu includes stories or descriptions of the origin and cultural background of Thai dishes.", category: "Visual Appearance" },
    { text: "We avoid presenting Thai dishes in overly modern or fusion styles that could reduce authenticity.", category: "Visual Appearance" },
    { text: "Our restaurant features Thai cultural performances such as classical dance or live traditional music.", category: "Cultural & Local Experiences" },
    { text: "We demonstrate traditional Thai cooking methods like using a mortar and pestle or clay pot.", category: "Cultural & Local Experiences" },
    { text: "We offer hands-on cultural activities such as dessert wrapping or preparing chili paste.", category: "Cultural & Local Experiences" },
    { text: "Our service staff recommends Thai dish pairings and explains Thai food culture.", category: "Cultural & Local Experiences" },
    { text: "We present local Thai ingredients or allow guests to observe food preparation.", category: "Cultural & Local Experiences" },
    { text: "Our restaurant’s exterior design includes traditional Thai features such as carved wood, bamboo, or Thai-style signage that reflects Thai identity.", category: "Servicescape" },
    { text: "Our restaurant’s interior features Thai elements such as traditional furniture, lighting, artwork, or poetry.", category: "Servicescape" },
    { text: "We serve food with Thai-style tableware and utensils.", category: "Servicescape" },
    { text: "We use Thai-style table settings, such as shared samrub meals or flower decorations.", category: "Servicescape" },
    { text: "The dining area features natural aromas from Thai herbs or ingredients like coconut milk and lemongrass.", category: "Servicescape" },
    { text: "We play traditional Thai music or music by Thai artists in our restaurant.", category: "Servicescape" },
    { text: "Guests may hear our staff speaking Thai among themselves during service.", category: "Servicescape" },
    { text: "Our guests are welcomed with a traditional Thai greeting.", category: "Servicescape" },
    { text: "Guests can see Thai chefs preparing dishes in the kitchen or open counter.", category: "Servicescape" },
    { text: "Our staff wears traditional Thai clothing during service.", category: "Servicescape" }
  ];

  const [scores, setScores] = useState<number[]>(Array(questions.length).fill(4));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/result', { state: { scores, categories: questions.map(q => q.category) } });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedScores = [...scores];
    updatedScores[currentQuestionIndex] = parseInt(e.target.value);
    setScores(updatedScores);
  };

  const value = scores[currentQuestionIndex];
  const progressPercentage = Math.round((currentQuestionIndex + 1) / questions.length * 100);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '30px 5vw' }}>
      <button
        onClick={handleBack}
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
          marginBottom: '20px',
          marginLeft: 0
        }}
      >
        BACK
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '10px' }}>
        <img src={`${import.meta.env.BASE_URL}logo_R.png`}  alt="Logo" style={{ width: '120px', height: 'auto', margin: '10px 0 0 0' }} />
        <div style={{ fontSize: '1.4rem', color: '#910811', fontWeight: '600', marginTop: '5px' }}>Self-Assessment Tool</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', maxWidth: '500px', marginInline: 'auto' }}>
        <p style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <div style={{ height: '8px', width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: '#d62e2e', transition: 'width 0.3s ease' }} />
        </div>
        <p style={{ color: '#d62e2e', fontWeight: '600' }}>{progressPercentage}%</p>
      </div>

      <div style={{
        fontSize: '1.2rem',
        fontWeight: '600',
        color: 'black',
        textAlign: 'center',
        margin: '40px auto',
        lineHeight: '1.5',
        maxWidth: '500px',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10px',
        overflowWrap: 'break-word'
      }}>
        {questions[currentQuestionIndex].text}
      </div>


      <div style={{ background: '#910811', padding: '20px 10px', borderRadius: '20px', maxWidth: '500px', margin: '0 auto 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', justifyItems: 'center', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div
              key={num}
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                width: '2.2rem',
                height: '2.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: value === num ? '#F59E0B' : 'rgba(255, 255, 255, 0.1)',
                border: value === num ? '2px solid #F59E0B' : '2px solid rgba(255, 255, 255, 0.2)',
                transform: value === num ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              {num}
            </div>
          ))}
        </div>

        <div style={{ padding: '0 10px', marginBottom: '20px', position: 'relative' }}>
          <div style={{ position: 'relative', height: '10px' }}>
            <div style={{ position: 'absolute', width: '100%', height: '10px', background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4))', borderRadius: '5px' }} />
            <div style={{ position: 'absolute', width: `${((value - 1) / 6) * 100}%`, height: '10px', background: '#F59E0B', borderRadius: '5px', transition: 'width 0.4s ease' }} />
            <div style={{ position: 'absolute', left: `${((value - 1) / 6) * 100}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '30px', height: '30px', background: '#F59E0B', border: '3px solid white', borderRadius: '50%', cursor: 'pointer' }} />
            <input
              type="range"
              min="1"
              max="7"
              value={value}
              onChange={handleSliderChange}
              style={{ position: 'absolute', width: '100%', height: '30px', top: '50%', transform: 'translateY(-50%)', opacity: 0, cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
          <div style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }}>Strongly disagree</div>
          <div style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }}>Strongly agree</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', maxWidth: '500px', margin: '0 auto' }}>
        <button
          onClick={handlePrevious}
          style={{ flex: 1, background: '#910811', color: 'white', border: 'none', borderRadius: '35px', padding: '14px 30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          style={{ flex: 1, background: '#910811', color: 'white', border: 'none', borderRadius: '35px', padding: '14px 30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default AssessmentPage;