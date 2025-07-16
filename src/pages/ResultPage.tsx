import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { useUser } from '../contexts/UserContext'; 

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores, categories } = location.state || { scores: [], categories: [] };
  const { user } = useUser(); // ✅ Grab the current user
  const email = user?.email;  // ✅ Reliable source of user email
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL;



  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const aggregateScores: { [category: string]: number[] } = {};
  categories.forEach((cat: string, i: number) => {
    if (!aggregateScores[cat]) aggregateScores[cat] = [];
    aggregateScores[cat].push(scores[i]);
  });

  const dimensionLabels = ['Ingredients', 'Visual Appearance', 'Cultural & Local Experiences', 'Servicescape'];
  const dimensionScores = dimensionLabels.map(label => {
    const items = aggregateScores[label] || [];
    return items.length > 0 ? (items.reduce((a, b) => a + b, 0) / items.length) : 0;
  });

  const getCustomerProfile = () => {
    const typeCount: Record<string, number> = {
      'Leisure Traveler': 0,
      'Food-Driven Traveler': 0,
      'Cultural Food Traveler': 0
    };

    const thresholds = [
      { leisure: [5.78, 5.96], food: [0, 5.78], cultural: [5.96, 7] },
      { leisure: [0, 5.65], food: [5.65, 5.82], cultural: [5.82, 7] },
      { leisure: [0, 5.68], food: [5.68, 5.89], cultural: [5.89, 7] },
      { leisure: [0, 5.44], food: [5.44, 5.88], cultural: [5.88, 7] }
    ];

    dimensionScores.forEach((score, i) => {
      const t = thresholds[i];
      if (score < t.leisure[1]) typeCount['Leisure Traveler'] += 1;
      else if (score < t.food[1]) typeCount['Food-Driven Traveler'] += 1;
      else typeCount['Cultural Food Traveler'] += 1;
    });

    const maxCount = Math.max(...Object.values(typeCount));
    const candidates = Object.keys(typeCount).filter(type => typeCount[type] === maxCount);

    if (candidates.length === 1) return candidates[0];

    const attAvg = dimensionScores.reduce((a, b) => a + b, 0) / 4;
    if (attAvg > 6.04) return 'Cultural Food Traveler';
    if (attAvg >= 5.84) return 'Leisure Traveler';
    return 'Food-Driven Traveler';
  };

  const customerProfile = getCustomerProfile();

  const profileDescriptions: { [key: string]: string } = {
    'Cultural Food Traveler': 'Seeks deep cultural immersion through food and authenticity.',
    'Food-Driven Traveler': 'Prioritizes exceptional culinary experiences and quality.',
    'Leisure Traveler': 'Enjoys relaxed, comfortable environments with familiar food.'
  };

  const baseUrl = import.meta.env.BASE_URL;

  const travelerImages: { [key: string]: string[] } = {
    'Leisure Traveler': [`${baseUrl}leisure1.png`, `${baseUrl}leisure2.png`],
    'Food-Driven Traveler': [`${baseUrl}food1.png`, `${baseUrl}food2.png`],
    'Cultural Food Traveler': [`${baseUrl}cultural1.png`, `${baseUrl}cultural2.png`],
  };

  const selectedImages = travelerImages[customerProfile] || [];

  // ✅ Auto-upload image on load
  useEffect(() => {
    if (!user?.email) {
      navigate('/login');
      return;
    }

    const uploadImage = async () => {
      console.log("Auto-upload triggered for email:", email);
      if (!resultRef.current || !email) return;

      const canvas = await html2canvas(resultRef.current);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) return;

      const formData = new FormData();
      formData.append('file', blob, 'result.png');
      formData.append('email', email);

      try {
        formData.append('scores', JSON.stringify(scores));
        formData.append('categories', JSON.stringify(categories));
        formData.append('profile_type', customerProfile);

        const response = await fetch('/api/upload-result', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          setUploadedImageUrl(`${backendBaseUrl}${data.url}`);
        }
      } catch (err) {
        console.error('Failed to upload result image', err);
      }
    };

    uploadImage();
  }, [user]);


  // ✅ Local download feature
  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current);
    const link = document.createElement('a');
    link.download = 'result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

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

      <div ref={resultRef} style={{ textAlign: 'center' }}>
        <img
          src={`${import.meta.env.BASE_URL}logo_R.png`}
          alt="Logo"
          style={{
            width: 'clamp(120px, 25vw, 200px)',
            maxWidth: '100%',
            height: 'auto',
            marginTop: '10px',
            marginBottom: '10px'
          }}
        />

        <div style={{ padding: '16px', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#111', fontWeight: 700, margin: '0 0 4px 0' }}>Customer Profile</h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '16px 0' }}>
            {selectedImages.map((imgSrc, idx) => (
              <img
                key={idx}
                src={imgSrc}
                alt={`Traveler ${idx + 1}`}
                style={{
                  width: '100px',
                  height: '150px',
                  borderRadius: '50px',
                  objectFit: 'cover',
                }}
              />
            ))}
          </div>

          <p style={{ fontSize: '0.95rem', color: '#444', margin: 0, fontWeight: 'bold' }}>
            Your restaurant matches with
          </p>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#d62e2e', margin: '6px 0' }}>
            {customerProfile}
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#555', margin: 0, fontWeight: 'bold' }}>
            {profileDescriptions[customerProfile]}
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '420px', height: '260px', margin: '5px auto' }}>
          <Radar
            data={{
              labels: dimensionLabels,
              datasets: [
                {
                  label: 'Authenticity Dimensions',
                  data: dimensionScores,
                  backgroundColor: 'rgba(145, 8, 17, 0.3)',
                  borderColor: '#910811',
                  borderWidth: 1,
                  pointBackgroundColor: '#910811'
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: { left: 45, right: 16, top: 20, bottom: 20 }
              },
              scales: {
                r: {
                  beginAtZero: true,
                  min: 1,
                  max: 7,
                  ticks: { display: false },
                  pointLabels: {
                    font: { size: 12, weight: 'bold' },
                    color: '#333',
                    padding: 16
                  },
                  grid: {
                    lineWidth: (ctx) => ctx.index === ctx.chart.scales.r.ticks.length - 1 ? 1.2 : 0.3,
                    color: 'black',
                  },
                }
              },
              plugins: { legend: { display: false } }
            }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate('/guidelines', { state: { customerProfile } })}
        style={{
          background: '#910811',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '420px',
          margin: '16px auto 8px',
          display: 'block'
        }}
      >
        See Guidelines
      </button>

      <button
        onClick={handleDownloadImage}
        style={{
          background: '#444',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '420px',
          margin: '0 auto 8px',
          display: 'block'
        }}
      >
        Download as Image
      </button>
      <button
        onClick={() => navigate('/assessment')}
        style={{
          background: '#888',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '420px',
          margin: '8px auto 20px',
          display: 'block'
        }}
      >
        Redo Quiz
      </button>

      {uploadedImageUrl && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${uploadedImageUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            Share on Facebook
          </a>
          <br />
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${uploadedImageUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            Share on LINE
          </a>
        </div>
      )}

    </div>
  );
};

export default ResultPage;
