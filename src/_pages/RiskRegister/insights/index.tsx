import { Button, Flex, Input, Select, Text, Textarea } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useAxiosInstance } from '@/state/HttpClientContext';
import { useRiskRegisterScenarios } from '@/services/hooks';

type ChatMessage = {
  id: string;
  role: 'agent' | 'user';
  content: string;
};

function KovrrInsights() {
  const client = useAxiosInstance();
  const { data } = useRiskRegisterScenarios({ page: 1, size: 100 });
  const scenarios = data?.items ?? [];

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recommendations, setRecommendations] = useState<string>(
    'Recommendations will appear here after analyzing a scenario.',
  );
  const options = useMemo(
    () =>
      scenarios.map((s) => ({
        id: s.id,
        label: `${s.customer_scenario_id} — ${s.name}`,
      })),
    [scenarios],
  );

  const handleAnalyze = useCallback(async () => {
    if (!selectedScenarioId) return;
    try {
      // If backend endpoint exists, this will populate recommendations.
      const { data } = await client.post(
        `/api/risk-register/insights/analyze`,
        { scenario_id: selectedScenarioId },
      );
      setRecommendations(data?.recommendations ?? 'No recommendations returned.');
    } catch {
      setRecommendations('No recommendations returned.');
    }
  }, [client, selectedScenarioId]);

  const handleSend = useCallback(async () => {
    const content = chatInput.trim();
    if (!content) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    try {
      const { data } = await client.post(`/api/risk-register/insights/chat`, {
        message: content,
        scenario_id: selectedScenarioId || undefined,
      });
      const agentMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'agent',
        content: data?.reply ?? 'No response.',
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      const agentMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'agent',
        content: 'No response.',
      };
      setMessages((prev) => [...prev, agentMsg]);
    }
  }, [chatInput, client, selectedScenarioId]);

  return (
    <Flex
      direction='column'
      gap='24px'
      bg='white'
      borderRadius='8px'
      w='100%'
      minH='inherit'
      p={{ base: '20px', md: '24px' }}
      boxShadow='sm'
    >
      <Flex
        gap='24px'
        alignItems='flex-start'
        width='100%'
        minH='inherit'
        flexWrap='wrap'
      >
      <Flex direction='column' gap='16px' flex='1'>
        {/* Scenario Analyzer */}
        <Flex direction='column' gap='8px' className='p-4 rounded-md bg-background'>
          <Text fontSize='16px' fontWeight='700'>
            Scenario Analyzer
          </Text>
          <Select
            placeholder='Select a scenario'
            value={selectedScenarioId}
            onChange={(e) => setSelectedScenarioId(e.target.value)}
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </Select>
          <Button onClick={handleAnalyze} isDisabled={!selectedScenarioId}>
            Analyze Scenario
          </Button>
        </Flex>

        {/* Ask Kovrr Agent */}
        <Flex direction='column' gap='8px' className='p-4 rounded-md bg-background'>
          <Text fontSize='16px' fontWeight='700'>
            Ask Kovrr Agent
          </Text>
          <Flex direction='column' gap='8px' className='max-h-[300px] overflow-auto'>
            {messages.map((m) => (
              <Flex
                key={m.id}
                alignSelf={m.role === 'user' ? 'flex-end' : 'flex-start'}
                className={`px-3 py-2 rounded-md ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-background'
                }`}
                maxW='80%'
              >
                <Text whiteSpace='pre-wrap'>{m.content}</Text>
              </Flex>
            ))}
            {messages.length === 0 && (
              <Text color='gray.500'>Start chatting with the agent…</Text>
            )}
          </Flex>
          <Flex gap='8px'>
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder='Type your message'
            />
            <Button onClick={handleSend}>Send</Button>
          </Flex>
        </Flex>
      </Flex>

        {/* Recommendations Panel */}
        <Flex direction='column' gap='8px' minW='360px' flex='1' className='p-4 rounded-md bg-background'>
          <Text fontSize='16px' fontWeight='700'>
            AI-Powered Recommendations
          </Text>
          <Textarea value={recommendations} readOnly height='100%' minH='360px' />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default KovrrInsights;


