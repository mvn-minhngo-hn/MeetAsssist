import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendMeetingNotes } from './notificationService';

admin.initializeApp();

// CORS configuration
const corsOptions = {
  origin: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

/**
 * Main endpoint to send meeting notes to multiple channels
 * POST /send-meeting-notes
 */
export const sendMeetingNotesHandler = functions.https.onRequest(async (req, res) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // Parse request body
    const payload = req.body;

    // Validate payload structure
    if (!payload || !payload.channels || !payload.meetingData) {
      res.status(400).json({ error: 'Invalid payload structure' });
      return;
    }

    // Validate at least one channel is selected
    const selectedChannels = Object.keys(payload.channels).filter(
      (key) => payload.channels[key] !== undefined
    );

    if (selectedChannels.length === 0) {
      res.status(400).json({ error: 'At least one channel must be selected' });
      return;
    }

    // Send notifications to all selected channels
    const results = await sendMeetingNotes(payload);

    res.set('Access-Control-Allow-Origin', '*');
    res.json({
      success: true,
      results,
      message: `Successfully sent to ${Object.values(results).filter(r => r.success).length}/${selectedChannels.length} channels`,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.set('Access-Control-Allow-Origin', '*');
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

