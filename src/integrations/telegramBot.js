/**
 * Telegram Bot Integration
 * Syncs documents to Telegram channel
 * 
 * Setup:
 * 1. Create bot at https://telegram.me/botfather
 * 2. Get bot token and channel ID
 * 3. Set environment variables:
 *    - TELEGRAM_BOT_TOKEN=your_token
 *    - TELEGRAM_CHANNEL_ID=your_channel_id
 */

import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

if (!BOT_TOKEN || !CHANNEL_ID) {
  console.error('❌ Error: Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID environment variables');
  console.log('\nSetup Instructions:');
  console.log('1. Create bot at https://telegram.me/botfather');
  console.log('2. Get bot token and channel ID');
  console.log('3. Set environment variables:');
  console.log('   Windows: set TELEGRAM_BOT_TOKEN=your_token');
  console.log('   Linux/Mac: export TELEGRAM_BOT_TOKEN=your_token');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

/**
 * Upload document to Telegram channel
 */
async function uploadDocument(filePath, caption = '') {
  try {
    const fileName = path.basename(filePath);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log(`📤 Uploading: ${fileName}`);

    const result = await bot.sendDocument(CHANNEL_ID, filePath, {
      caption: caption || fileName,
      parse_mode: 'HTML'
    });

    console.log(`✅ Uploaded successfully: ${fileName}`);
    return result;
  } catch (error) {
    console.error(`❌ Error uploading document:`, error.message);
    throw error;
  }
}

/**
 * Create organized folder/message in Telegram
 * (Telegram doesn't support folders, so we create a message with a link)
 */
async function createFolderMessage(program, year, semester) {
  const message = `📚 <b>${program}</b>\n<b>${year}</b> - <b>${semester}</b>\n\n---`;
  
  try {
    const result = await bot.sendMessage(CHANNEL_ID, message, {
      parse_mode: 'HTML'
    });
    return result.message_id;
  } catch (error) {
    console.error('Error creating folder message:', error.message);
    throw error;
  }
}

/**
 * Sync all documents from local folder to Telegram
 */
async function syncAllDocuments(docsDir = '../../public/documents') {
  try {
    const baseDir = path.join(__dirname, docsDir);

    if (!fs.existsSync(baseDir)) {
      throw new Error(`Documents directory not found: ${baseDir}`);
    }

    console.log('🔄 Starting document sync to Telegram...\n');

    const walkDir = (dir, relativePath = '') => {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const filePath = path.join(dir, file);
        const relPath = path.join(relativePath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath, relPath);
        } else if (file.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i)) {
          // Upload supported document formats
          const parts = relPath.split(path.sep);
          const caption = `📄 <b>${parts.join(' / ')}</b>\n\nFile: ${file}`;

          uploadDocument(filePath, caption)
            .catch(err => console.error(`Failed to upload ${file}:`, err.message));
        }
      });
    };

    walkDir(baseDir);
    console.log('\n✅ Sync process started. Check Telegram channel for uploads.');

  } catch (error) {
    console.error('❌ Error during sync:', error.message);
    throw error;
  }
}

/**
 * List documents that will be uploaded
 */
async function listDocuments(docsDir = '../../public/documents') {
  try {
    const baseDir = path.join(__dirname, docsDir);
    const documents = [];

    const walkDir = (dir, relativePath = '') => {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const filePath = path.join(dir, file);
        const relPath = path.join(relativePath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath, relPath);
        } else if (file.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i)) {
          documents.push({
            fileName: file,
            path: relPath,
            size: (stat.size / 1024 / 1024).toFixed(2) + ' MB'
          });
        }
      });
    };

    walkDir(baseDir);
    return documents;

  } catch (error) {
    console.error('Error listing documents:', error.message);
    throw error;
  }
}

/**
 * Send a summary message to Telegram
 */
async function sendSummary(stats) {
  const message = `
📊 <b>Document Upload Summary</b>

<b>Statistics:</b>
• Total Files: ${stats.totalFiles}
• Total Size: ${stats.totalSize}
• Programs: ${stats.programs?.join(', ')}

✅ All documents synced to channel!
  `.trim();

  try {
    await bot.sendMessage(CHANNEL_ID, message, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error sending summary:', error.message);
  }
}

// CLI Commands
const command = process.argv[2] || 'help';

async function executeCommand() {
  switch (command) {
    case 'list':
      console.log('\n📋 Documents Ready for Upload:\n');
      const docs = await listDocuments();
      docs.forEach((doc, idx) => {
        console.log(`${idx + 1}. ${doc.fileName} (${doc.size})`);
        console.log(`   Path: ${doc.path}\n`);
      });
      console.log(`\nTotal: ${docs.length} documents\n`);
      break;

    case 'sync':
      console.log(`\n🔐 Syncing to Telegram Channel: ${CHANNEL_ID}\n`);
      await syncAllDocuments();
      break;

    case 'test':
      console.log('\n🧪 Testing Telegram Connection...\n');
      try {
        const result = await bot.sendMessage(
          CHANNEL_ID,
          '✅ Agri Portal Document Bot Connected Successfully!'
        );
        console.log('✅ Connection successful!');
        console.log(`Message ID: ${result.message_id}\n`);
      } catch (error) {
        console.error('❌ Connection failed:', error.message);
      }
      break;

    case 'help':
    default:
      console.log(`
🤖 Telegram Document Bot

Usage: node telegramBot.js [command]

Commands:
  list        List documents ready to upload
  sync        Sync all documents to Telegram
  test        Test Telegram connection
  help        Show this help message

Setup:
  1. Create bot at https://telegram.me/botfather
  2. Get bot token and channel ID
  3. Set environment variables:
     Windows CMD:  set TELEGRAM_BOT_TOKEN=your_token
                   set TELEGRAM_CHANNEL_ID=your_channel_id
     Windows PS:   $env:TELEGRAM_BOT_TOKEN="your_token"
                   $env:TELEGRAM_CHANNEL_ID="your_channel_id"
     Linux/Mac:    export TELEGRAM_BOT_TOKEN=your_token
                   export TELEGRAM_CHANNEL_ID=your_channel_id

Examples:
  node telegramBot.js list        # Preview documents
  node telegramBot.js test        # Test connection
  node telegramBot.js sync        # Sync to Telegram

Note: Channel ID format is usually @channelname or -123456789
      `);
      break;
  }
}

executeCommand().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});

export { uploadDocument, syncAllDocuments, listDocuments, bot };
