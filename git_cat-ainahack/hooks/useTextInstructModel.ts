import { useState, useEffect, useRef } from 'react';
import ENV from '@/config';
import { useTaniaStateReactive, getTaniaStateValue, useTaniaStateAction } from '@/state/stores/tania/taniaSelector';
import { TaniaPhase } from '@/state/stores/tania/taniaState';
import { STAGE1_PROMPT, STAGE1_PROMPT_END } from '@/prompts/stage1Prompt';
import { STAGE_2_PROMPT_START, STAGE_2_PROMPT_QUESTION } from '@/prompts/stage2';
import { createLogger } from '@/utils/logger';
import {LLISTA_INSTANCIES} from '@/prompts/instanceTypes';
import { FormElement } from '@/state/stores/tania/taniaState';
import {getStage2_6PromptStart} from '@/prompts/stage6';
import {getInstanceData} from '@/prompts/instanceTypes';


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
  const setFormElementsQueue = useTaniaStateAction('setFormElementsQueue');
  const dequeueFormElement = useTaniaStateAction('dequeueFormElement');
  const getCurrentFormElement = useTaniaStateAction('getCurrentFormElement');

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
    
    const idPattern = /\(id:\s*(\d{1,2})\)/;
    const match = response.match(idPattern);
    
    logger.info('Regex match result:', match);

    if (match && match[1]) {
      const idNumber = match[1];
      logger.info('Found ID:', idNumber);
      
      const matchedInstance = LLISTA_INSTANCIES.find(instance => 
        instance.startsWith(match[0])
      );
      
      if (matchedInstance) {
        logger.info('Matched instance:', matchedInstance);
        
        // Get form elements and set queue
        const instanceElements = getInstanceElements(matchedInstance);
        setFormElementsQueue(instanceElements);
        setSelectedInstance(matchedInstance);
        
        setPhase('FormQuestion');
        setTaniaMode('Talking');
        
        // Handle first element immediately
        handleFormQuestion();
        return response;
      }
    }
    
    logger.info('No matched instances found');
    return response;
  };

  const getInstanceElements = (instanceId: string): FormElement[] => {
    logger.info('Getting elements for instance:', instanceId);
    
    try {
      const instanceData = getInstanceData(instanceId);
      
      // Ensure instanceData is an object with the expected structure
      if (typeof instanceData !== 'object' || !instanceData) {
        logger.error('Invalid instance data format');
        return [];
      }

      // Map instance data to form elements
      const formElements: FormElement[] = [];
      for (const [key, data] of Object.entries(instanceData)) {
        if (data && typeof data === 'object' && 'label' in data) {
          formElements.push({
            id: key,
            label: data.label as string,
            question: (data as any).type || 'text',
            examples: (data as any).examples || ''
          });
        }
      }

      logger.info('Created form elements:', formElements);
      return formElements;
      
    } catch (error) {
      logger.error('Error getting instance elements:', error);
      return [];
    }
  };

  const handleFormQuestion = async () => {
    const currentElement = getCurrentFormElement();
    if (!currentElement) {
      setPhase('FormSelection');
      setTaniaMode('Waiting');
      return;
    }
    // Process current element
    const prompt = `${STAGE_2_PROMPT_START}${currentElement.label}${STAGE_2_PROMPT_QUESTION}`;
    const response = await query(prompt);
    const isWaiting = getTaniaStateValue('taniaMode') === 'Waiting';
    if (!isWaiting) {
      setTaniaMode('Talking');
    }
    addMessage({
      content: response,
      type: 'system'
    });
    setPhase('FormAnswer');
  
    return response;
  };

  const handleFormAnswer = async (transcription: string) => {
    const currentElement = getCurrentFormElement();
    if (!currentElement) return;

    const prompt = getStage2_6PromptStart(currentElement.label, currentElement.examples.join(', '), transcription);
    const response = await query(prompt);

    addMessage({
      content: response,
      type: 'editable-system'
    });

    logger.info('Form answer response:', response);

    // Move to next element
    dequeueFormElement();
    
    // Check if more elements exist
    const nextElement = getCurrentFormElement();
    setTaniaMode('Thinking');

    logger.info('Next element:', nextElement);
    if (nextElement) {
      handleFormQuestion();
    } else {
      setPhase('FormSelection');
    }

    return response;
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
        FormQuestion: () => handleFormQuestion(),
        FormAnswer: () => handleFormAnswer(lastMessage),
      };
      logger.info('Out of handler');
      phaseHandlers[currentPhase]().catch(console.error);
    }
  }, [taniaMode]);

  return { response, loading, error };
};

export default useTextInstructModel;