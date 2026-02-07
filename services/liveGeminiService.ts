import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, Tool } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { sendEmail } from "./emailService";

// Define tools for the Live API (same capabilities as text chat)
const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "openContact",
        description: "Open the contact form modal. Use this when the user wants to book a meeting or contact or send message to Shiv.",
      },
      {
        name: "sendMessage",
        description: "Send an email message to Shiv. Use this when the user provides specific message content to send.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The name of the sender." },
            email: { type: Type.STRING, description: "The email address of the sender." },
            message: { type: Type.STRING, description: "The message content." },
          },
          required: ["name", "email", "message"],
        },
      },
      {
        name: "showProjects",
        description: "Display Shiv's projects on the screen. Use this when the user asks to see projects or work.",
      },
      {
        name: "showExperience",
        description: "Display Shiv's experience on the screen. Use this when the user asks about work history or career.",
      },
      {
        name: "showServices",
        description: "Display Shiv's services on the screen. Use this when the user asks about what services Shiv offers or what he can help with.",
      },
      {
        name: "showAbout",
        description: "Display the About page with Shiv's skills and background. Use this when the user asks about Shiv or wants to know more about him.",
      },
      {
        name: "showStory",
        description: "Navigate to the My Journey/Story page. Use this when the user asks about Shiv's full story, biography, or journey.",
      },
    ],
  },
];

export class LiveGeminiService {
  private ai: GoogleGenAI;
  private session: any = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private outputAnalyser: AnalyserNode | null = null;
  private outputGainNode: GainNode | null = null;
  private outputVisualizerInterval: any = null;
  private nextStartTime: number = 0;
  private uiCallback: (action: string, data?: any) => void;
  private volumeCallback: (volume: number) => void;
  private isAISpeaking: boolean = false;
  private mediaStream: MediaStream | null = null;
  private isMicMuted: boolean = false;
  private isSpeakerMuted: boolean = false;

  constructor(uiCallback: (action: string, data?: any) => void, volumeCallback: (volume: number) => void) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.uiCallback = uiCallback;
    this.volumeCallback = volumeCallback;
  }

  async connect(aiTone: string) {
    try {
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // Setup Output Analyser for Visualizing AI Voice
      this.outputAnalyser = this.outputAudioContext.createAnalyser();
      this.outputAnalyser.fftSize = 256;
      this.outputAnalyser.smoothingTimeConstant = 0.3; // Smooths out the visualizer

      // Setup Gain Node for Speaker Volume Control
      this.outputGainNode = this.outputAudioContext.createGain();
      this.outputGainNode.gain.value = 1.0; // Default volume

      // Start output monitoring loop
      this.startOutputMonitoring();

      // Customize system instruction based on tone for voice context
      let instruction = SYSTEM_INSTRUCTION;
      if (aiTone === 'casual') instruction += " \n\nStyle: Casual, friendly, concise spoken responses.";
      else if (aiTone === 'technical') instruction += " \n\nStyle: Technical, precise, engineer-to-engineer spoken responses.";
      else instruction += " \n\nStyle: Professional, concise, spoken responses.";

      instruction += " \n\nVOICE INSTRUCTIONS:\n1. Pronounce 'Shiv Awasthi' CLEARLY as 'Shiv uh-WUST-thee'.\n2. KEEP RESPONSES EXTREMELY SHORT (1-2 sentences max).\n3. PAUSE often to let the user speak. Do not speak continuously without listening. Value turn-taking.\n4. Speak naturally, avoiding markdown or formatting characters.";

      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: instruction,
          tools: tools,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Sadaltager' } },
          },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaStream = stream; // Store reference for mic mute control

      this.session = await this.ai.live.connect({
        ...config,
        callbacks: {
          onopen: () => {
            console.log("Live Session Connected");
            this.startAudioInput(stream);
            this.uiCallback("connected");
          },
          onmessage: (message: LiveServerMessage) => this.handleMessage(message),
          onclose: () => {
            console.log("Live Session Closed");
            this.uiCallback("disconnected");
          },
          onerror: (err: any) => {
            console.error("Live Session Error", err);
            const errorInfo = this.parseError(err);
            this.uiCallback("error", errorInfo);
          }
        }
      });

    } catch (error: any) {
      console.error("Failed to connect to Live API", error);
      const errorInfo = this.parseError(error);
      this.uiCallback("error", errorInfo);
    }
  }

  private parseError(error: any): { type: string; message: string; canRetry: boolean } {
    const errorMessage = error?.message || error?.toString() || '';

    if (errorMessage.includes('UNAVAILABLE') || errorMessage.includes('overloaded') || error?.code === 503) {
      return {
        type: 'overloaded',
        message: 'The AI is experiencing high demand. Please try again in a moment.',
        canRetry: true
      };
    }

    if (errorMessage.includes('429') || errorMessage.includes('quota')) {
      return {
        type: 'rateLimit',
        message: 'Rate limit reached. Please wait a few seconds and try again.',
        canRetry: true
      };
    }

    if (errorMessage.includes('NotAllowedError') || errorMessage.includes('Permission denied')) {
      return {
        type: 'permission',
        message: 'Microphone access was denied. Please enable microphone permissions.',
        canRetry: false
      };
    }

    if (errorMessage.includes('NotFoundError') || errorMessage.includes('no microphone')) {
      return {
        type: 'noDevice',
        message: 'No microphone found. Please connect a microphone and try again.',
        canRetry: false
      };
    }

    if (errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      return {
        type: 'network',
        message: 'Network connection issue. Please check your internet connection.',
        canRetry: true
      };
    }

    return {
      type: 'unknown',
      message: 'An unexpected error occurred. Please try again.',
      canRetry: true
    };
  }

  private startOutputMonitoring() {
    // Check output volume periodically to visualize AI voice
    if (this.outputVisualizerInterval) clearInterval(this.outputVisualizerInterval);

    this.outputVisualizerInterval = setInterval(() => {
      if (this.isAISpeaking && this.outputAnalyser) {
        const dataArray = new Uint8Array(this.outputAnalyser.frequencyBinCount);
        this.outputAnalyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        // Focus on lower frequencies for better visual "thump"
        const length = Math.floor(dataArray.length / 2);
        for (let i = 0; i < length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / length;
        // Normalize roughly 0-1
        this.volumeCallback(avg / 100);
      }
    }, 33); // ~30fps
  }

  private startAudioInput(stream: MediaStream) {
    if (!this.inputAudioContext) return;

    this.inputSource = this.inputAudioContext.createMediaStreamSource(stream);
    // Reduced buffer size to 2048 for smoother/faster visual updates
    this.processor = this.inputAudioContext.createScriptProcessor(2048, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);

      // Only visualize input if AI is NOT speaking
      if (!this.isAISpeaking) {
        // Calculate volume for UI visualization
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        // Boost the signal slightly for visual impact
        this.volumeCallback(rms * 8);
      }

      // Create PCM blob
      const pcmData = this.floatTo16BitPCM(inputData);
      const base64Data = this.arrayBufferToBase64(pcmData);

      if (this.session) {
        this.session.sendRealtimeInput({
          media: {
            mimeType: "audio/pcm;rate=16000",
            data: base64Data
          }
        });
      }
    };

    this.inputSource.connect(this.processor);
    this.processor.connect(this.inputAudioContext.destination);
  }

  private async handleMessage(message: LiveServerMessage) {
    // Handle Audio Output
    const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      this.playAudio(audioData);
      this.isAISpeaking = true;
      this.uiCallback("speaking");
    }

    // Handle Turn Complete (User can speak again)
    if (message.serverContent?.turnComplete) {
      this.isAISpeaking = false;
      this.uiCallback("listening");
    }

    // Handle Function Calls
    if (message.toolCall) {
      this.uiCallback("processing");
      for (const fc of message.toolCall.functionCalls) {
        await this.handleToolCall(fc);
      }
    }
  }

  private async handleToolCall(fc: any) {
    console.log("Tool Call:", fc.name, fc.args);
    let result = "Success";

    try {
      if (fc.name === 'openContact') {
        this.uiCallback("navigate", { view: "contact" });
        result = "Opened the contact form.";
      }
      else if (fc.name === 'sendMessage') {
        const success = await sendEmail(fc.args);
        result = success ? "Email sent successfully." : "Failed to send email.";
      }
      else if (fc.name === 'showProjects') {
        this.uiCallback("navigate", { view: "projects", autoScroll: true });
        result = "Showing projects page.";
      }
      else if (fc.name === 'showExperience') {
        this.uiCallback("navigate", { view: "experience", autoScroll: true });
        result = "Showing experience page.";
      }
      else if (fc.name === 'showServices') {
        this.uiCallback("navigate", { view: "services", autoScroll: true });
        result = "Showing services page.";
      }
      else if (fc.name === 'showAbout') {
        this.uiCallback("navigate", { view: "about", autoScroll: true });
        result = "Showing about page.";
      }
      else if (fc.name === 'showStory') {
        this.uiCallback("navigate", { view: "story", autoScroll: true });
        result = "Showing story page.";
      }
    } catch (e) {
      result = "Error executing tool.";
    }

    // Send response back to model
    if (this.session) {
      this.session.sendToolResponse({
        functionResponses: {
          id: fc.id,
          name: fc.name,
          response: { result: result }
        }
      });
    }
  }

  private async playAudio(base64Data: string) {
    if (!this.outputAudioContext) return;

    try {
      const arrayBuffer = this.base64ToArrayBuffer(base64Data);
      const audioBuffer = await this.decodeAudioData(arrayBuffer);

      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Connect: source -> analyser -> gainNode -> destination
      // This allows muting via gainNode while still visualizing via analyser
      if (this.outputAnalyser && this.outputGainNode) {
        source.connect(this.outputAnalyser);
        this.outputAnalyser.connect(this.outputGainNode);
        this.outputGainNode.connect(this.outputAudioContext.destination);
      } else if (this.outputGainNode) {
        source.connect(this.outputGainNode);
        this.outputGainNode.connect(this.outputAudioContext.destination);
      } else {
        source.connect(this.outputAudioContext.destination);
      }

      const now = this.outputAudioContext.currentTime;
      // Schedule next chunk to play after previous one finishes
      const startTime = Math.max(now, this.nextStartTime);
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;

    } catch (e) {
      console.error("Error playing audio", e);
    }
  }

  disconnect() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.inputSource) {
      this.inputSource.disconnect();
      this.inputSource = null;
    }
    if (this.inputAudioContext) {
      this.inputAudioContext.close();
      this.inputAudioContext = null;
    }
    if (this.outputAudioContext) {
      this.outputAudioContext.close();
      this.outputAudioContext = null;
    }
    if (this.outputVisualizerInterval) {
      clearInterval(this.outputVisualizerInterval);
    }
    this.session = null;
    this.outputAnalyser = null;
  }

  // --- Utilities ---

  private floatTo16BitPCM(input: Float32Array): ArrayBuffer {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private async decodeAudioData(data: ArrayBuffer): Promise<AudioBuffer> {
    if (!this.outputAudioContext) throw new Error("No audio context");

    // Raw PCM decoding for 24kHz (Model output)
    const sampleRate = 24000;
    const numChannels = 1;
    const dataView = new Int16Array(data);
    const audioBuffer = this.outputAudioContext.createBuffer(numChannels, dataView.length, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < dataView.length; i++) {
      channelData[i] = dataView[i] / 32768.0;
    }

    return audioBuffer;
  }

  // ===== Public Mute/Unmute Controls =====

  /**
   * Toggle microphone mute state
   * When muted, stops sending audio to the AI but keeps the session alive
   */
  toggleMic(): boolean {
    if (this.mediaStream) {
      this.isMicMuted = !this.isMicMuted;
      // Disable all audio tracks in the stream
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !this.isMicMuted;
      });
      console.log(`[LiveGeminiService] Microphone ${this.isMicMuted ? 'muted' : 'unmuted'}`);
    }
    return this.isMicMuted;
  }

  /**
   * Toggle speaker mute state
   * When muted, AI audio won't be heard but session continues
   */
  toggleSpeaker(): boolean {
    if (this.outputGainNode) {
      this.isSpeakerMuted = !this.isSpeakerMuted;
      // Set gain to 0 for mute, 1 for unmute
      this.outputGainNode.gain.value = this.isSpeakerMuted ? 0 : 1;
      console.log(`[LiveGeminiService] Speaker ${this.isSpeakerMuted ? 'muted' : 'unmuted'}`);
    }
    return this.isSpeakerMuted;
  }

  /**
   * Get current mic mute state
   */
  getMicMuted(): boolean {
    return this.isMicMuted;
  }

  /**
   * Get current speaker mute state
   */
  getSpeakerMuted(): boolean {
    return this.isSpeakerMuted;
  }
}