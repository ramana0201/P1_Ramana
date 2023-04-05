const elements = {
    inputQuestion: document.querySelector('#question'),
    resultQuestion: document.querySelector('#result'),
    buttonSendQuestion: document.querySelector('#send-question')
  };
  
  const openAIConfig = {
    endpoint: 'https://api.openai.com/v1/completions',
    apiKey: 'api-key',
    model: 'text-davinci-003',
    maxTokens: 2048, // Tamanho da Resposta
    temperature: 0.5 // Criatividade da API 
  };
  
  async function sendQuestion() {
    const question = elements.inputQuestion.value;
  
    if (!question) {
      return;
    }
  
    elements.inputQuestion.readOnly = true;
    elements.buttonSendQuestion.disabled = true;
  
    try {
      const response = await fetch(openAIConfig.endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIConfig.apiKey}`
        },
        body: JSON.stringify({
          model: openAIConfig.model,
          prompt: question,
          max_tokens: openAIConfig.maxTokens,
          temperature: openAIConfig.temperature
        })
      });
  
      const json = await response.json();
  
      if (json.error?.message) {
        throw new Error(json.error.message);
      }
  
      const text = json.choices?.[0].text || 'Sem resposta';
      elements.resultQuestion.value += `Chat GPT: ${text}\n`;
  
      elements.resultQuestion.scrollTop = elements.resultQuestion.scrollHeight;
    } catch (error) {
      console.error(`Error: ${error}`);
      elements.resultQuestion.value += `Error: ${error}\n`;
    } finally {
      elements.inputQuestion.value = '';
      elements.inputQuestion.readOnly = false;
      elements.buttonSendQuestion.disabled = false;
  
      elements.resultQuestion.value += `Eu: ${question}\n`;
  
      elements.resultQuestion.scrollTop = elements.resultQuestion.scrollHeight;
    }
  }
  
  elements.inputQuestion.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      sendQuestion();
    }
  });
  
  elements.buttonSendQuestion.addEventListener('click', () => {
    sendQuestion();
  });
  
