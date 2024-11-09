import { useState, useEffect, useRef } from 'react';
import ENV from '@/config';
import { useTaniaStateReactive, getTaniaStateValue, useTaniaStateAction } from '@/state/stores/tania/taniaSelector';
import { TaniaPhase } from '@/state/stores/tania/taniaState';
import { STAGE1_PROMPT, STAGE1_PROMPT_END } from '@/prompts/stage1Prompt';
import { createLogger } from '@/utils/logger';
import {LLISTA_INSTANCIES} from '@/prompts/instanceTypes';

const useTextInstructModel = () => {
  const isFirstRender = useRef(true);

  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | unknown>(null);

  const logger = createLogger('useTextInstructModel');

  // Get actions
  const setTaniaMode = useTaniaStateAction('setTaniaMode');
  const setPhase = useTaniaStateAction('setPhase');
  const addMessage = useTaniaStateAction('addMessage');
  const setSelectedInstance = useTaniaStateAction('setSelectedInstance');


  // Mode change listener
  const taniaMode = useTaniaStateReactive('taniaMode');

  // Core query function
  const query = async (prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = ENV.HUGGING_FACE_API_URL;
      if (!apiUrl) throw new Error('HUGGING_FACE_API_URL is not defined');

      const result = await fetch(apiUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${ENV.HUGGING_FACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150
          }
        }),
      });

      const json = await result.json();
      
      if (Array.isArray(json) && json.length > 0 && json[0].generated_text) {
        // Remove original prompt if it appears at the start of response
        let cleanResponse = json[0].generated_text;
        if (cleanResponse.startsWith(prompt)) {
          cleanResponse = cleanResponse.slice(prompt.length).trim();
        }
        setResponse(cleanResponse);
        setLoading(false);
        return cleanResponse;
      }
      throw new Error('Invalid response format');
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  // Phase-specific handlers
  const handleFormSelection = async (transcription: string) => {
    logger.info('Handling form selection:', transcription);  
    
    const prompt = `${STAGE1_PROMPT}${transcription}${STAGE1_PROMPT_END}`;
    const response = await query(prompt);
    addMessage({
        content: response,
        type: 'system',
    });
    
    // Debug logs
    logger.info('Response received:', response);
    
    // Extract ID from response and find matching instance
    const idPattern = /\(id:\s*(\d{1,2})\)/;
    const match = response.match(idPattern);
    
    // Debug match result
    logger.info('Regex match result:', match);

    if (match && match[1]) {
      const idNumber = match[1];
      logger.info('Found ID:', idNumber);
      
      // Find matching instance that starts with this ID
      const matchedInstance = LLISTA_INSTANCIES.find(instance => 
        instance.startsWith(match[0])
      );
      
      logger.info('Looking for instance starting with:', `${idNumber}-`);
      logger.info('Available instances:', LLISTA_INSTANCIES);

      if (matchedInstance) {
        logger.info('Matched instances:', [matchedInstance]);
        setSelectedInstance(matchedInstance);
        setPhase('FormQuestion');
        setTaniaMode('Thinking');
        return response;
      }
    } else {
      logger.info('No matched instances found');
      return response;
    }
  };

  const handleFormQuestion = async (transcription: string) => {
    const prompt = ""; // TODO: Add FormQuestion prompt
    const response = await query(prompt);
    addMessage({
      content: response,
      type: 'system',
    });
    setTaniaMode('Talking');
    return response;
  };

  const handleFormAnswer = async (transcription: string) => {
    const prompt = ""; // TODO: Add FormAnswer prompt
    const response = await query(prompt);
    addMessage({
      content: response,
      type: 'editable-system',
    });

    const newQuestion = ""; // TODO: Add new question based on answer
    const newQuestionResponse = await query(newQuestion);
    addMessage({
      content: newQuestionResponse,
      type: 'system',
    });
    return newQuestionResponse;
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Ignore reacting to initial render
    }

    logger.info('Tania mode changed:', taniaMode);
    if (taniaMode === 'Thinking') {
      logger.info('Tania is thinking...');
      const currentPhase = getTaniaStateValue('phase');
      const lastMessage = getTaniaStateValue('lastMessage');
      
      const phaseHandlers: Record<TaniaPhase, () => Promise<string>> = {
        FormSelection: () => handleFormSelection(lastMessage),
        FormQuestion: () => handleFormQuestion(lastMessage),
        FormAnswer: () => handleFormAnswer(lastMessage),
      };

      phaseHandlers[currentPhase]().catch(console.error);
    }
  }, [taniaMode]);

  return { response, loading, error };
};

export default useTextInstructModel;