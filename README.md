# Electricity Meter Bot - Railway Deployment

Automated electricity meter scraper that runs daily at 8 AM and sends data to Telegram.

## Quick Railway Deployment

### 1. Connect to Railway
- Visit [railway.app](https://railway.app)
- Connect your GitHub account
- Deploy this repository

### 2. Set Environment Variables
In Railway dashboard, add these environment variables:

```
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_CHAT_ID=your_telegram_chat_id
METER_WEBSITE_URL=https://prepaid.desco.org.bd/customer/#/customer-login
```

### 3. Deploy
Railway will automatically build and deploy using the Dockerfile.

## Features
- ⏰ Runs daily at 8:00 AM
- 📱 Sends formatted messages to Telegram
- 💰 Tracks remaining balance
- ⏰ Shows last reading time
- 💳 Last recharge information
- 🔄 Auto-restart on failure

## Required Environment Variables
- `TELEGRAM_BOT_TOKEN`: Get from @BotFather
- `TELEGRAM_CHAT_ID`: Your Telegram chat ID
- `METER_WEBSITE_URL`: Electricity meter website URL

## Testing
Set `TEST_RUN=true` to run immediately for testing.

## Files Structure
- `scraper.py`: Main scraping logic
- `telegram_bot.py`: Telegram integration
- `scheduled_scraper.py`: Scheduler and main entry point
- `Dockerfile`: Container configuration
- `requirements.txt`: Python dependencies
- `railway.json`: Railway deployment configuration