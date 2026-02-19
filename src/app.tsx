import { useState, useCallback, useEffect } from 'react';
import TextInput from 'ink-text-input';
import { Text, Box, useApp } from 'ink';
import { AIMessage, BaseMessageLike, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { agent } from './agent';

export default function App() {
  const [messages, setMessages] = useState<BaseMessageLike[]>(() => [
    new SystemMessage({ content: 'You are a helpful assistant named Gluon. You have many tools at your disposal to help users.' }),
    new AIMessage({ content: `Hi! I'm Gluon, how can I help?` })
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { exit } = useApp();
  useEffect(() => exit, []);

  const onSubmit = useCallback((value: string) => {
    if (loading) return;

    const trimmed = value.trim();
    if (!trimmed) return;

    setInput('');

    const newMessages = [...messages, new HumanMessage({ content: trimmed })];

    setMessages(newMessages);
    setLoading(true);

    agent.invoke({ messages: newMessages })
      .then(({ messages }) => setMessages(messages))
      .catch(error => setMessages(messages => [...messages, new AIMessage({ content: `An error occurred "${error.message}"` })]))
      .finally(() => setLoading(false));
  }, [loading, messages, setMessages]);

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box flexDirection="column">
        {messages.map((message, i) => (
          <Box key={i} flexDirection="column">
            {message instanceof HumanMessage && typeof message.content === 'string' && (
              <Box gap={1} flexDirection="row">
                <Text color="green" bold>You:</Text>
                <Text>{message.content as string}</Text>
              </Box>
            )}

            {message instanceof AIMessage && typeof message.content === 'string' && (
              <Box gap={1} flexDirection="row">
                <Text color="cyan" bold>Gluon:</Text>
                <Text>{message.content as string}</Text>
              </Box>
            )}
          </Box>
        ))}

        {loading && (
          <Text color="blue">Thinking...</Text>
        )}
      </Box>
      <Box borderStyle="round" paddingX={1} gap={1}>
        <Text color="green" bold>&rsaquo;</Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={onSubmit}
          placeholder='Type a message and press Enter...' />
      </Box>
    </Box>
  );
}
