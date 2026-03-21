# SayTamil - Product Overview

SayTamil is an AI-powered Tamil writing assistant web app. It helps users write, check, and improve Tamil text through grammar analysis, spelling correction, and transliteration support.

## Core Features
- Tamil grammar and spelling analysis via Gemini AI
- Transliteration (English phonetic → Tamil script)
- Chat-based interface for iterative writing assistance
- User authentication (email/password + Google OAuth)
- Per-user daily usage limits (free plan: 10 analyses/day)
- Persistent chat history stored in PostgreSQL

## Target Users
Tamil speakers and learners who want AI-assisted writing help in their native language.

## AI Behavior
- Grammar checker is strict: only flags real errors, never style suggestions
- All AI feedback reasons are written in Tamil
- Gemini API key rotation with rate limit handling (3-second minimum between requests)
