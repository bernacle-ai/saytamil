import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import pool, { createUsersTable } from '@/lib/db';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await createUsersTable();
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
        const user = result.rows[0];
        if (!user || !user.password_hash) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await createUsersTable();
          await pool.query(
            `INSERT INTO users (email, google_id, name, image)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (email) DO UPDATE SET google_id = $2, name = $3, image = $4`,
            [user.email, account.providerAccountId, user.name, user.image]
          );
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'unknown error';
          console.error('Google sign-in: failed to upsert user record.', process.env.NODE_ENV === 'development' ? msg : '');
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const result = await pool.query(
          'SELECT id, name, email, image, created_at FROM users WHERE email = $1',
          [session.user.email]
        );
        if (result.rows[0]) session.user = { ...session.user, ...result.rows[0] };
      }
      return session;
    },
  },
  pages: { signIn: '/tool', error: '/tool' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};
