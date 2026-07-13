const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

// Parse env manually
const envPath = path.join(__dirname, '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error("Could not read .env.local file.");
  process.exit(1);
}

const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
  if (match) {
    const key = match[1];
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.substring(1, val.length - 1);
    }
    env[key] = val.trim();
  }
});

const dbUrl = env.DATABASE_URL;
const emailUser = env.EMAIL_SERVER_USER;
const emailPass = env.EMAIL_SERVER_PASSWORD;
const siteUrl = 'https://www.saytamil.com'; // Hardcoded production URL for logo & links

if (!dbUrl || !emailUser || !emailPass) {
  console.error("Missing required environment variables in .env.local!");
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

async function main() {
  const dryRun = !process.argv.includes('--send');
  if (dryRun) {
    console.log("=== DRY RUN MODE ===");
    console.log("To actually send the corrections, run: node send_corrections.js --send\n");
  } else {
    console.log("=== LIVE MODE: SENDING CORRECTION EMAILS ===");
  }

  const { rows: users } = await pool.query("SELECT email, name FROM users");
  console.log(`Found ${users.length} users in database.`);

  for (const user of users) {
    const email = user.email;
    const name = user.name || 'Writer';

    const subject = "✍️ [Correction] Access your July writing credits here!";
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${siteUrl}/saytamil-logo.png" alt="SayTamil Logo" style="width: 80px; height: 80px; border-radius: 20px; object-fit: cover;">
          <h1 style="color: #0f172a; margin-top: 15px; font-size: 24px;">SayTamil</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: -5px;">Your AI Tamil Writing Assistant</p>
        </div>

        <div style="background-color: #fffbeb; border-radius: 16px; padding: 25px; border: 1px solid #fef3c7; margin-bottom: 25px;">
          <p style="font-size: 16px; margin-top: 0; font-weight: bold; color: #b45309;">⚠️ Apology for the incorrect link</p>
          <p style="font-size: 15px; color: #b45309; margin-bottom: 0;">We sent an email earlier containing an incorrect local link to the editor. We sincerely apologize for the confusion! Below is the correct working link to access your credits.</p>
        </div>

        <div style="background-color: #f8fafc; border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0; margin-bottom: 25px;">
          <p style="font-size: 16px; margin-top: 0;">Hi ${name},</p>
          
          <p style="font-size: 16px;">Your account has been successfully credited with <b>20 Free Writing Credits</b> for the month of July! 🌟</p>
          
          <p style="font-size: 15px; color: #475569;">You can use them to check Tamil grammar and spelling, or use our phonetic English-to-Tamil typing tool to craft perfect Tamil content.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/tool" style="background-color: #0d9488; color: #ffffff; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.2);">Access the Writing Tool</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;">

          <h3 style="color: #0f172a; font-size: 15px; margin-bottom: 10px;">💡 SayTamil Features</h3>
          <ul style="padding-left: 20px; margin-top: 0; color: #475569; font-size: 14px;">
            <li style="margin-bottom: 8px;"><b>Grammar & Spelling:</b> Real-time correction of Tamil sandhi and spelling errors.</li>
            <li style="margin-bottom: 8px;"><b>English-to-Tamil Transliteration:</b> Type "vanakkam" to automatically write "வணக்கம்".</li>
            <li style="margin-bottom: 8px;"><b>100% Free:</b> We have no paid plans, no hidden subscriptions. It's completely free.</li>
          </ul>
        </div>

        <p style="font-size: 13px; color: #64748b; text-align: center;">
          Your 20 credits reset automatically on the 1st of every month.
        </p>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p>© 2026 SayTamil. Made with ❤️ for Tamil writers.</p>
        </div>
      </div>
    `;

    if (dryRun) {
      console.log(`[DRY RUN] Would send correction to: ${name} <${email}>`);
    } else {
      try {
        await transporter.sendMail({
          from: `"SayTamil" <${emailUser}>`,
          to: email,
          subject: subject,
          html: html
        });
        console.log(`Sent correction email to: ${name} <${email}>`);
      } catch (err) {
        console.error(`Failed to send email to ${email}:`, err.message);
      }
    }
  }

  pool.end();
}

main().catch(err => {
  console.error("Main execution failed:", err);
  pool.end();
});
