import { useState } from 'react';

interface InputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 600 }}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a GitHub PR link..."
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '20px 24px',
          fontSize: 18,
          border: 'none',
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '16px 24px',
          fontSize: 18,
          fontWeight: 600,
          border: 'none',
          borderRadius: 12,
          backgroundColor: '#8b5cf6',
          color: 'white',
          cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
          opacity: isLoading || !url.trim() ? 0.5 : 1,
        }}
      >
        {isLoading ? 'Generating...' : 'Generate Video'}
      </button>
    </form>
  );
};
