import { useState } from 'react';
import ENV from '@/config';

const useTextInstructModel = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | unknown>(null);

  const query = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = ENV.HUGGING_FACE_API_URL;
      if (!apiUrl) {
        console.log("HUGGING_FACE_API_URL is not defined");
        throw new Error('HUGGING_FACE_API_URL is not defined');
      }
      const result = await fetch(apiUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${ENV.HUGGING_FACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log("Sent request");
      const json = await result.json();
      
      console.log("Got response");
      console.log(json);
      
      // Extract generated_text from the response
      if (Array.isArray(json) && json.length > 0 && json[0].generated_text) {
        setResponse(json[0].generated_text);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, query };
};

export default useTextInstructModel;