'use client';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import React, { useState } from 'react';

interface FormProp {
  message: string;
}

export default function Root() {
  const [data, setData] = useState<FormProp>({
    message: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [answer, setAnswer] = useState('');

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResponse = async (event: React.SubmitEvent<HTMLFormElement>) => {
    await event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`/api/agent`, data);
      console.log(response.data.data);
      setAnswer(response.data.data);
    } catch (error) {
      console.log(error);
      alert(`Debug Required at Frotnend`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Artificial Intelligence</h1>
          <p className="text-gray-500 mt-2">Enter your prompt and let AI do the thinking.</p>
        </div>

        {/* Prompt Form */}
        <form className="flex flex-col gap-5" onSubmit={handleResponse}>
          <TextField
            id="prompt"
            label="Enter your Prompt"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            placeholder="Ask anything..."
            name="message"
            value={data.message}
            onChange={handleInput}
          />

          <div>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? 'Generating..' : 'Generate Response'}
            </Button>
          </div>
        </form>

        {/* Response */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">AI Response</h2>

          <div className="border rounded-lg p-5 min-h-32">
            <p className="text-gray-500">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
