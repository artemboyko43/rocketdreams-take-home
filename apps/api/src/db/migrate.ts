import { sqlClient } from "./client.ts";

export async function migrate() {
  await sqlClient`
    CREATE TABLE IF NOT EXISTS faqs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      category text NOT NULL,
      question text NOT NULL,
      answer text NOT NULL,
      tags text[] NOT NULL DEFAULT ARRAY[]::text[],
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sqlClient`
    CREATE TABLE IF NOT EXISTS unanswered_questions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      question text NOT NULL,
      normalized_question text NOT NULL UNIQUE,
      frequency integer NOT NULL DEFAULT 1,
      status text NOT NULL DEFAULT 'open',
      converted_faq_id uuid,
      first_asked_at timestamptz NOT NULL DEFAULT now(),
      last_asked_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sqlClient`
    CREATE TABLE IF NOT EXISTS settings (
      id integer PRIMARY KEY DEFAULT 1,
      active_voice_id text NOT NULL DEFAULT 'james',
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sqlClient`CREATE INDEX IF NOT EXISTS faqs_category_idx ON faqs (category)`;
  await sqlClient`CREATE INDEX IF NOT EXISTS unanswered_status_idx ON unanswered_questions (status, last_asked_at DESC)`;
  await sqlClient`INSERT INTO settings (id, active_voice_id) VALUES (1, 'james') ON CONFLICT (id) DO NOTHING`;
}
