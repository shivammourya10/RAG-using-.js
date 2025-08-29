import * as dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';

dotenv.config({ path: '../../.env' });

export async function clearSession(sessionId) {
  try {
    console.log(`Clearing session ${sessionId}...`);

    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // Delete all vectors in the session's namespace
    await pineconeIndex.namespace(sessionId).deleteAll();

    console.log(`✅ Session ${sessionId} cleared from Pinecone`);
    return { success: true };

  } catch (error) {
    console.error(`❌ Error clearing session ${sessionId}:`, error);
    throw new Error(`Failed to clear session: ${error.message}`);
  }
}

export async function getSessionStats(sessionId) {
  try {
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const stats = await pineconeIndex.describeIndexStats();
    const namespaceStats = stats.namespaces?.[sessionId];

    return {
      sessionId,
      vectorCount: namespaceStats?.vectorCount || 0,
      exists: !!namespaceStats
    };

  } catch (error) {
    console.error(`❌ Error getting session stats for ${sessionId}:`, error);
    return {
      sessionId,
      vectorCount: 0,
      exists: false,
      error: error.message
    };
  }
}
