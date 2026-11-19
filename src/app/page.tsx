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
    <div className="min-h-screen w-full bg-[#050505] text-white px-4 py-8 md:px-10 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400"></span>
            </span>
            <span className="text-xs font-medium tracking-widest text-violet-300 uppercase">
              AI Workspace
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your Ideas,{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Powered by AI.
            </span>
          </h1>

          <p className="mt-4 text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Ask questions, explore ideas, and generate intelligent responses. Your AI assistant is
            ready.
          </p>
        </div>

        {/* AI Prompt Card */}
        <div className="relative rounded-2xl border border-white/[0.09] bg-[#0c0c0f] p-4 md:p-7 shadow-2xl shadow-purple-950/10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-lg">✦</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
                <p className="text-[11px] text-gray-500">Intelligent response engine</p>
              </div>
            </div>

            <span className="text-[10px] md:text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 rounded-full">
              ● Ready
            </span>
          </div>

          <form onSubmit={handleResponse} className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-[#08080b] focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/20 transition-all">
              <div className="px-4 pt-4 pb-2">
                <label htmlFor="prompt" className="text-xs font-medium text-gray-400">
                  ENTER YOUR PROMPT
                </label>
              </div>

              <TextField
                id="prompt"
                fullWidth
                multiline
                minRows={5}
                placeholder="What would you like to explore today? Ask anything..."
                name="message"
                value={data.message}
                onChange={handleInput}
                variant="standard"
                slotProps={{
                  input: {
                    disableUnderline: true,
                    sx: {
                      color: '#f4f4f5',
                      fontSize: '15px',
                      padding: '8px 16px 16px',
                      alignItems: 'flex-start',
                      '& textarea::placeholder': {
                        color: '#52525b',
                        opacity: 1,
                      },
                    },
                  },
                }}
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-3">
                <p className="text-[11px] text-gray-600">
                  ✦ AI-generated responses may need verification
                </p>

                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 22px',
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6d28d9, #4338ca)',
                    },
                    '&.Mui-disabled': {
                      color: '#a1a1aa',
                      background: '#27272a',
                    },
                  }}
                >
                  {loading ? (
                    'Generating...'
                  ) : (
                    <span className="flex items-center gap-2">
                      Generate Response <span>✦</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* AI Response */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-400">✧</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">AI Response</h2>
                <p className="text-[11px] text-gray-500">Generated intelligence</p>
              </div>
            </div>

            <span className="text-[10px] tracking-wider text-gray-600 uppercase">Output</span>
          </div>

          <div className="relative min-h-[200px] rounded-2xl border border-white/[0.08] bg-[#0c0c0f] p-5 md:p-7 overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600/[0.05] blur-3xl pointer-events-none"></div>

            {answer ? (
              <div className="relative z-10 text-sm md:text-base text-gray-300 leading-8 whitespace-pre-wrap break-words">
                {answer}
              </div>
            ) : (
              <div className="relative z-10 min-h-[150px] flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center mb-4">
                  <span className="text-2xl text-gray-600">✧</span>
                </div>
                <p className="text-sm font-medium text-gray-400">Your response will appear here</p>
                <p className="text-xs text-gray-600 mt-2">Enter a prompt above to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[11px] text-gray-700 tracking-wide">
            POWERED BY ARTIFICIAL INTELLIGENCE
          </p>
        </div>
      </div>
    </div>
  );
}
