import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  analyzeCrisisTriage,
  optimizeDispatchMatrix,
  generateIncidentActionPlan,
  generateEmergencyBroadcast,
} from './server/gemini.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON payload with larger limit for base64 image data
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CrisisFlow AI Intelligence Grid',
      timestamp: new Date().toISOString(),
      capabilities: ['MULTIMODAL_TRIAGE', 'LOGISTICS_OPTIMIZATION', 'IAP_GENERATION', 'BROADCAST_SYSTEM'],
    });
  });

  // 1. Multimodal AI Triage Endpoint
  app.post('/api/triage/analyze', async (req, res) => {
    try {
      const { title, description, imageBase64, mimeType, disasterType } = req.body;
      if (!description && !imageBase64) {
        return res.status(400).json({ error: 'Description or drone image is required.' });
      }

      const result = await analyzeCrisisTriage({
        title,
        description: description || 'Visual drone reconnaissance survey analysis requested.',
        imageBase64,
        mimeType,
        disasterType,
      });

      res.json({ success: true, result });
    } catch (error: any) {
      console.error('Error in /api/triage/analyze:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze incident triage.' });
    }
  });

  // 2. Dispatch Optimization Matrix Endpoint
  app.post('/api/dispatch/optimize', async (req, res) => {
    try {
      const { incidents, units } = req.body;
      if (!incidents || !units) {
        return res.status(400).json({ error: 'Incidents and units arrays are required.' });
      }

      const dispatchPlan = await optimizeDispatchMatrix({ incidents, units });
      res.json({ success: true, dispatchPlan });
    } catch (error: any) {
      console.error('Error in /api/dispatch/optimize:', error);
      res.status(500).json({ error: error.message || 'Failed to optimize dispatch matrix.' });
    }
  });

  // 3. Incident Action Plan (IAP) Endpoint
  app.post('/api/iap/generate', async (req, res) => {
    try {
      const { incidents, units, depots, scenarioName } = req.body;
      const iap = await generateIncidentActionPlan({
        incidents: incidents || [],
        units: units || [],
        depots: depots || [],
        scenarioName,
      });

      res.json({ success: true, iap });
    } catch (error: any) {
      console.error('Error in /api/iap/generate:', error);
      res.status(500).json({ error: error.message || 'Failed to generate IAP.' });
    }
  });

  // 4. Emergency Broadcast Generator Endpoint
  app.post('/api/broadcast/generate', async (req, res) => {
    try {
      const { incident, targetLanguage, languageCode, channel } = req.body;
      if (!incident) {
        return res.status(400).json({ error: 'Incident payload is required.' });
      }

      const broadcast = await generateEmergencyBroadcast({
        incident,
        targetLanguage: targetLanguage || 'English',
        languageCode: languageCode || 'en',
        channel: channel || 'ALL',
      });

      res.json({ success: true, broadcast });
    } catch (error: any) {
      console.error('Error in /api/broadcast/generate:', error);
      res.status(500).json({ error: error.message || 'Failed to generate emergency broadcast.' });
    }
  });

  // Vite Middleware / Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CrisisFlow AI server running on http://localhost:${PORT}`);
  });
}

startServer();
